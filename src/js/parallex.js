class parallex extends Phaser.Scene {
    constructor() {
    {
        super('parallex')
    }
}

    
    create ()
    {
       this.add.image(0, 0, 'background').setOrigin(0, 0)

       /*const width = this.scale.width
        const height = this.scale.height
        this.add.image(width *0,5, height * 0,5, 'background').setOrigin(0,0)*/
        
    }
}
export default parallex;