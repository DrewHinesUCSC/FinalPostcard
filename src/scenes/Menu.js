class Menu extends Phaser.Scene{
    constructor(){
        super("MenuScene")
    }

    preload(){
        //load images/sprites/sounds
        this.load.image('title','./assets/NolaTitle.png')
        this.load.audio('Andromeda', './assets/Andromeda.wav')
        
    }

    create(){
        this.add.image(0,0, 'title').setOrigin(0,0)
        this.bgMusic = this.sound.add('Andromeda',{
            volume: 0.2,
            loop: true
        })
        this.bgMusic.play()

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.CKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    }
    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keySpace)){
            this.bgMusic.stop()
            this.scene.start('PlayScene')
        }
        if(Phaser.Input.Keyboard.JustDown(this.CKey)){
            this.bgMusic.stop()
            this.scene.start('CreditScene')      
        }
    }
}