function _canvasContext(){
	this._canvasList = [];
	this._drawFunctions = [];
}

_canvasContext.prototype._draw = function(_layerIndex){
	var _currentCanvas = document.getElementById('layer'+_layerIndex);
	var _currentContext = _currentCanvas.getContext("2d");
	
	_currentContext.clearRect(0, 0, _currentCanvas.width, _currentCanvas.height);
		
	this._drawFunctions[_layerIndex](_currentContext);

	_currentContext.save(); 
	_currentContext.globalAlpha = this._canvasList[_layerIndex]._alpha;
	_currentContext.translate(this._canvasList[_layerIndex]._xPos, this._canvasList[_layerIndex]._yPos);
	_currentContext.scale(this._canvasList[_layerIndex]._scale,this._canvasList[_layerIndex]._scale);
	_currentContext.rotate((this._canvasList[_layerIndex]._rotate));

	for (var _i = 0; _i < this._canvasList[_layerIndex]._list.length; _i++)
		currentContext = this._canvasList[_layerIndex]._list[_i]._draw(_currentContext);
		
	_currentContext.restore(); 
}

function _globalDisplayAttributes(){
	this._alpha = 1;
	this._scale = 1;
	this._rotate = 0;
	this._xPos = 0;
	this._yPos = 0;
	this._list = [];
}

function _game(_width, _height, _background, _cIndexLayers){
	this._canvasContext = new _canvasContext();
	this._background = _background;
	this._width = _width;
	this._height = _height;
	this._canvasAmount = 0;
	this._mouseMoveAction = function(e){};
	this._mouseDownAction = function(e){};
	this._mouseUpAction = function(e){};
	this._mouseRightAction = function(e){};
	for (var _i = 0; _i < _cIndexLayers; _i++){
		this._addCanvas();
		if(_i != _cIndexLayers-1){
			document.getElementById('layer'+(_i)).style.pointerEvents = "none";
		}
	}
	
	var that = this;
	
	document.getElementById('layer'+(this._canvasAmount-1)).onmousedown = function(){that._mouseDown.apply(that, arguments); delete that};
	document.getElementById('layer'+(this._canvasAmount-1)).onmousemove = function(){that._mouseMove.apply(that, arguments); delete that};
	document.getElementById('layer'+(this._canvasAmount-1)).onmouseup = function(){that._mouseUp.apply(that, arguments); delete that};
	document.getElementById('layer'+(this._canvasAmount-1)).oncontextmenu = function(){that._mouseRight.apply(that, arguments); delete that};
	document.getElementById('layer'+(this._canvasAmount-1)).onselectstart = function(){ return false; };
	document.getElementById('layer'+(this._canvasAmount-1)).onmouseout  = function(){that._mouseOut.apply(that, arguments); delete that};
}

_game.prototype._mouseRight = function(e){
	this._mouseRightAction(e);
}

_game.prototype._mouseDown = function(e){
	var draw = -1;
	click:
	for(var _layerIndex = this._canvasAmount-1; _layerIndex > -1; _layerIndex--){
		for (var _i = this._canvasContext._canvasList[_layerIndex]._list.length-1; _i > -1; _i--){
			if(this._canvasContext._canvasList[_layerIndex]._list[_i]._type == "button" && this._canvasContext._canvasList[_layerIndex]._list[_i]._active){
				if(this._canvasContext._canvasList[_layerIndex]._list[_i]._mouse(this._canvasContext._canvasList[_layerIndex]._scale, e.pageX - this._canvasContext._canvasList[_layerIndex]._xPos, e.pageY - this._canvasContext._canvasList[_layerIndex]._yPos) && this._canvasContext._canvasList[_layerIndex]._list[_i]._state != 2){
					this._canvasContext._canvasList[_layerIndex]._list[_i]._state = 2;
					this._canvasContext._draw(_layerIndex);
					draw = _layerIndex;
					this._canvasContext._canvasList[_layerIndex]._list[_i]._down();
					break click;
				}
			} else if(this._canvasContext._canvasList[_layerIndex]._list[_i]._maskButton){
				if(this._canvasContext._canvasList[_layerIndex]._list[_i]._mouse(this._canvasContext._canvasList[_layerIndex]._scale, e.pageX - this._canvasContext._canvasList[_layerIndex]._xPos, e.pageY - this._canvasContext._canvasList[_layerIndex]._yPos)){
					break click;
				}
			}
		}
	}
	if(draw != -1){
		this._canvasContext._draw(draw);
	}
	this._mouseDownAction();
}

