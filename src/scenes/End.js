class End extends Phaser.Scene {
    constructor() {
        super('EndScene')
    }

    preload() {
        this.load.image('endCard', './assets/EndPC.png')
    }

    create() {
        // created postcard image using photoshop and adobe stock images
        // along with childhood photo from personal reel
        // created css using Prof. Altice's 'Framing' repository as template
        this.cameras.main.setBackgroundColor('#000000')

        // postcard image centered in the scene
        this.add.image(centerX, centerY, 'endCard')

        // keep text below image to return to menu to restart game
        this.add.text(centerX, centerY + 115, 'Press R to Return to Menu', {
            fontSize: '8px',
            fill: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5)

        // us animate css to do postcard flip
        this.game.canvas.classList.add('postcard-flip')

        this.rKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        )
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start('MenuScene')
        }
    }

    shutdown() {
        // Remove animation class so it doesn't carry into other scenes
        this.game.canvas.classList.remove('postcard-flip')
    }
}
