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
	var width = 224*2
	var height = 256*2
	this.canvas = new _game(width, height, background, layers);
	this.globals();
	this.initIntro();
	this.ui();
}

main.prototype.globals = function(){
	this.alienTick = 2
	this.introTick = 25
	this.green = '#20ff20'
	this.red = '#f81818'
	this.font = 'Space Invaders'
}

main.prototype.initIntro = function(){
	this.intro = {}
	
	var playIntroString = "P L A Y"
	this.intro.playText = playIntroString.split("");

	var spaceinvadersIntroString = "S P A C E          I N V A D E R S"
	this.intro.spaceInvadersText = spaceinvadersIntroString.split("");
	
	var mysteryString = "=  ?    M Y S T E R Y"
	this.intro.mysteryText = mysteryString.split("");
	
	var p30String = "=  3 0    P O I N T S"
	this.intro.p30Text = p30String.split("");
	
	var p20String = "=  2 0    P O I N T S"
	this.intro.p20Text = p20String.split("");
	
	var p10String = "=  1  0    P O I N T S"
	this.intro.p10Text = p10String.split("");

	var name = new _text("* F r a n k   d e n   U i j l *")
	name._font = this.font
	name._weight = 'bold'
	name._color = this.green
	name._align = 'center'
	name._size = 12
	name._width = this.canvas._width
	name._x = this.canvas._width/2
	name._y = this.canvas._height-51
	this.canvas._addToCanvas(name, 0);
	this.intro.name = name;
	
	var play = new _text("")
	play._font = this.font
	play._color = '#ffffff'
	play._align = 'left'
	play._size = 12
	play._width = 64
	play._x = this.canvas._width/2 + 2
	play._y = this.canvas._height/2 - 121
	this.canvas._addToCanvas(play, 0);
	this.intro.play = play;
	
	var spaceInvaders = new _text("")
	spaceInvaders._font = this.font
	spaceInvaders._color = '#ffffff'
	spaceInvaders._align = 'left'
	spaceInvaders._size = 12
	spaceInvaders._width = 240
	spaceInvaders._x = this.canvas._width/2 + 8
	spaceInvaders._y = this.canvas._height/2 - 71
	this.canvas._addToCanvas(spaceInvaders, 0);
	this.intro.spaceInvaders = spaceInvaders;
	
	var score = new _text("* S C O R E    A D V A N C E    T A B L E *")
	score._font = this.font 
	score._color = '#ffffff'
	score._align = 'center'
	score._size = 12
	score._width = this.canvas._width
	score._height = 150
	score._x = this.canvas._width/2
	score._y = this.canvas._height/2 + 65
	this.intro.score = score;
	
	var mystery = new _text("")
	mystery._font = this.font
	mystery._color = '#ffffff'
	mystery._align = 'left'
	mystery._size = 12
	mystery._width = 158
	mystery._x = this.canvas._width/2 + 9
	mystery._y = this.canvas._height/2 + 39
	this.canvas._addToCanvas(mystery, 0);
	this.intro.mystery = mystery;
	
	var p30 = new _text("")
	p30._font = this.font
	p30._color = '#ffffff'
	p30._align = 'left'
	p30._size = 12
	p30._width = 158
	p30._x = this.canvas._width/2 + 9
	p30._y = this.canvas._height/2 + 69
	this.canvas._addToCanvas(p30, 0);
	this.intro.p30 = p30;
	
	var p20 = new _text("")
	p20._font = this.font
	p20._color = '#ffffff'
	p20._align = 'left'
	p20._size = 12
	p20._width = 158
	p20._x = this.canvas._width/2 + 9
	p20._y = this.canvas._height/2 + 99
	this.canvas._addToCanvas(p20, 0);
	this.intro.p20 = p20;
	
	var p10 = new _text("")
	p10._font = this.font
	p10._color = '#ffffff'
	p10._align = 'left'
	p10._size = 12
	p10._width = 158
	p10._x = this.canvas._width/2 + 9
	p10._y = this.canvas._height/2 + 129
	this.canvas._addToCanvas(p10, 0);
	this.intro.p10 = p10;
	
	var push = new _text("P U S H <br> <br> O N L Y    1 P L A Y E R    B U T T O N")
	push._font = this.font
	push._color = '#ffffff'
	push._align = 'center'
	push._size = 12
	push._width = this.canvas._width
	push._height = 150
	push._x = this.canvas._width/2
	push._y = this.canvas._height/2 + 1
	this.intro.push = push;
	
	var playPlayer = new _text("P L A Y    P L A Y E R <  1  >")
	playPlayer._font = this.font
	playPlayer._color = '#ffffff'
	playPlayer._align = 'center'
	playPlayer._size = 12
	playPlayer._width = this.canvas._width
	playPlayer._x = this.canvas._width/2 + 1
	playPlayer._y = this.canvas._height/2 + 1
	this.intro.playPlayer = playPlayer;
	
	this.step = 0
	this.animateIntro()
}

