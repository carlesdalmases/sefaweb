/*  ************************************************************************* */
/*  							GRAPHDATA									  */
/*  ************************************************************************* */
function GRAPHDATA()
{
	this.graphdata = [];
};
GRAPHDATA.prototype.get_graphdata_nocolor = function()
{
	return _.orderBy(this.graphdata,['value'],['desc']);
}

GRAPHDATA.prototype.get_graphdata_colorbyvalue = function(id_colorbrewer)
{
	//Pel propi valor
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(_.maxBy(this.graphdata,'value').value, id_colorbrewer);
		_.forEach(this.graphdata, function(g,i){g.color = c.get_colorRGB(g.value);});
	}	
	return _.orderBy(this.graphdata,['value'],['desc']);
}

GRAPHDATA.prototype.get_graphdata_colorbycategory = function(id_colorbrewer)
{
	//Set Color
	//Per número de categories
	
	var x = _.orderBy(this.graphdata,['value'],['desc']);
	
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(this.graphdata.length, id_colorbrewer);
		_.forEach(x, function(g,i){g.color = c.get_colorRGB(i);});
	}
	return x;
}

GRAPHDATA.prototype.get_graphdata_colorbycategory_invert = function(id_colorbrewer)
{
	//Set Color
	//Per número de categories
	
	var x = _.orderBy(this.graphdata,['value'],['desc']);
	
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(this.graphdata.length, id_colorbrewer);
		_.forEach(x, function(g,i){g.color = c.get_colorRGB_invert(i);});
	}
	return x;
}



GRAPHDATA.prototype.set_graphdata = function(label,value)
{
	this.graphdata.push(new GD(label,value));
};

function GD(label,value)
{
	this.label = label;
	this.value = value;
	this.color;
};