class Play extends Phaser.Scene{
    constructor(){
        super('PlayScene')
    }

    init(){
        this.VEL = 175
    }

    preload(){
        this.load.image('map', './assets/tilemap.png')
        this.load.image('interiors', './assets/Interiors_free_16x16.png')
        this.load.image('walls','./assets/sprite5.png')
        this.load.image('NO','./assets/NO.png')
        this.load.spritesheet('tarotNPC','./assets/NPC16.png',{
            frameWidth: 16,
            frameHeight: 16

        })
        this.load.spritesheet('sprites', './assets/tilemap.png', {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 1
        })
        this.load.tilemapTiledJSON('postcard', 'assets/FinalPostcard.json')

        //loading audio for stepSFX and bgMusic
        this.load.audio('steps', './assets/Steps.wav')
        this.load.audio('bgMusic','./assets/Andromeda.wav')
    }

    create(){
        const map = this.add.tilemap('postcard')
        const tileset = map.addTilesetImage('Temp', 'map')
        const tilesetInteriors = map.addTilesetImage('Interiors', 'interiors')
        const tilesetWalls = map.addTilesetImage('Walls','walls')
        const groundLayer = map.createLayer('Ground', 
            [tileset, tilesetInteriors,tilesetWalls], 0, 0)
        const housesLayer = map.createLayer('Houses', 
            [tileset, tilesetInteriors, tilesetWalls], 0, 0)

            //adding footstep sounds
        this.stepsSFX = this.sound.add('steps',{
            loop: true,
            volume: 0.5
        })

        //adding bgMusic
        this.bgMusic = this.sound.add('bgMusic',{
            loop: true,
            volume: 0.2
        })
        this.bgMusic.play()

        //creating NPC chars to interact with player, will add in dialog later
        const tarotObj = map.getObjectLayer('TarotRdr').objects[0]
        this.tarotRdr = this.physics.add.staticSprite(
            tarotObj.x + tarotObj.width/2,
            tarotObj.y - tarotObj.height/2,
            'tarotNPC', 68)

        //trying out dialog method similar to dialogbox CP in class, might
        //change but I'll see how this works first. Not sure there will be enough
        // dialog to use a whole JSON file as it will be minimal
        this.dialogLines = [
            "Let's see what the cards have in store for you..."
        ]
        this.dialogIndex = 0
        this.inDialog = false
        this.canTriggerDialog = true

        //Going to use simple phaser box graphics
        this.dialogBox = this.add.graphics()
        this.dialogBox.setScrollFactor(0)
        this.dialogBox.setDepth(10)
        this.dialogBox.setVisible(false) //will trigger true with overlap

        this.dialogText = this.add.text(20, this.game.config.height - 90, '',{
            fontSize: '10px',
            fill: '#ffffff',
            wordWrap: {width: this.game.config.width - 40}
        })
        this.dialogText.setScrollFactor(0)
        this.dialogText.setDepth(11)
        this.dialogText.setVisible(false)

        //P1 will be frozen during dialog, adding space key to advance
        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        )

        // Had issues with collide object layer working with Tiled, found some ideas 
        // from Youtuber ourcade: https://www.youtube.com/@ourcadetv
        //Builds rectangles around objects

        const collideObjects = map.getObjectLayer('Collide').objects
        const collideGroup = this.physics.add.staticGroup()
        collideObjects.forEach(obj => {
            const rect = this.add.rectangle(
                obj.x + obj.width / 2,
                obj.y + obj.height / 2,
                obj.width,
                obj.height
            )
            this.physics.add.existing(rect, true)
            collideGroup.add(rect)
        })

        this.p1 = this.physics.add.sprite(centerX*3, centerY*3, 'sprites', 24)
        this.p1.body.setCollideWorldBounds(true)

