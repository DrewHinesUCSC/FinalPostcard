class Play extends Phaser.Scene{
    constructor(){
        super('PlayScene')
    }

    init(){
        this.VEL = 175
    }

    preload(){
        this.load.image('map', './assets/tilemap.png')
        this.load.spritesheet('sprites', 'tilemap.png',{
            frameWidth: 16
        })
        this.load.tilemapTiledJSON('postcard', 'assets/FinalPostcard.json')
    }

    create(){
        const map = this.add.tilemap('postcard')
        const tileset = map.addTilesetImage('tilemap', 'map')
        const bgLayer = map.createLayer('bgLayer', tileset, 0,0)
        const collisionLayer = map.createLayer('Collide', tileset, 0,0)

        collisionLayer.setCollisionByProperty({collides: true})

        this.p1 = this.physics.add.sprite(centerX*3, centerY*3, 'sprites', 222)
        this.p1.body.setCollideWorldBounds(true)

        this.cam = this.cameras.main
        this.cam.setBounds(0,0, map.widthInPixels, map.heightInPixels)
        this.cam.centerOn(this.p1.x, this.p1.y)

        this.physics.world.bounds.setTo(0,0, map.widthInPixels, map.heightInPixels)

        this.physics.add.collider(this.p1, collisionLayer)

        cursors = this.input.keyboard.createCursorKeys()
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
        this.p1.setVelocity(this.VEL * this.playerDirection.x, this.VEL*this.playerDirection.y)
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