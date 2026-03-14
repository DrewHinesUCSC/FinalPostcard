class End extends Phaser.Scene {
    constructor() {
        super('EndScene')
    }

    create() {
        // Placeholder end screen
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Congratulations!\n\nYou experienced all of New Orleans!\n\nThanks for playing.\n\n[Press R to Return to Menu]',
            {
                fontSize: '16px',
                fill: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5)

        // R key to restart
        this.rKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        )
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start('MenuScene')
            
        }
    }
}