_game.prototype._mouseMove = function(e){
	var drawOut = -1;
	var drawOver = -1;
	var pointer = false;
	
	var over = false;
	var out = false;
	
	click:
	for(var _layerIndex = this._canvasAmount-1; _layerIndex > -1; _layerIndex--){
		for (var _i = this._canvasContext._canvasList[_layerIndex]._list.length-1; _i > -1; _i--){
			if(this._canvasContext._canvasList[_layerIndex]._list[_i]._type == "button"){
				if(!over && this._canvasContext._canvasList[_layerIndex]._list[_i]._mouse(this._canvasContext._canvasList[_layerIndex]._scale, e.pageX - this._canvasContext._canvasList[_layerIndex]._xPos, e.pageY - this._canvasContext._canvasList[_layerIndex]._yPos)){
					over = true;
					pointer = this._canvasContext._canvasList[_layerIndex]._list[_i]._pointer;
					
					this._canvasContext._canvasList[_layerIndex]._list[_i]._activeMove(e)
					
					if(this._canvasContext._canvasList[_layerIndex]._list[_i]._state == 0){
						this._canvasContext._canvasList[_layerIndex]._list[_i]._state = 1;
						this._canvasContext._canvasList[_layerIndex]._list[_i]._move(e)
						drawOver = _layerIndex;
						document.getElementById('layer'+(this._canvasAmount-1)).setAttribute('title', this._canvasContext._canvasList[_layerIndex]._list[_i]._label);
					}
				} else if(!out){
					if(this._canvasContext._canvasList[_layerIndex]._list[_i]._state == 1){
						out = true;
						this._canvasContext._canvasList[_layerIndex]._list[_i]._state = 0;
						this._canvasContext._canvasList[_layerIndex]._list[_i]._out(e);
						document.getElementById('layer'+(this._canvasAmount-1)).setAttribute('title', '');
						drawOut = _layerIndex;
					}
				}
			} else if(this._canvasContext._canvasList[_layerIndex]._list[_i]._maskButton){
				if(!over && this._canvasContext._canvasList[_layerIndex]._list[_i]._mouse(this._canvasContext._canvasList[_layerIndex]._scale, e.pageX - this._canvasContext._canvasList[_layerIndex]._xPos, e.pageY - this._canvasContext._canvasList[_layerIndex]._yPos)){
					over = true;
				}
			}
			if(over && out)
				break click;
		}
	}
	
	if(drawOut != -1)
		this._canvasContext._draw(drawOut);
	if(drawOver != -1)
		this._canvasContext._draw(drawOver);
		
	document.getElementById('layer'+(this._canvasAmount-1)).style.cursor = (pointer) ? "pointer" : "default";
	
	this._mouseMoveAction(e);
}