        this.cam = this.cameras.main
        this.cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cam.centerOn(this.p1.x, this.p1.y)

        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels)

        this.physics.add.collider(this.p1, collideGroup)

        // Overlap with TarotRdr NPC triggers dialog
        this.physics.add.overlap(this.p1, this.tarotRdr, () => {
            if(!this.inDialog && this.canTriggerDialog){
                this.inDialog = true
                this.canTriggerDialog = false
                this.dialogIndex = 0
                this.showDialog()
            }
        })

        cursors = this.input.keyboard.createCursorKeys()

        // Walk animations mae from spritesheet
        this.anims.create({
            key: 'walk-left',
            frames: [
                { key: 'sprites', frame: 23 },
                { key: 'sprites', frame: 50 },
                { key: 'sprites', frame: 77 }
            ],
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walk-down',
            frames: [
                { key: 'sprites', frame: 24 },
                { key: 'sprites', frame: 51 },
                { key: 'sprites', frame: 78 }
            ],
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walk-up',
            frames: [
                { key: 'sprites', frame: 25 },
                { key: 'sprites', frame: 52 },
                { key: 'sprites', frame: 79 }
            ],
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walk-right',
            frames: [
                { key: 'sprites', frame: 26 },
                { key: 'sprites', frame: 53 },
                { key: 'sprites', frame: 80 }
            ],
            frameRate: 8,
            repeat: -1
        })
    }

    update(){

        //freeze durng dialog, space key to advance index and trigger movement
        if(this.inDialog){
            this.p1.setVelocity(0,0)
            this.p1.anims.stop()
            if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){
                this.dialogIndex++
                if(this.dialogIndex < this.dialogLines.length){
                    this.showDialog()
                } else {
                    this.inDialog = false
                    this.dialogBox.setVisible(false)
                    this.dialogText.setVisible(false)
                    // had issue with dialog box repeatdly showing up and player remaining
                    //frozen, added delay so p1 can walk away
                    this.time.delayedCall(1000, () => {
                        this.canTriggerDialog = true
                    })
                }
            }
            return
        }

        this.checkCamBounds(this.p1, this.cam)

        this.playerDirection = new Phaser.Math.Vector2()

        if(cursors.left.isDown){
            this.playerDirection.x = -1
        }
        if(cursors.right.isDown){
            this.playerDirection.x = 1
        }
        if(cursors.up.isDown){
            this.playerDirection.y = -1
        }
        if(cursors.down.isDown){
            this.playerDirection.y = 1
        }

        this.playerDirection.normalize()
        this.p1.setVelocity(this.VEL * this.playerDirection.x, this.VEL * this.playerDirection.y)

        // Walking animations 
        if(cursors.left.isDown){
            this.p1.anims.play('walk-left', true)
        } else if(cursors.right.isDown){
            this.p1.anims.play('walk-right', true)
        } else if(cursors.up.isDown){
            this.p1.anims.play('walk-up', true)
        } else if(cursors.down.isDown){
            this.p1.anims.play('walk-down', true)
        } else {
            this.p1.anims.stop()
        }

        //Footstep sounds, used same logic as last project
        const isMoving = cursors.left.isDown || cursors.right.isDown ||
                         cursors.up.isDown   || cursors.down.isDown
        if(isMoving && !this.stepsSFX.isPlaying) {
            this.stepsSFX.play()
        } else if(!isMoving && this.stepsSFX.isPlaying) {
            this.stepsSFX.stop()
        }
    }

    showDialog(){
            const boxX = 10
            const boxY = this.game.config.height - 100
            const boxW = this.game.config.width - 20

            const boxH = 90

            this.dialogBox.clear()
            this.dialogBox.fillStyle(0x000000, 0.8)
            this.dialogBox.fillRect(boxX,boxY,boxW,boxH)
            this.dialogBox.lineStyle(2, 0xffffff, 1)
            this.dialogBox.strokeRect(boxX,boxY,boxW,boxH)
            this.dialogBox.setVisible(true)

            this.dialogText.setText(
                this.dialogLines[this.dialogIndex] + '\n SPACE to Continue'
            )
            this.dialogText.setVisible(true)
        }

    checkCamBounds(obj, cam){
        if(obj.x + obj.width/2 > cam.width + cam.scrollX){
            cam.setScroll(cam.scrollX + cam.width, cam.scrollY)
            obj.x = cam.scrollX + obj.width/2
        } else if(obj.x - obj.width/2 < cam.scrollX){
            cam.setScroll(cam.scrollX - cam.width, cam.scrollY)
            obj.x = cam.scrollX + w - obj.width/2
        } else if(obj.y + obj.height/2 > cam.height + cam.scrollY){
            cam.setScroll(cam.scrollX, cam.scrollY + cam.height)
            obj.y = cam.scrollY + obj.height/2
        } else if(obj.y - obj.height/2 < cam.scrollY){
            cam.setScroll(cam.scrollX, cam.scrollY - cam.height)
            obj.y = cam.scrollY + cam.height - obj.height/2
        }
    }
}