import GameScene from "./GameScene.js"
import WelcomeScene from "./WelcomeScene.js"
import PreloaderScene from "./PreloaderScene.js"
import InterfaceScene from "./InterfaceScene.js"
import MarketScene from "./MarketScene.js"

const config = {
    width: 400,
    height: 300,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 2,
    },
    backgroundColor: "#111111",
    pixelArt: true, // supposed to avoid blur in scaling. I didn't experience any anyway
    type: Phaser.AUTO,
    parent: "game",
    scene: [PreloaderScene, 
            WelcomeScene, 
            GameScene,
            InterfaceScene,
            MarketScene
            ],
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: DEBUG,
            gravity:{y: 0},
        } 
    },

}
console.log("0 Loading game")
// const settings = new Settings()
globalGame = new Phaser.Game(config)
console.log("1 Game loaded")

// Necessary?
window.focus()