_game.prototype._mouseUp = function(e){
	var draw = -1;
	click:
	for(var _layerIndex = this._canvasAmount-1; _layerIndex > -1; _layerIndex--){
		for (var _i = this._canvasContext._canvasList[_layerIndex]._list.length-1; _i > -1; _i--){
			if(this._canvasContext._canvasList[_layerIndex]._list[_i]._type == "button" && this._canvasContext._canvasList[_layerIndex]._list[_i]._active){
				if(this._canvasContext._canvasList[_layerIndex]._list[_i]._state == 2 && this._canvasContext._canvasList[_layerIndex]._list[_i]._tab == false){
					this._canvasContext._canvasList[_layerIndex]._list[_i]._state = 0;
					draw = _layerIndex;
				}
				if(this._canvasContext._canvasList[_layerIndex]._list[_i]._mouse(this._canvasContext._canvasList[_layerIndex]._scale, e.pageX - this._canvasContext._canvasList[_layerIndex]._xPos, e.pageY - this._canvasContext._canvasList[_layerIndex]._yPos)){
					this._canvasContext._canvasList[_layerIndex]._list[_i]._action();
					break click;
				}
			} else if(this._canvasContext._canvasList[_layerIndex]._list[_i]._maskButton){
				if(this._canvasContext._canvasList[_layerIndex]._list[_i]._mouse(this._canvasContext._canvasList[_layerIndex]._scale, e.pageX - this._canvasContext._canvasList[_layerIndex]._xPos, e.pageY - this._canvasContext._canvasList[_layerIndex]._yPos)){
					break click;
				}
			}
		}
	}
	if(draw != -1){
		this._canvasContext._draw(draw);
	}
	document.getElementById('layer'+(this._canvasAmount-1)).style.cursor = "default";
	
	this._mouseUpAction(e);
}

_game.prototype._mouseOut = function(e){
	
}

_game.prototype._changeLayerAlpha = function(_layerIndex, _alpha){
	this._canvasContext._canvasList[_layerIndex]._alpha = _alpha;
}
_game.prototype._changeLayerRotate = function(_layerIndex, _rotate){
	this._canvasContext._canvasList[_layerIndex]._rotate = _rotate;	
}
_game.prototype._changeLayerXPos = function(_layerIndex, _xPos){
	this._canvasContext._canvasList[_layerIndex]._xPos = _xPos;
}
_game.prototype._changeLayerYPos = function(_layerIndex, _yPos){
	this._canvasContext._canvasList[_layerIndex]._yPos = _yPos;
}

_game.prototype._changeScale = function(_layerIndex, _scale){
	this._canvasContext._canvasList[_layerIndex]._scale = _scale;
}

_game.prototype._getLayerXPos = function(_layerIndex){
	return this._canvasContext._canvasList[_layerIndex]._xPos;
}
_game.prototype._getLayerYPos = function(_layerIndex){
	return this._canvasContext._canvasList[_layerIndex]._yPos;
}

_game.prototype._getScale = function(_layerIndex){
	return this._canvasContext._canvasList[_layerIndex]._scale;
}

_game.prototype._layerAlpha = function(_layerIndex){
	return this._canvasContext._canvasList[_layerIndex]._alpha;
}
_game.prototype._changeLayerRotate = function(_layerIndex){
	return this._canvasContext._canvasList[_layerIndex]._rotate;	
}

_game.prototype._draw = function(_layerIndex){
	this._canvasContext._draw(_layerIndex);
}

_game.prototype._returnCanvas = function(){
	return document.getElementById('layer'+(this._canvasAmount-1));
}


_game.prototype._addCanvas = function(){
	var _newCanvas = document.createElement('canvas'); 
	_newCanvas.setAttribute('id', 'layer'+this._canvasAmount);
	_newCanvas.style.position = 'absolute';
	_newCanvas.style.zIndex = this._canvasAmount;
	if(this._canvasAmount == 0){
		_newCanvas.innerHTML = 'You are using an outdated browser.';
		_newCanvas.style.background = this._background;
	} 
	document.body.appendChild(_newCanvas);	
	document.getElementById('layer'+this._canvasAmount).width = this._width;
	document.getElementById('layer'+this._canvasAmount).height = this._height;
	this._canvasContext._canvasList[this._canvasAmount] = new _globalDisplayAttributes();
	this._canvasContext._drawFunctions[this._canvasAmount] = function(){};
	this._canvasAmount++;
}

