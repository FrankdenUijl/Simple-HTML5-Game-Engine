window.addEventListener ? window.addEventListener("load",init,false) : window.attachEvent && window.attachEvent("onload",init);

function init(){
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	if(is_chrome){
		main = new main();
	} 
}

function main(){
	var background = "#000000"
	var layers = 3
	var width = 217*2
	var height = 248*2
	this.canvas = new _game(width, height, background, layers);
	this.test();
}

main.prototype.test = function(){
	var top = new _text('S C O R E <  1  >    H I - S C O R E    S C O R E <  2  >')
	top._font = 'Space Invaders'
	top._color = '#ffffff'
	top._width = this.canvas._width
	top._align = 'center'
	top._x = this.canvas._width/2
	top._y = top._size + 2
	this.canvas._addToCanvas(top, 1);
	
	var score = new _text('0 0 0 0')
	score._font = 'Space Invaders'
	score._color = '#ffffff'
	score._width = 120
	score._align = 'center'
	score._x = 75
	score._y = 50
	this.canvas._addToCanvas(score, 1);
	
	var highScore = new _text('1 3 3 7')
	highScore._font = 'Space Invaders'
	highScore._color = '#ffffff'
	highScore._width = 120
	highScore._align = 'center'
	highScore._x = 200
	highScore._y = 50
	this.canvas._addToCanvas(highScore, 1);
	
	this.canvas._draw(1);
}


main.prototype.loadImages = function(){
	this.images = [];
	var images = 0;
	var that = this;
	var onload = function(){
		if(images == 0){
			that.setGlobals();
		} else {
			images--;
		}
	}
	images++;
	this.images.unit = _addImage("images/game/army.png");
	this.images.unit.onload = onload();
	images++;
	this.images.cornerSelect = _addImage("images/game/cornerSelect.png");
	this.images.cornerSelect.onload = onload();
	images++;
	this.images.health = _addImage("images/game/health_1.png");
	this.images.health.onload = onload();
	images++;
	this.images.point = _addImage("images/game/point.png");
	this.images.point.onload = onload();
	onload();
}