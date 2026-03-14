class Credits extends Phaser.Scene {
    constructor() {
        super('CreditScene')
    }

    create() {
        // Placeholder end screen
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Credits, TBA..\n\nThanks for playing.\n\n[Press M for Menu]',
            {
                fontSize: '16px',
                fill: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5)

        // R key to restart
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