_game.prototype._setWidth = function(_newWidth){
	for (var _i = 0; _i < this._canvasAmount; _i++) {
		var _canvas = document.getElementById('layer'+_i);
		_canvas.width = _newWidth;
		this._canvasContext._draw(_i);
	}
}

_game.prototype._setHeight = function(_newHeight){
	for (var _i = 0; _i < this._canvasAmount; _i++) {
		var _canvas = document.getElementById('layer'+_i);
		_canvas.height = _newHeight;
		this._canvasContext._draw(_i);
	}
}

_game.prototype._addToCanvas = function(_obj, _canvasIndex){
	var _thisIndex = this._canvasContext._canvasList[_canvasIndex]._list.indexOf(_obj);
	if(_thisIndex == -1)
		this._canvasContext._canvasList[_canvasIndex]._list.push(_obj);
}

_game.prototype._existOnCanvas = function(_obj, _canvasIndex){
	var _thisIndex = this._canvasContext._canvasList[_canvasIndex]._list.indexOf(_obj);
	if(_thisIndex != -1)
		return true;
	return false;
}

_game.prototype._removeFromCanvas = function(_obj, _canvasIndex){
	var _thisIndex = this._canvasContext._canvasList[_canvasIndex]._list.indexOf(_obj);
	if(_thisIndex != -1)
		this._canvasContext._canvasList[_canvasIndex]._list.splice(_thisIndex, 1);
}

_game.prototype._emptyCanvas = function(_canvasIndex){
	this._canvasContext._canvasList[_canvasIndex]._list = [];
}

_game.prototype._sendToTop = function(_obj, _canvasIndex){
	var _thisIndex = this._canvasContext._canvasList[_canvasIndex]._list.indexOf(_obj);
	if(_thisIndex != -1)
		this._canvasContext._canvasList[_canvasIndex]._list.splice(_thisIndex, 1);
	this._canvasContext._canvasList[_canvasIndex]._list.push(_obj);
}

_game.prototype._switchDepth = function(_obj1, _obj2, _canvasIndex){
	var _thisIndex1 = this._canvasContext._canvasList[_canvasIndex]._list.indexOf(_obj1);
	var _thisIndex2 = this._canvasContext._canvasList[_canvasIndex]._list.indexOf(_obj2);
	this._canvasContext._canvasList[_canvasIndex]._list[_thisIndex2] = _obj1;
	this._canvasContext._canvasList[_canvasIndex]._list[_thisIndex1] = _obj2;
}

_game.prototype._addDrawOnCanvas = function(_function, _layerIndex){
	this._canvasContext._drawFunctions[_layerIndex] = _function;
}
/*
_game.prototype._drawAsSprite = function(_function, _width, _height){
	var _newCanvas = document.createElement('canvas');
	_newCanvas.width = _width;
	_newCanvas.height = _height;
	_newCanvas.getContext('2d').drawImage(this._img, 0, 0, this._img.width, this._img.height);
	
	var _imageData = _newCanvas.getContext('2d').getImageData(0, 0, _newCanvas.width, _newCanvas.height);
	_newCanvas.getContext('2d').putImageData(_imageData, 0, 0);
}
*/

function _addImage(_src){
	var _img = new Image();
	//_img.crossOrigin = '';
	//_img.crossOrigin='anonymous'
	_img.src = _src;
	return _img;
}

function _addImages(_srcArray){
	var _imgArray = [];
	
	for(var _i = 0; _i < _srcArray.length; _i++){
		var _img = new Image();
		_img.src = _srcArray[_i];
		
		_imgArray[_i] = _img;
	}
	
	return _imgArray;
}

