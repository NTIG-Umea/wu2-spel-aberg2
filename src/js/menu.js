class menu extends Phaser.Scene {
    constructor() {
        {
            super('menu')
        }
    }


    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0)

        const helloButton = this.add.text(365, 200, 'Start Game', { fontSize: '25px', fill: '#ffffff' });
        helloButton.setInteractive()
            .on('pointerdown', () => this.scene.start('PlayScene'));

        const exitButton = this.add.text(372, 240, 'Quit Game', { fontSize: '25px', fill: '#ffffff' });
        exitButton.setInteractive()
            .on('pointerdown', () => alert("Hello! I am an alert box!!"));

    }
}
/*const width = this.scale.width
 const height = this.scale.height
 this.add.image(width *0,5, height * 0,5, 'background').setOrigin(0,0)*/



export default menu;