function FISHNET()
{
	this.cells = [];
};

function CELL(utmx, utmy)
{
	this.UTMX = utmx;
	this.UTMY = utmy;
};

CELL.prototype.get_polygonXY = function()
{
	var offset = sefa_config.fishnet_resolution/2;
	var xy = [];
	xy.push([this.UTMX-offset,this.UTMY-offset]);
	xy.push([this.UTMX-offset,this.UTMY+offset]);
	xy.push([this.UTMX+offset,this.UTMY+offset]);
	xy.push([this.UTMX+offset,this.UTMY-offset]);
	xy.push([this.UTMX-offset,this.UTMY-offset]);
	return [xy];
}