function _text(_txt){
	this._text = _txt;
	var _currentText;
	this._size = 12;
	var _currentSize;
	this._weight = "";
	var _currentWeight
	this._font = "arial";
	var _currentFont;
	this._color = "#000000";
	var _currentColor;
	this._align = "left";
	var _currentAlign;
	
	this._width = 120;
	var _currentWidth;
	this._height = 30;
	var _currentHeight;
	
	this._x = 0;
	this._y = 0;
	this._angle = 0;
	this._alpha = 1;
	
	this._returnOldVar = function(){
		return [_currentText, _currentSize, _currentWeight, _currentFont, _currentColor, _currentWidth, _currentHeight, _currentAlign];
	}
	
	this._getNewVar = function(){
		_currentText = this._text;
		_currentSize = this._size;
		_currentWeight = this._weight;
		_currentFont = this._font;
		_currentColor = this._color;
		_currentWidth = this._width;
		_currentHeight = this._height;
		_currentAlign = this._align;
	}
}

_text.prototype._buffer = function(){
	this._text = ""+this._text;
	var _words = this._text.split(" ");
	var _wordsLength = _words.length;
	var _line = "";
	var _y = 1.5*this._size;
	var _x = (this._align == "center") ? this._width/2 : ((this._align == "right") ? this._width : 0);
	
	var _tempCanvas = document.createElement('canvas');
	_tempCanvas.width = this._width;
	_tempCanvas.height = this._height;
	_tempCanvas2D = _tempCanvas.getContext('2d');
	
	_tempCanvas2D.font = this._weight+" "+this._size+"pt "+this._font;
	_tempCanvas2D.textAlign = this._align;
	_tempCanvas2D.fillStyle = this._color;
	
	for(var _i = 0; _i < _wordsLength; _i++){
		if(_words[_i] == "<br>"){
			_tempCanvas2D.fillText(_line, _x, _y);
			_line = "";
			_y += 1.5*this._size;
		} else {
			var _testLine = _line + _words[_i] + " ";
			var _metrics = _tempCanvas2D.measureText(_testLine);
			var _testWidth = _metrics.width;
			if (_testWidth > this._width) {
				_tempCanvas2D.fillText(_line, _x, _y);
				_line = _words[_i] + " ";
				_y += 1.5*this._size;
			}
			else {
				_line = _testLine;
			}
		}
	}
	_tempCanvas2D.fillText(_line, _x, _y);
	return _tempCanvas;
}

_text.prototype._draw = function(_context){
	var _oldVarArray = this._returnOldVar();
	if(_oldVarArray[0] != this._text || this._size != _oldVarArray[1] || this._weight != _oldVarArray[2] || this._font != _oldVarArray[3] || this._color != _oldVarArray[4] || this._width != _oldVarArray[5] || this._height != _oldVarArray[6] || _oldVarArray[7] != this._align){
		this._tempCanvas = this._buffer();
		this._getNewVar();
	}
	
	_context.save();
	_context.rotate((Math.PI/180 * this._angle));
	_context.globalAlpha = this._alpha;
	_context.drawImage(this._tempCanvas, this._x - (this._width/2), this._y - (this._height/2))
	_context.restore();

	return _context;
}

function _button(_stateArray){
	this._type = "button";
	this._stateArray = _stateArray;
	this._state = 0;
	this._x = 0;
	this._y = 0;
	this._angle = 0;
	this._scale = 1;
	this._alpha = 1;
	this._hit = [];
	this._hitWidth = 0;
	this._action = function(){alert("Oeps, this button is broken")};
	this._move = function(){return false;}
	this._down = function(){return false;}
	this._out = function(){return false;}
	this._activeMove = function(){return false;}
	this._pointer = true;
	this._hitAlpha = false;
	this._active = true;
	this._tab = false;
	this._label = "";
	
	this._width = false;
	this._height = false;
}

_button.prototype._tabOff = function(){
	this._tab = false;
	this._state = 0;
}	

_button.prototype._tabOn = function(){
	this._tab = true;
	this._state = 2;
}

