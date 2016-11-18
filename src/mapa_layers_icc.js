//Retorna un array d'objectes de tipus ICC amb les capes WMTS
function CAPES_ICC()
{
	this.icc_layers = [];
	
	this.icc_layers.push(new LAYER('topo', wmts('topo')));
	this.icc_layers.push(new LAYER('topogris', wmts('topogris')));
	this.icc_layers.push(new LAYER('orto', wmts('orto')));
	this.icc_layers.push(new LAYER('ortogris', wmts('ortogris')));
	
	function wmts(layer_name)
	{
		return new ol.layer.Tile(
		{
			opacity: 0.7,
			extent: sefa_config.get_map_extent(),
			source: new ol.source.TileWMS(
			{
				//attributions: [attribution],
				url: 'http://mapcache.icc.cat/map/bases/service?',
				params: {'LAYERS': layer_name}
			})
		});
	};
};

//Mètode que retorna un objecte tile indicant el nom de la capa
CAPES_ICC.prototype.get_tilelayer = function(nom_layer)
{
	return _.find(this.icc_layers, function(d){return d.label==nom_layer;}).gettilelayer();
};
