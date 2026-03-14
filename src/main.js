/*
Drew Hines
03/08/2026
Setting up prototype using Professor Altice ScrollingStyles
as a template, using to test if i have properly created the tilemap
using Tiled and everything will load. I will replace movement with FSM
and current buildings are (hopefully) temporary.
03/08
Built out 1st "restaurant area", will be adding sounds and audio track tomorrow
and work on getting 2nd area, possible bar scene. Added new tilemap and assets 
*/


'use strict'

//game object

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade:{
        //debug: true
        }
    },
    zoom: 2,
    width: 320,
    height: 320,
    scene: [ Menu,Play, End, Credits]
}

const game = new Phaser.Game(config)

const centerX = game.config.width/2
const centerY = game.config.height/2
const w = game.config.width
const h = game.config.height
let cursors = null