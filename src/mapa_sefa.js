function mapa_sefa_localitats_quadricula()
{
	//Si no s'ha declarat el DIV per contenir el mapa, no faig res
	if (!$("#mslq").length){return;}
	
	//Actualitzo el títol
	$('div#mapa_sefa_localitats_quadricula_heading').html('<h1 class="panel-title">'+_.capitalize(sefa_config.translates.get_translate('locations'))+'</h1>');

	//Determino les mides del mapa:
	$().attr('height','700px')
	   .attr('width','100%');
	
	//Instàncies dels objectes amb les capes WMS 
	var icc = new CAPES_ICC();
	var diba = new CAPES_DIBA();
	var sefa = new CAPES_SEFA();
	
	//MAPA
	var map = new ol.Map(
	{
		target: 'mslq',
		interactions: ol.interaction.defaults({mouseWheelZoom:false}),
		view: new ol.View({
			projection: sefa_config.get_map_projection(),
			center: sefa_config.get_map_centerXY(),
			zoom: sefa_config.get_map_zoom_initial(),
			resolutions: sefa_config.get_map_resolutions(),
			extent: sefa_config.get_map_extent()
		})
	});

	//Calculo l'extent del mapa segons la vista inicial
	mapextent = map.getView().calculateExtent(map.getSize());

	//Instància de l'objecte amb la llista de controls del mapa
	var controls_list = new CONTROLS(mapextent);
	_.each(controls_list.getControls(), function(d){map.addControl(d)});

	//TODO fixar el PAN sobre el mapa a mapextent.

	//Consulta sobre el mapa
	map.on('click', function(evt) {displayFeatureInfo(evt.pixel, evt.coordinate);});
	
	//Mousemove
	/*
	$(map.getViewport()).on('mousemove', function(evt) {
  			var pixel = map.getEventPixel(evt.originalEvent);
  			displayFeatureInfo(pixel);
	});
	*/

	addLayer_check(map, icc.get_tilelayer('topogris'));
	addLayer_check(map, diba.get_tilelayer('limitsxpn'));
	addLayer_check(map, sefa.get_vectorlayer('sefa_utm1x1'));


	var displayFeatureInfo = function(pixel, coords) {
	
			map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				view_popup(map, coords, feature.get('name'));
			});
	};

};//Fi de mapa_sefa_localitats_quadricula()


function CONTROLS(mapextent)
{
	this.c = [
	
	new ol.control.ScaleLine(
	{
		units: 'metric',
		minWidth: 100
	}),

	new ol.control.MousePosition(
	{
		undefinedHTML: '',
		//projection: ol.proj.get('EPSG:4326'),
		units: 'meters',
		coordinateFormat: function(coordinate) {return ol.coordinate.format(coordinate, '{x}, {y}', 0)},
	}),
	
	new ol.control.ZoomToExtent({extent: mapextent}),
	new ol.control.Zoom()
	];
};

CONTROLS.prototype.getControls = function()
{
	return this.c;	
};

function view_popup(map, pixel, feature_name)
{
	//Exemple: http://jsfiddle.net/ro1ptr0k/26/

	//Si ja hi ha un Overlay obert, no faig res
	if(map.getOverlays().getArray().length){return;};

	//Creo l'element DIV id=popup
	$('#mslq').append('<div id="popup" class="ol-popup"></div>');
	
	$newpopupcloser = $('<a/>')
					 .attr('href', '#')
					 .attr('id', 'popup-closer')
					 .addClass('ol-popup-closer')
					 .on('click', function(){
										map.removeOverlay(overlay);
										$('#popup-closer').blur();
										return false;		
										});
	$('#popup').append($newpopupcloser);

	//Busco a les dades, totes les localitats dins de la quadrícula
	var r = manage_sd.get_locations_by_feature_name(feature_name);
	
	//Creo la taula amb els resultats
	$newtable = $('<table/>')
			    .addClass('table')
			    .addClass('table-condensed');

	$newtable.append('<thead>'+
		'<tr>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('park'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('species'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('core'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('method'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('period'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('date_start'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('date_end'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('n_census'))+'</th>'+
		'</tr>'+
	'</thead>'+
	'<tbody>'
	);
	
	_.forEach(r, function(q){
		
		$newtable.append('<tr>'+
				'<td>'+sefa_config.translates.get_translate(q.ID_PARC)+'</td>'+
				'<td class=\'specie\'>'+q.ESPECIE+'</td>'+
				'<td>'+q.NUCLI_POBLACIONAL+'</td>'+
				'<td>'+q.METODOLOGIA_SEGUIMENT+'</td>'+
				'<td>'+q.PERIODICITAT+'</td>'+
				'<td>'+q.DATA_CENS_FIRST+'</td>'+
				'<td>'+q.DATA_CENS_LAST+'</td>'+
				'<td>'+q.N_CENSOS+'</td>'+
				'</tr>'
			);
		});

	$newtable.append('</tbody>');

	//Afegeixo la taula al contingut
	$newpopupcontent = $('<div/>');
	$('#popup').append($newpopupcontent);
	$newpopupcontent.append($newtable);

	
	//Add Overlay
	var overlay = new ol.Overlay({element: $('#popup')[0]});
	map.addOverlay(overlay);
	overlay.setPosition(pixel);
}; //Fi de view_popup


//Check if layer exist in map, return true/false
function map_layer_check(map, layer)
{
		if(!_.isUndefined(_.find(map.getLayers().getArray(), function(d){return d == layer;})))
		{return true;}
		else{return false;}
}; //Fi de map_layer_check

function addLayer_check(map, layer)
{
	if(!map_layer_check(map, layer))
	{map.addLayer(layer);}
}; //Fi de addLayer_check(map, layer)

function removeLayer_check(map, layer)
{
	if(map_layer_check(map, layer))
	{map.removeLayer(layer);}
}; //Fi de removeLayer_check