_button.prototype._draw = function(_context){
	this._stateArray[this._state]._x = this._x;
	this._stateArray[this._state]._y = this._y;
	this._stateArray[this._state]._angle = this._angle;
	this._stateArray[this._state]._scale = this._scale;
	this._stateArray[this._state]._alpha = this._alpha;
	this._stateArray[this._state]._width = this._width;
	this._stateArray[this._state]._height = this._height;

	var _newContext = this._stateArray[this._state]._draw(_context);

	return _newContext;
}	

_button.prototype._addToCanvas = function(_game, _canvas){
	_game._canvasContext._list[_canvas].push(this);
}

_button.prototype._hitTest = function(_obj){
	var _bool = false;

	var _sx = this._stateArray[this._state]._leftSide + this._x;
	var _bx = (this._stateArray[this._state]._rightSide/2) + this._x;
	var _sy = this._stateArray[this._state]._topSide + this._y;
	var _by = (this._stateArray[this._state]._bottomSide/2) + this._y;

	var _sxObj = _obj._stateArray[_obj._state]._leftSide + _obj._x;
	var _bxObj = (_obj._stateArray[_obj._state]._rightSide/2) + _obj._x;
	var _syObj = _obj._stateArray[_obj._state]._topSide + _obj._y;
	var _byObj = (_obj._stateArray[_obj._state]._bottomSide/2) + _obj._y;

	if((_sy > _syObj && _sy < _byObj) || (_by > _syObj && _by < _byObj)){
		if((_sx > _sxObj && _sx < _bxObj) || (_bx > _sxObj && _bx < _bxObj)){
			_bool = true;
		}
	}
	
	return _bool;
}

_button.prototype._setHit = function(_spr){
	var _newCanvas = document.createElement('canvas');
	_newCanvas.width = _spr._img.width;
	_newCanvas.height = _spr._img.height;
	
	var _newContext = _newCanvas.getContext('2d');
	
	_newContext = _spr._draw(_newContext);
	
	var _imageData = _newContext.getImageData(0, 0, _newCanvas.width, _newCanvas.height);
	this._hit = _imageData.data;
	this._hitWidth = _newCanvas.width;
	
	delete _newContext, _newCanvas, _imageData;
}	

_button.prototype._mouse = function(_scale, _xMouse, _yMouse){
	var _bool = false;
	if(this._active){
		this._stateArray[this._state]._x = this._x;
		this._stateArray[this._state]._y = this._y;
		this._stateArray[this._state]._angle = this._angle;
		this._stateArray[this._state]._scale = this._scale;
		this._stateArray[this._state]._alpha = 1;
		this._stateArray[this._state]._set();
		
		var _sx = (this._stateArray[this._state]._leftSide + this._x)*_scale;
		var _bx = ((this._stateArray[this._state]._rightSide/2) + this._x)*_scale;
		var _sy = (this._stateArray[this._state]._topSide + this._y)*_scale;
		var _by = ((this._stateArray[this._state]._bottomSide/2) + this._y)*_scale;
		
		if(_xMouse > _sx && _xMouse < _bx && _yMouse > _sy && _yMouse < _by){
			if(this._hitAlpha == false){
				if(this._hit.length == 0){
					this._stateArray[this._state]._scale = _scale;
					var _newCanvas = document.createElement('canvas');
					_newCanvas.width = this._stateArray[this._state]._rightSide;
					_newCanvas.height = this._stateArray[this._state]._bottomSide;
					
					var _newContext = _newCanvas.getContext('2d');
					//_newContext.scale(_scale, _scale);
					
					this._stateArray[this._state]._x = this._stateArray[this._state]._rightSide/2;
					this._stateArray[this._state]._y = this._stateArray[this._state]._bottomSide/2;
					
					var _newContext = this._stateArray[this._state]._draw(_newContext);
					
					var _imageData = _newContext.getImageData(0, 0, _newCanvas.width, _newCanvas.height);
					this._hit = _imageData.data;
					this._hitWidth = _newCanvas.width;
					
					delete _newContext, _newCanvas, _imageData;
				}
				var _mouseX = _xMouse - _sx;
				var _mouseY = _yMouse - _sy;
				
				if(this._hit[((this._hitWidth * _mouseY) + _mouseX) * 4 + 3] != 0){
					_bool = true;
				}
			} else {
				_bool = true;
			}
		}
	}
	return _bool;
}

