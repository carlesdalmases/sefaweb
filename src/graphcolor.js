//Values of colorbrewer: view colorbrewer.js

function GRAPHCOLOR(n, id_colorbrewer)
{
	this.colorRamp = d3.scale.quantize()
							.domain([0,n])
							.range((_.toPairs(_.pick(colorbrewer, [id_colorbrewer])))[0][1][9]);

	this.colorRamp_invert = d3.scale.quantize()
							.domain([n,0])
							.range((_.toPairs(_.pick(colorbrewer, [id_colorbrewer])))[0][1][9]);

}

GRAPHCOLOR.prototype.get_colorRGB = function(i)
{
	return this.colorRamp(i);
}

GRAPHCOLOR.prototype.get_colorRGB_invert = function(i)
{
	return this.colorRamp_invert(i);
}


