Simple-HTML5-Game-Engine
========================

A simple to use HTML5 Canvas Engine for 2D Games. You can add text, buttons, spites and group them. As stated, this is a very simple game engine but can be easy expaned.

## Features

This game engine is build to make fast 2D games. 

* **Game**
  * Multiple layers where you can add sprites, buttons and text to
  * Keyboard and mouse actions
  * Change overal alpha of the game
  * Rotate, alpha, move and scale a layer
* **Sprites**
  * Scale
  * Rotate
  * Alpha
  * Mask
  * Change color
  * Mouse actions
* **Buttons**
  * Scale
  * Rotate
  * Alpha
  * Label
  * Make it an select box
* **Text, text is written to a buffer for faster drawing**
  * Size
  * Font
  * Weight
  * Color
  * Align
  * Rotate
  * Alpha
* **Group**
  * Group different objects type
  * Scale
  * Rotate
  * Alpha
  * Move
  
## Examples

http://frankdenuijl.nl/space_invaders/

And a little example of an strategy game.

## How to use
``` js
var MyGame = _game(width, height, background_color, amount_layers)

MyGame._mouseMoveAction = function(e){
  //logic when mouse move
  
  //There is also:
  //_mouseDownAction
  //_mouseUpAction
  //_mouseRightAction
  //_keyboardUpAction
  //_keyboardDownAction
};

MyGame._isKeySelected("Enter") // return true or false

MyGame._setWidth(1000) //change size game
MyGame._setHeight(1000) //example if you want a fullscreen game

var onload = function(){
  var MySprite = new _sprite(MyImage)
  MySprite._x = 99 //position
  MySprite._angle = 99 //angle ect.
  MyGame._addToCanvas(MySprite, 0) //Add my sprite to the game on layer 1
  MyGame._draw(0) // draw the layer, yes you have to draw the layers
}

var MyImage = _addImage("images/game/army.png") //returns a image 
MyImage.onload = onload();
```

