class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // säg åt phaser att lägga till /assets i alla paths
        this.load.setBaseURL('/assets');
        this.load.image('background', '/images/background.png');
        this.load.image('spike', '/images/spike.png');
        this.load.spritesheet('gifts', '/images/hp.png', {
            frameWidth: 128,
            frameHeight: 196,
        });
        
        this.load.atlas(
            'player',
            '/images/jefrens_hero.png',
            '/images/jefrens_hero.json'
        );
        this.load.atlas(
            'foe',
            '/images/jefrens_foe.png',
            '/images/jefrens_foe.json'
        );
        this.load.image('tiles', '/tilesets/jefrens_tilesheet.png');
        this.load.image('tiles', '/tilesets/jefrens_tilesheeet.png');

        // här laddar vi in en tilemap med spelets "karta"
        this.load.tilemapTiledJSON('map', '/tilemaps/level1.json');

    }

    create() {
        this.scene.start('menu');
    }
}

export default PreloadScene;