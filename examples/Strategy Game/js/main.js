window.addEventListener ? window.addEventListener("load",init,false) : window.attachEvent && window.attachEvent("onload",init);

function init(){
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	if(is_chrome){
		main = new main();
	} 
}

function main(){
	this.dimension = getWidthHeight();
	this.canvas = new _game(this.dimension[0], this.dimension[1], "#3b3b3b", 3);
	
	var readme = new _text("Use u and press somewhere on the screen to add units <br> Then drag your mouse to select units");
	
	readme._x = this.canvas._width/2;
	readme._y = this.canvas._height/2;
	readme._width = this.canvas._width;
	readme._height = 100;
	readme._color = "#FFFFFF";
	readme._align = "center";
	readme._alpha = 0.5;
	
	this.canvas._addToCanvas(readme, 0);
	this.canvas._draw(0);
	
	this.select = false;
	this.loadImages();
}

window.onresize = function(event) {
    main.dimension = getWidthHeight();
	main.canvas._setWidth(main.dimension[0]);
	main.canvas._setHeight(main.dimension[1]);
}

main.prototype.loadImages = function(){
	this.images = [];
	var images = 0;
	var that = this;
	var onload = function(){
		if(images == 0){
			that.setGlobals();
			that.setEvents();
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
	this.images.health = _addImage("images/game/health.png");
	this.images.health.onload = onload();
	images++;
	this.images.point = _addImage("images/game/point.png");
	this.images.point.onload = onload();
	onload();
}

main.prototype.setGlobals = function(){
	this.units = [];
	this.color = "#00e8ff";
	this.lastClickUnit = false;
	this.animationUnit();
}

main.prototype.setEvents = function(){
	var that = this;	
	this.key = [];
	this.canvas._mouseDownAction = function(e){that.mouseDown(e);};
	this.canvas._mouseMoveAction = function(e){that.mousePos(e); that.mouseMove(e);};
	this.canvas._mouseUpAction = function(e){that.mouseAction(e);};
	window.onkeydown = function(e){
		var keyCode = ('which' in e) ? e.which : e.keyCode;
		var index = that.key.indexOf(keyCode);
		if(index == -1){
			that.key.push(keyCode);
		}
		
	};
	
	window.onkeyup = function(e){
		var keyCode = ('which' in e) ? e.which : e.keyCode;
		var index = that.key.indexOf(keyCode);
		if(index != -1){
			that.key.splice(index, 1);
		}
	};
	
	window.onblur = function(){
		that.key = [];
		clearTimeout(that.selectTimer);
		that.select = false;
		that.selectBox = function(context){
		
		}
		that.canvas._addDrawOnCanvas(that.selectBox, 2);
		that.canvas._draw(2);
	}
	
	this.selectBox = function(context){
		
	}
	this.path = function(context){
		
	}
	this.canvas._addDrawOnCanvas(this.selectBox, 2);
	this.canvas._addDrawOnCanvas(this.path, 0);
}	

main.prototype.mousePos = function(e) {
	this.e = {};
	this.e.pageX = e.pageX;
	this.e.pageY = e.pageY;
	
}

main.prototype.mouseDown = function(e) {
	var that = this;
	this.downX = this.e.pageX; 
	this.downY = this.e.pageY;
	
	this.selectTimer = setTimeout(function(){that.select = true;}, 120);
	
}

main.prototype.mouseMove = function(e) {
	if(this.select){
		var that = this;
		this.selectBox = function(context){
			context.save(); 
			context.translate(that.downX, that.downY);
			context.beginPath();
			context.rect(0, 0, that.e.pageX-that.downX, that.e.pageY-that.downY);
			context.fillStyle = "rgba(255, 255, 255, 0.2)";
			context.fill();
			//context.lineWidth = 1;
			//context.strokeStyle = "#FFFFFF";
			//context.stroke();
			context.restore(); 
		}
		
		this.path = function(context){
			/* for(var i = 0; i < lines.length; i++){
				lines[i](context);
			} */
		}
		this.canvas._addDrawOnCanvas(this.path, 0);
		this.canvas._draw(0);
		
		this.canvas._addDrawOnCanvas(this.selectBox, 2);
		this.canvas._draw(2);
		this.checkIfSelect();
	} else {
		var line = false;
		var lines = [];
		for(var i = 0; i < this.units.length; i++){
			if(this.units[i].select){
				var dy = this.e.pageY-this.units[i].y; 
				var dx = this.e.pageX-this.units[i].x; 
				var radians = Math.atan2(dy, dx); 
				this.units[i].angle = (radians*180/Math.PI)+90;
				
				this.units[i].change();
				
			
				var that = this;
				line = true;				
				var f = linePath(this.units[i].x, this.units[i].y, this.e.pageX, this.e.pageY, i);
				lines.push(f);
			}
		}
		if(line){
			this.path = function(context){
				for(var i = 0; i < lines.length; i++){
					lines[i](context);
				}
			}
			this.canvas._addDrawOnCanvas(this.path, 0);
			this.canvas._draw(0);
		} else {
			this.path = function(context){
				/* for(var i = 0; i < lines.length; i++){
					lines[i](context);
				} */
			}
			this.canvas._addDrawOnCanvas(this.path, 0);
			this.canvas._draw(0);
		}
	}
}

function linePath(x, y, mouseX, mouseY, i){
	return function(context){
		context.save(); 
		context.translate(x, y);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(mouseX-x, mouseY-y);
		context.setLineDash([2,3]);
		context.lineWidth = 1;
		context.strokeStyle = "rgba(255, 255, 255, 0.2)";
		context.stroke();
		context.restore();
	}
}

main.prototype.checkIfSelect = function(){
	for(var i = 0; i < this.units.length; i++){
		
		var heighX = Math.max(this.downX, this.e.pageX);
		var lowX = Math.min(this.downX, this.e.pageX);
		var heighY = Math.max(this.downY, this.e.pageY);
		var lowY = Math.min(this.downY, this.e.pageY);
		
		if(this.units[i].x > lowX && this.units[i].x < heighX && this.units[i].y > lowY && this.units[i].y < heighY){
			if(this.key.indexOf(18) == -1){
				this.units[i].select = true;
			} else {
				this.units[i].select = false;
			}
			this.units[i].change();
			this.lastClickUnit = true;
		} else {
			if(this.key.indexOf(17) == -1 && this.key.indexOf(18) == -1){
				this.units[i].select = false;
				this.units[i].change();
			}
		}
	}
}

main.prototype.addUnit = function(x, y){
	var u = {};
	u.x = x;
	u.y = y;
	u.angle = 0;
	u.health = 32;
	u.color = this.color;
	u.select = false;
	u.move = false;
	var m = {};
	m.x = 0;
	m.y = 0;
	u.step = 0;
	
	var c = {};
	c.x = x;
	c.y = y;
	
	u.moveTo = m;
	u.currentPoint = c;
	
	u.img = []
	var name = ["cornerSelect", "health"];
	for(var i = 0; i < 1; i++){
		for(var r = 0; r < 4; r++){
			u.img[name[i]+r] = new _sprite(this.images[name[i]]);
			u.img[name[i]+r]._angle = r*90;
			if(i == 0){
				u.img[name[i]+r]._changeColor("#000000");
			}
			if(r < 2){
				u.img[name[i]+r]._x = x+(12*r)-6;
			 	u.img[name[i]+r]._y = y-5;
			} else {
				u.img[name[i]+r]._x = x+(-12*(r-3))-6;
				u.img[name[i]+r]._y = y+6;
			}
		}
	}
	
	var iu = new _sprite(this.images.unit);
	iu._changeColor(u.color);
	
	u.button = new _button([iu, iu, iu]);
	u._hitAlpha = true;
	u.button._x = x;
	u.button._y = y;
	u.button._angle = u.angle;	
	
	var that = this;
	
	u.button._out = function() {
		if(u.select){
			for(var r = 0; r < 4; r++){
				u.img["cornerSelect"+r]._changeColor("#000000");
			}
			that.canvas._draw(1);
		} else {
			for(var r = 0; r < 4; r++){
				u.img["cornerSelect"+r]._changeColor("#000000");
				that.canvas._removeFromCanvas(u.img["cornerSelect"+r], 1);
			}
			that.canvas._draw(1);
		}
	}
	
	u.button._move = function(){
		if(u.select){
			for(var r = 0; r < 4; r++){
				u.img["cornerSelect"+r]._changeColor("#C0C0C0");
			}
			that.canvas._draw(1);
		} else {
			for(var r = 0; r < 4; r++){
				u.img["cornerSelect"+r]._changeColor("#FFFFFF");
				that.canvas._addToCanvas(u.img["cornerSelect"+r], 1);
			}
			that.canvas._draw(1);
		}
	}
	
	u.button._action = function(){
		that.lastClickUnit = true;
		if(u.select){
			if(that.key.indexOf(18) != -1){
				u.select = false;
				for(var r = 0; r < 4; r++){
					that.canvas._removeFromCanvas(u.img["cornerSelect"+r], 1);
				}
				that.canvas._draw(1);
			} else if(that.key.indexOf(17) == -1){
				for(var i = 0; i < that.units.length; i++){
					if(that.units[i].select && that.units[i] !== u){
						that.units[i].select = false;
						that.units[i].change();
					}
				}
			}
		} else {
			u.select = true;
			for(var r = 0; r < 4; r++){
				that.canvas._addToCanvas(u.img["cornerSelect"+r], 1);
			}
			that.canvas._draw(1);
			if(that.key.indexOf(17) == -1){
				for(var i = 0; i < that.units.length; i++){
					if(that.units[i].select && that.units[i] !== u){
						that.units[i].select = false;
						that.units[i].change();
					}
				}
			} 
		}
	}
	
	u.change = function(){
		this.button._x = this.x;
		this.button._y = this.y;
		this.button._angle = this.angle;
		
		var name = ["cornerSelect", "health"];
		for(var i = 0; i < 1; i++){
			for(var r = 0; r < 4; r++){
				if(r < 2){
					u.img[name[i]+r]._x = this.x+(12*r)-6;
					u.img[name[i]+r]._y = this.y-5;
				} else {
					u.img[name[i]+r]._x = this.x+(-12*(r-3))-6;
					u.img[name[i]+r]._y = this.y+6;
				}
			}
		}
		
		if(this.select){
			for(var r = 0; r < 4; r++){
				that.canvas._addToCanvas(this.img["cornerSelect"+r], 1);
			}
			that.canvas._draw(1);
		} else {
			for(var r = 0; r < 4; r++){
				that.canvas._removeFromCanvas(this.img["cornerSelect"+r], 1);
			}
			that.canvas._draw(1);
		}
		that.canvas._draw(2);
	}
	
	this.canvas._addToCanvas(u.button, 1);
	
	this.units.push(u);
	this.canvas._draw(1);
}

main.prototype.mouseAction = function(e) {
	clearTimeout(this.selectTimer);
	if(this.select){
		this.select = false;
		this.selectBox = function(context){
		
		}
		this.canvas._addDrawOnCanvas(this.selectBox, 2);
		this.canvas._draw(2);
	} else {
		var index = this.key.indexOf(85);
		if(index != -1){
			this.addUnit(this.e.pageX, this.e.pageY);
		}
	}
	if(!this.lastClickUnit){
		for(var i = 0; i < this.units.length; i++){
			if(this.units[i].select){
				this.units[i].select = false;
				
				this.units[i].move = true;
				
				var m = {};
				m.x = this.e.pageX;
				m.y = this.e.pageY;
				
				var c = {}
				c.x = this.units[i].x;
				c.y = this.units[i].y;
				
				this.units[i].moveTo = m;
				this.units[i].currentPoint = c;
				this.units[i].step = 0;
				this.units[i].change();
			}
		}
	}
	this.lastClickUnit = false;
}

main.prototype.animationUnit = function(){
	var draw = false;
	var line = false;
	var lines = [];
	for(var i = 0; i < this.units.length; i++){
		if(this.units[i].move){
			draw = true;
			var distance = DistanceTwoPoints(this.units[i].currentPoint.x, this.units[i].moveTo.x, this.units[i].currentPoint.y, this.units[i].moveTo.y);
			//console.log(distance+"-"+this.units[i].moveTo.x+"-"+this.units[i].moveTo.y+"-"+this.units[i].currentPoint.x+"-"+this.units[i].currentPoint.y);
			this.units[i].x += (this.units[i].moveTo.x - this.units[i].currentPoint.x) / distance;
			this.units[i].y += (this.units[i].moveTo.y - this.units[i].currentPoint.y) / distance;
			this.units[i].change();
			this.units[i].step++;
			if(this.units[i].step > distance){
				this.units[i].move = false;
				this.units[i].x = this.units[i].moveTo.x;
				this.units[i].y = this.units[i].moveTo.y;
				this.units[i].change();
				this.units[i].step = 0;
			}
			if(this.units[i].select){
				var dy = this.e.pageY-this.units[i].y; 
				var dx = this.e.pageX-this.units[i].x; 
				var radians = Math.atan2(dy, dx); 
				this.units[i].angle = (radians*180/Math.PI)+90;
				
				this.units[i].change();
				
			
				var that = this;
				line = true;				
				var f = linePath(this.units[i].x, this.units[i].y, this.e.pageX, this.e.pageY, i);
				lines.push(f);
			}
		}
	}
	if(line){
		this.path = function(context){
			for(var i = 0; i < lines.length; i++){
				lines[i](context);
			}
		}
		this.canvas._addDrawOnCanvas(this.path, 0);
	} else {
		this.path = function(context){
			
		}
		this.canvas._addDrawOnCanvas(this.path, 0);
	}
	if(draw){
		this.canvas._draw(2);
		this.canvas._draw(0);
	}
	var that = this;
	requestAnimFrame(function(){that.animationUnit();});
}