function _group(){
	this._x = 0;
	this._y = 0;
	this._angle = 0;
	this._scale = 1;
	this._alpha = 1;
	
	this._childeren = [];
}

_group.prototype._addToGroup = function(_obj){
	var _thisIndex = this._childeren.indexOf(_obj);
	if(_thisIndex == -1)
		this._childeren.push(_obj);
}

_group.prototype._existInGroup = function(_obj){
	var _thisIndex = this._childeren.indexOf(_obj);
	if(_thisIndex != -1)
		return true;
	return false;
}

_group.prototype._removeFromGroup = function(_obj){
	var _thisIndex = this._childeren.indexOf(_obj);
	if(_thisIndex != -1)
		this._childeren.splice(_thisIndex, 1);
}

_group.prototype._emptyGroup = function(){
	this._childeren = [];
}

_group.prototype._sendToTop = function(_obj){
	var _thisIndex = this._childeren.indexOf(_obj);
	if(_thisIndex != -1)
		this._childeren.splice(_thisIndex, 1);
	this._childeren.push(_obj);
}

_group.prototype._switchDepth = function(_obj1, _obj2){
	var _thisIndex1 = this._childeren.indexOf(_obj1);
	var _thisIndex2 = this._childeren.indexOf(_obj2);
	this._childeren[_thisIndex2] = _obj1;
	this._childeren[_thisIndex1] = _obj2;
}

_group.prototype._draw = function(_context){
	_context.save(); 
	_context.translate(this._x ,this._y);
	_context.rotate((Math.PI/180 * this._angle));
	_context.scale(this._scale,this._scale);
	_context.globalAlpha = this._alpha;
	
	for (var _i = 0; _i < this._childeren.length; _i++)
		_context = this._childeren[_i]._draw(_context);
	
	_context.restore();
	
	return _context;
}

function _sprite(_img){
	this._img = _img;
	this._tempImg = _img;
	this._x = 0;
	this._y = 0;
	this._angle = 0;
	this._scale = 1;
	this._alpha = 1;
	this._width = false;
	this._height = false;
	
	//to mask out buttons
	this._maskButton = false;
	this._hit = [];
	this._hitWidth = 0;
	this._hitAlpha = false;
}

_sprite.prototype._mask = function(_mask){
	this._set();
	var _newCanvas = document.createElement('canvas');
	_newCanvas.width = this._img.width;
	_newCanvas.height = this._img.height;
	_newCanvas.getContext('2d').drawImage(this._img, 0, 0, this._img.width, this._img.height);
	
	var _imageData = _newCanvas.getContext('2d').getImageData(0, 0, _newCanvas.width, _newCanvas.height);
	var _data = _imageData.data;
	
	var _imageDataMask = _mask.getImageData(0, 0, _newCanvas.width, _newCanvas.height);
	var _dataMask = _imageDataMask.data;
 
	for (var _c = 3; _c < _data.length; _c += 4) {
		if(_data[_c] != 0)
			_data[_c] = _dataMask[_c] ? _dataMask[_c] : 0;
	}
	_newCanvas.getContext('2d').putImageData(_imageData, 0, 0);
	this._img = _newCanvas;
}

_sprite.prototype._reset = function(){
	this._img = this._tempImg;
	this._set();
}