main.prototype.animateIntro = function(){
	lengthMystery = this.intro.playText.length + this.intro.spaceInvadersText.length
	lengthP30 = lengthMystery + this.intro.mysteryText.length
	lengthP20 = lengthP30 + this.intro.p30Text.length
	lengthP10 = lengthP20 + this.intro.p20Text.length
	
	if (this.step < this.intro.playText.length){
		this.intro.play._text = this.intro.play._text + this.intro.playText[this.step]
	} else if (this.step - this.intro.playText.length < this.intro.spaceInvadersText.length){
		this.intro.spaceInvaders._text = this.intro.spaceInvaders._text + this.intro.spaceInvadersText[this.step - this.intro.playText.length]
	} else if (this.step - this.intro.playText.length == this.intro.spaceInvadersText.length){
		this.canvas._addToCanvas(this.intro.score, 0);
		
		this.intro.mystery._text = this.intro.mysteryText[0]
	} else if (this.step - lengthMystery < this.intro.mysteryText.length){
		this.intro.mystery._text = this.intro.mystery._text + this.intro.mysteryText[this.step - lengthMystery]
	} else if (this.step - lengthP30 < this.intro.p30Text.length){
		this.intro.p30._text = this.intro.p30._text + this.intro.p30Text[this.step - lengthP30]
	} else if (this.step - lengthP20 < this.intro.p20Text.length){
		this.intro.p20._text = this.intro.p20._text + this.intro.p20Text[this.step - lengthP20]
	} else if (this.step - lengthP10 < this.intro.p10Text.length){
		this.intro.p10._text = this.intro.p10._text + this.intro.p10Text[this.step - lengthP10]
	} if (this.step == lengthP10 + 60) {
		this.canvas._removeFromCanvas(this.intro.play, 0);
		this.canvas._removeFromCanvas(this.intro.spaceInvaders, 0);
		this.canvas._removeFromCanvas(this.intro.score, 0);
		this.canvas._removeFromCanvas(this.intro.mystery, 0);
		this.canvas._removeFromCanvas(this.intro.p30, 0);
		this.canvas._removeFromCanvas(this.intro.p20, 0);
		this.canvas._removeFromCanvas(this.intro.p10, 0);
		this.canvas._removeFromCanvas(this.intro.name, 0);
		
		this.canvas._addToCanvas(this.intro.push, 0);
	} if (this.step == lengthP10 + 120) {
		this.canvas._removeFromCanvas(this.intro.push, 0);
		this.canvas._removeFromCanvas(this.ui.score2, 0);
		
		this.canvas._addToCanvas(this.intro.playPlayer, 0);
	}
	
	this.step++;
	
	this.canvas._draw(0);
	
	var that = this;
	setTimeout(function(){that.animateIntro()}, 1000 / that.introTick);
}

main.prototype.animateAlien = function(){
	
	setTimeout(function(){that.animateIntro()}, 1000 / that.alienTick);
}

main.prototype.ui = function(){
	//user interface
	this.ui = {}
	//global style
	this.ui.font = this.font
	this.ui.color = '#ffffff'
	this.ui.align = 'center'
	
	var misc = new _text('-')
	misc._font = this.ui.font
	misc._color = this.ui.color
	misc._align = this.ui.align
	misc._width = 5
	misc._x = this.canvas._width/2 - 31
	misc._y = -5
	this.canvas._addToCanvas(misc, 0);
	
	//top ui
	var top = new _text('S C O R E <  1  >     H I      S C O R E     S C O R E <  2  >')
	top._font = this.ui.font
	top._color = this.ui.color
	top._align = this.ui.align
	top._width = this.canvas._width
	top._x = this.canvas._width/2
	top._y = top._size + 1
	this.canvas._addToCanvas(top, 0);
	
	var scoreHeight = 45
	
	//score <1>
	var score1 = new _text('0 0 0 0')
	score1._font = this.ui.font
	score1._color = this.ui.color
	score1._align = this.ui.align
	score1._width = 120
	score1._x = 78
	score1._y = scoreHeight
	this.canvas._addToCanvas(score1, 0);
	this.ui.score1 = score1
	
	//hi-score
	var highScore = new _text('0 0 0 0')
	highScore._font = this.ui.font
	highScore._color = this.ui.color
	highScore._align = this.ui.align
	highScore._width = 120
	highScore._x = 206
	highScore._y = scoreHeight
	this.canvas._addToCanvas(highScore, 0);
	this.ui.highScore = highScore
	
	//score <2>
	var score2 = new _text('0 0 0 0')
	score2._font = this.ui.font
	score2._color = this.ui.color
	score2._align = this.ui.align
	score2._width = 120
	score2._x = 366
	score2._y = scoreHeight
	this.canvas._addToCanvas(score2, 0);
	this.ui.score2 = score2
	
	//score <2>
	var credit = new _text('C R E D I T    0 0')
	credit._font = this.ui.font
	credit._color = this.ui.color
	credit._align = this.ui.align
	credit._width = 140
	credit._x = 328
	credit._y = this.canvas._height-15
	this.canvas._addToCanvas(credit, 0);
	
	this.canvas._draw(0);
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