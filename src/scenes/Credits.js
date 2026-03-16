class Credits extends Phaser.Scene {
    constructor() {
        super('CreditScene')
    }

    preload(){
        this.load.image('pccredits', './assets/PCCredits.png')
    }

    create() {
         
        this.cameras.main.setBackgroundColor('#000000')

        // credit image centered in the scene
        this.add.image(centerX, centerY, 'pccredits')

        // keep text below image to return to menu to restart game
        this.add.text(centerX, centerY + 130, 'Press M for Menu', {
            fontSize: '16px',
            fill: '#eef4f6ff',
            align: 'center'
        }).setOrigin(0.5)
        // M key to return to menu
        this.mKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.M
        )
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.mKey)) {
            this.scene.start('MenuScene')
            
        }
    }
}
