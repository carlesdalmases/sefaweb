function LAYER(label, layer_tile)
{
	this.label = label;
	this.layer_tile = layer_tile;
};
LAYER.prototype.gettilelayer = function()
{
	return this.layer_tile;
};

LAYER.prototype.getvectorlayer = function()
{
	return this.layer_tile;
};

