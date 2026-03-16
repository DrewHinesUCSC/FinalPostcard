/*
Drew Hines
03/16/2026
Final Postcard that is a postcard memory to my siblings that serves as 
a memento of our childhood growing up in South Louisiana. We spent most weekends in
New Orleans, and we often make reunion trips there. This is to evoke 
those memories with typical New Orleans activities.
After completing the four activities, the postcard will flip over to reveal a pic
of us in postcard format. The project fits the postcard prompt as postcards are often
sent as mementos that capture time and places.
Note: Pressing the 'P' key during the main game play will send you direct to the
final postcard scene without having to complete all activities

The five major Phaser components used:
1) Arcade Physics System
2) Tilemaps imported using Tiled
3) Animation Manager
4) Camera, used ScrollingStyles as reference for Zelda-style camera movements
5) Text Objects, initally planned to use Json file as demonstrated in class, but
kept dialog to a minimum instead. Also used a cooldown timer in dialog scenes, otherwise
players become stuck during overlaps





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