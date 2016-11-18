//Retorna un array d'objectes de tipus ICC amb les capes WMTS
function CAPES_DIBA()
{
	this.diba_layers = [];
	
	this.diba_layers.push(new LAYER(
	'limitsxpn', 
	new ol.layer.Tile(
	{
		source: new ol.source.TileWMS(
		{
			url: 'http://sitmun.diba.cat/wms/servlet/XPE50?',
			params: 
			{
				'LAYERS': 'XPE50_111L',
				'VERSION': '1.1.1',
				'FORMAT': 'image/png',
				'TILED': true,
				'SERVICE': 'WMS',
				'TRANSPARENT': true,
				'BGCOLOR': 0x000000,
				'OUTLINE': true,
				'STYLE': 'opacity:0.8',
				'SRS': sefa_config.get_map_epsg(),
			}
		})
	})
	));
}; //Fi de CAPES_DIBA()

//Mètode que retorna un objecte tile indicant el nom de la capa
CAPES_DIBA.prototype.get_tilelayer = function(nom_layer)
{
	return _.find(this.diba_layers, function(d){return d.label==nom_layer;}).gettilelayer();
};

