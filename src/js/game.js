// importera alla scener
import PlayScene from './play-scene';
import PreloadScene from './preload-scene';
import MenuScene from './menu-scene';
import menu from './menu';

// spelets config
const config = {
    type: Phaser.AUTO,
    width: 896,
    height: 448,
    pixelArt: true,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            //enableBody: true,
            debug: true
        }
    },
    scene: [PreloadScene, PlayScene, MenuScene, menu],
    parent: 'game'
};

// initiera spelet
new Phaser.Game(config);
