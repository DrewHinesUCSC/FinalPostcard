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

        //creating NPC chars to interact with player, will add in dialog later
        const tarotObj = map.getObjectLayer('TarotRdr').objects[0]
        this.tarotRdr = this.physics.add.staticSprite(
            tarotObj.x + tarotObj.width/2,
            tarotObj.y - tarotObj.height/2,
            'tarotNPC', 68)

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