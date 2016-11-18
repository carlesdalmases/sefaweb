//Retorna un array de layers SEFA
function CAPES_SEFA()
{
	this.sefa_layers = [];
	this.sefa_layers.push(new LAYER(
		'sefa_utm1x1', 
		new ol.layer.Vector(
		{
			source: construct_fishnet(),
			opacity: 0.5,
			style: define_fishnet_style(),
			visible: true
		})
	));
}; //Fi de CAPES_SEFA()

//Mètode que retorna un objecte layer indicant el nom de la capa
CAPES_SEFA.prototype.get_vectorlayer = function(nom_layer)
{
	return _.find(this.sefa_layers, function(d){return d.label==nom_layer;}).getvectorlayer();
};


function construct_fishnet()
{
	var vectorSource = new ol.source.Vector();
	_.forEach(fishnet.cells, function(c){
		vectorSource.addFeature(new ol.Feature({
    		name: c.UTMX+','+c.UTMY,
    		geometry: new ol.geom.Polygon(c.get_polygonXY())
		}));
	});
	return vectorSource;
}

function define_fishnet_style()
{
	return new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'red'
			}),
		stroke: new ol.style.Stroke({
			color: 'red',
			width: 1
    	})
    });	
}