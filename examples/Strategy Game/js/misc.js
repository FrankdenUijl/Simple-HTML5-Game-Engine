function getWidthHeight() {
	scnHei = 0;
	scnWid = 0;
	if (self.innerHeight)
	{
		scnHei = self.innerHeight;
		scnWid = self.innerWidth;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
	{
		scnHei = document.documentElement.clientHeight;
		scnWid = document.documentElement.clientWidth;
	}
	else if (document.body)
	{
		scnHei = document.body.clientHeight;
		scnWid = document.body.clientWidth;
	}
	return [scnWid, scnHei];
}

window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function DistanceTwoPoints(x1, x2,  y1, y2) {
	var dx = x1-x2;
	var dy = y1-y2;
	return Math.sqrt(dx * dx + dy * dy);
}