_sprite.prototype._changeColor = function(_color){
	var _newCanvas = document.createElement('canvas');
	_newCanvas.width = this._img.width;
	_newCanvas.height = this._img.height;
	
	_newCanvas.getContext('2d').drawImage(this._img, 0, 0);
	
	var _imageData = _newCanvas.getContext('2d').getImageData(0, 0, _newCanvas.width, _newCanvas.height);
	var _data = _imageData.data;
	
	var _R = hexToR(_color);
	var _G = hexToG(_color);
	var _B = hexToB(_color);
 
	for (var _c = 0; _c < _data.length; _c += 4) {
		_data[_c] = _R;
		_data[_c + 1] = _G;
		_data[_c + 2] = _B;
	}
	_newCanvas.getContext('2d').putImageData(_imageData, 0, 0);
	this._img = _newCanvas;
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

_sprite.prototype._draw = function(_context){
	this._set();
	_context.save(); 
	_context.translate(this._x ,this._y);
	_context.rotate((Math.PI/180 * this._angle));
	_context.globalAlpha = this._alpha;
	_context.drawImage(this._img,  Math.round(this._leftSide),  Math.round(this._topSide), this._rightSide, this._bottomSide);
	
	_context.restore();
	
	return _context;
}

_sprite.prototype._set = function(){
	if(this._width)
		this._img.width = this._width;
		
	if(this._height)
		this._img.height = this._height;
	
	this._leftSide = Math.round(((this._img.width*this._scale)/2)*-1);
	this._topSide = Math.round(((this._img.height*this._scale)/2)*-1);
	
	this._rightSide =  Math.round(this._img.width*this._scale);
	this._bottomSide =  Math.round(this._img.height*this._scale);
}

_sprite.prototype._clip = function(){
	this._clipBool = true
}

_sprite.prototype._mouse = function(_scale, _xMouse, _yMouse){
	this._scale = _scale;
	var _bool = false;
	if(this._maskButton){
		this._set();
		
		var _tempX = this._x;
		var _tempY = this._y;
		
		var _sx = this._leftSide + this._x;
		var _bx = (this._rightSide/2) + this._x;
		var _sy = this._topSide + this._y;
		var _by = (this._bottomSide/2) + this._y;
		
		if(_xMouse > _sx && _xMouse < _bx && _yMouse > _sy && _yMouse < _by){
			if(this._hitAlpha == false){
				if(this._hit.length == 0){
					var _newCanvas = document.createElement('canvas');
					_newCanvas.width = this._rightSide;
					_newCanvas.height = this._bottomSide;
					
					var _newContext = _newCanvas.getContext('2d');
					
					this._x = this._rightSide/2;
					this._y = this._bottomSide/2;
					
					var _newContext = this._draw(_newContext);
					
					this._x = _tempX;
					this._y = _tempY;
					
					var _imageData = _newContext.getImageData(0, 0, _newCanvas.width, _newCanvas.height);
					this._hit = _imageData.data;
					this._hitWidth = _newCanvas.width;
					
					delete _newContext, _newCanvas, _imageData;
				}
				var _mouseX = _xMouse - _sx;
				var _mouseY = _yMouse - _sy;
				
				if(this._hit[((this._hitWidth * _mouseY) + _mouseX) * 4 + 3] != 0){
					_bool = true;
				}
			} else {
				_bool = true;
			}
		}
	}
	return _bool;
}

function _script(_name, _path, _type){
	this._scrpt = document.createElement('script');
	this._scrpt.type = _type;//'text/javascript' 'application/json';
	this._scrpt.src = _path;
	this._scrpt.id = _name;
}

_script.prototype._addScript = function(){
	var _element = document.getElementsByTagName("head")[0];
	_element.appendChild(this._scrpt);
}

_script.prototype._replaceScript = function(_replacer){
	var _element = document.getElementsByTagName("head")[0];
	var _elementReplaced = _element.getElementById(_replacer);
	_element.replaceChild(this._scrpt, _elementReplaced);
}

_script.prototype._removeScript = function(){
	var _element = document.getElementsByTagName("head")[0];
	_element.removeChild(this._scrpt);
}