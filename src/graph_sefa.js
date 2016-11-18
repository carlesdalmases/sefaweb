function GRAPH_SEFA(){};

function get_string_n_total(d)
{
	return ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
};


GRAPH_SEFA.prototype.graph_by_method = function(){
	
	var div = 'sefa_graphs_methods';
	//if(!_.isUndefined(div)){return;}
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_method();
	
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('methods'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
};

GRAPH_SEFA.prototype.graph_by_period = function(){
	
	var div = 'sefa_graphs_period';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_period();
	
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('periodicity'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
};

GRAPH_SEFA.prototype.graph_species_by_protectedarea = function() {
	
	var div = 'sefa_graphs_species_protectedarea';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_species_by_protectedarea();

	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('species_by_protectedarea'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
	
};

GRAPH_SEFA.prototype.graph_locations_by_protectedarea = function() {
	
	var div = 'sefa_graphs_protectedarea';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_locations_by_protectedarea();
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('locations_by_protectedarea'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
	
};

GRAPH_SEFA.prototype.graph_species_by_protectionlevel = function() {

	var div = 'sefa_graphs_species_protecionlevel';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_species_by_protectionlevel();
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('species_protecionlevel'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
	
};

GRAPH_SEFA.prototype.graph_species_by_protectioncatalog = function() {

	var div = 'sefa_graphs_species_protectioncatalog';
	if(!$('#'+div).length){return;}
	var d =  manage_sd.get_groupby_species_by_protectioncatalog();
	var defaults = pie_defaults();
	defaults.header.title.text = sefa_config.translates.get_translate('species_protectioncatalog')+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
	
};

//PIE GRAPH
function graph_pie_template(div, titol, dades)
{	
};
function pie_defaults()
{
return	{
		"header": {
			"title": {
				"text": '',
				"fontSize": 12,
				"font": "open sans"
			},
			"subtitle": {
				"text":"",
				"color":    "#666666",
				"fontSize": 10,
				"font":     "open sans"
			},
			"location": "top-left"
		},
		"size": {
			"canvasWidth": 400,
			"canvasHeight": 300,
			"pieInnerRadius": "50%",
			"pieOuterRadius": "75%"
		},
		"data": {
			"sortOrder": "value-desc",
			"smallSegmentGrouping": {
				"enabled": true,
				"label": sefa_config.translates.get_translate('others'),
			},
			"content": ''
		},
		"labels": {
			"outer": {
				"pieDistance": 32
			},
			"inner": {
				"hideWhenLessThanPercentage": 3
			},
			"mainLabel": {
				"fontSize": 9
			},
			"percentage": {
				"color": "#BDBDBD",
				"decimalPlaces": 0
			},
			"value": {
				"color": "#adadad",
				"fontSize": 10
			},
			"lines": {
				"enabled": true,
				"color": "#424242"
			},
			"truncation": {
				"enabled": true
			}
		},
		"tooltips": {
			"enabled": true,
			"type": "placeholder",
			"string": "{label}: {value}, {percentage}%"
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "none",
				"speed": 400,
				"size": 8
			}
		},
		"misc": {
			"gradient": {
				"enabled": false,
				"percentage": 100
			}
		}
	};
};

//graph_species_tracked_by_protectionlevel
GRAPH_SEFA.prototype.graph_species_tracked_by_protectionlevel = function() {

	var div = 'sefa_graphs_species_tracked_by_protectionlevel';
	if(!$('#'+div).length){return;}
	
	//Data
	var data_total = manage_sd.get_groupby_protectionlevel_from_tesaurus();
	//Exclude EIL
	var data_tracked = manage_sd.get_groupby_species_by_protectionlevel();
	_.remove(data_tracked, ['label', 'EIL']);

	var abs_width = 400;
	var abs_height = 200;

    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 50},
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(data_total, function(d) {return d.value;})]);

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.05,0)
			  .domain(_.map(data_total, function(n){return n.label;}));

	//Calculo l'alçada de la barra del gràfic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb el total
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', function(d,i){return d.color;})
		.style('fill-opacity', '0.7')
		.style('stroke', function(d,i){return d.color;})
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a mínim farà 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Total '+d.label+': '+d.value;})
		;		

	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1);

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_tracked)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a mínim farà 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Amb seguiment '+d.label+': '+d.value;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	


	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var minim_weight_bar = 30;
	var padding_label = 3;

	//var total_count = _.reduce(data_tracked, function(memo, d){ return memo + d.count; }, 0);

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(data_tracked)
		.enter()
		.append('text')
		//Posició del text
		.attr({'x':function(d){return scaleX(d.value)+(scaleX(d.value)<minim_weight_bar?padding_label:padding_label*-1);}, 'y':function(d){return scaleY(d.label)+(bar_height/2);}})
		//A dins o a fora de la barra
		.style('text-anchor', function(d){return scaleX(d.value)<minim_weight_bar?'start':'end';})
		.style('alignment-baseline', 'middle') 
		.style("font-size", "10px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){return percent((d.value/((_.find(data_total, function(x){return x.label == d.label})).value)));})
		;
		
		//Afegeixo el títol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('number'));
		
	//Afegeixo el títol del gràfic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left/2) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_protectionlevel_title'));		

}; //Fi de graph_species_tracked_by_protectionlevel()

//graph_species_tracked_by_protectionlevel
GRAPH_SEFA.prototype.graph_species_tracked_by_protectioncatalog = function() {

	var div = 'sefa_graphs_species_tracked_by_protectioncatalog';
	if(!$('#'+div).length){return;}
	
	//Data
	var data_total = manage_sd.get_groupby_protectioncatalog_from_tesaurus();
	_.remove(data_total, ['label', sefa_config.translates.get_translate('0')]);

	//Exclude EIL
	var data_tracked = manage_sd.get_groupby_species_by_protectioncatalog();
	_.remove(data_tracked, ['label', sefa_config.translates.get_translate('nopresent')]);

	var abs_width = 400;
	var abs_height = 200;

    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 60},
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(data_total, function(d) {return d.value;})]);

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.05,0)
			  .domain(_.map(data_total, function(n){return n.label;}));

	//Calculo l'alçada de la barra del gràfic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb el total
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', function(d,i){return d.color;})
		.style('fill-opacity', '0.7')
		.style('stroke', function(d,i){return d.color;})
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a mínim farà 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Total '+d.label+': '+d.value;})
		;		

	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1)
	    .style("opacity", 0.8);

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_tracked)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a mínim farà 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Amb seguiment '+d.label+': '+d.value;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	


	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var minim_weight_bar = 31;
	var padding_label = 3;

	//var total_count = _.reduce(data_tracked, function(memo, d){ return memo + d.count; }, 0);

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(data_tracked)
		.enter()
		.append('text')
		//Posició del text
		.attr({'x':function(d){return scaleX(d.value)+(scaleX(d.value)<minim_weight_bar?padding_label:padding_label*-1);}, 'y':function(d){return scaleY(d.label)+(bar_height/2);}})
		//A dins o a fora de la barra
		.style('text-anchor', function(d){return scaleX(d.value)<minim_weight_bar?'start':'end';})
		.style('alignment-baseline', 'middle') 
		.style("font-size", "10px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){return percent((d.value/((_.find(data_total, function(x){return x.label == d.label})).value)));})
		;
		
		//Afegeixo el títol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('number'));
		
	//Afegeixo el títol del gràfic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left/2) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_protectioncatalog_title'));		

}; //Fi de graph_species_tracked_by_protectioncatalog()

//graph_species_tracked_by_tracked_dates_acumulated
GRAPH_SEFA.prototype.graph_species_tracked_by_tracked_dates_acumulated = function() {

	var div = 'sefa_graphs_species_tracked_by_tracked_dates_acumulated';
	if(!$('#'+div).length){return;}
	
	var min_bar_width = 5;
	
	//Data
	var data_total = manage_sd.get_groupby_species_by_tracked_dates_acumulated();
	var data_census = manage_sd.get_groupby_species_by_tracked_dates();
	
    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (data_total.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Date
	var scaleX = d3.time.scale()
	          .range([0, width])
	          .domain([
	          			moment((_.minBy(data_total, function(x){return moment(x.t0, 'DD-MM-YYYY').valueOf();})).t0, 'DD-MM-YYYY').toDate(), 
	          			moment((_.maxBy(data_total, function(x){return moment(x.t1, 'DD-MM-YYYY').valueOf();})).t1, 'DD-MM-YYYY').toDate()
	          			])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.1,0)
			  .domain(_.map(data_total, function(n){return n.sp;}));

	//Calculo l'alçada de la barra del gràfic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX
	
	//Afegir bbox de referència (invisible) amb title
/*
	svg.append('g')
		.attr('id','bbox_reference')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		.style('stroke', 'transparent')
		.attr('width',function(d){return scaleX(moment(d.t0,'DD-MM-YYYY').toDate());})
		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		
*/

	//Afegir línia de referència
	svg.append('g')
		.attr('id','line_reference')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('line')
		.attr('x1', 4)
		.attr('y1', function(d){return scaleY(d.sp)+(bar_height/2);})
		.attr('x2', function(d){return (scaleX(moment(d.t0,'DD-MM-YYYY').toDate()))-4;})
		.attr('y2', function(d){return scaleY(d.sp)+(bar_height/2);})
		//.style('stroke', '#31a354')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '4')
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#31a354');})
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})
		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':function(d){return scaleX(moment(d.t0,'DD-MM-YYYY').toDate());},
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', '#a1d99b')
		.style('fill-opacity', '0.7')
		.style('stroke', '#31a354')
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var dif = scaleX(moment(d.t1,'DD-MM-YYYY').toDate()) - scaleX(moment(d.t0,'DD-MM-YYYY').toDate()); 
									return dif<min_bar_width?min_bar_width:dif;
								}) //Com a mínim farà min_bar_width d'amplada

		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		


	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1)
	    .style("opacity", 0.8);

	//Afegir barres amb el parcial
/*
	svg.append('g')
		.attr('id','bars_pattern')
		.selectAll('rect')
		.data(data_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':function(d){
										//Si només tinc una data, miro si està al final del període
										var scaleX_min = scaleX(moment(d.DATA_CENS_FIRST,'DD-MM-YYYY').toDate());
										var scaleX_max = scaleX(moment(d.DATA_CENS_LAST,'DD-MM-YYYY').toDate());
										var dif = scaleX_max - scaleX_min;
										var data_max_limit = _.find(data_total, function(x){return x.sp == d.ESPECIE}).t1;
										var scaleX_max_limit = scaleX(moment(data_max_limit,'DD-MM-YYYY').toDate());
										var data_min_limit = _.find(data_total, function(x){return x.sp == d.ESPECIE}).t0;
										var scaleX_min_limit = scaleX(moment(data_min_limit,'DD-MM-YYYY').toDate());
										var dif_limit = scaleX_max_limit - scaleX_min_limit;
										
										if(dif < min_bar_width)
										{
											//Cas 1
											if(dif_limit < min_bar_width){return scaleX_min;}
											else if(scaleX_min + min_bar_width > scaleX_max_limit){return scaleX_min - (scaleX_min + min_bar_width - scaleX_max_limit);}
											else{return scaleX_min;}
										}
										else{return scaleX_min;}	
									},
					'y':function(d){return scaleY(d.ESPECIE);}
			  })		
	    .style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){
									var dif = scaleX(moment(d.DATA_CENS_LAST,'DD-MM-YYYY').toDate()) - scaleX(moment(d.DATA_CENS_FIRST,'DD-MM-YYYY').toDate()); 
									return dif<min_bar_width?min_bar_width:dif;
								}) //Com a mínim farà min_bar_width d'amplada

		.append("svg:title")
		.text(function(d) {return d.ESPECIE+': '+d.DATA_CENS_FIRST+' -> '+d.DATA_CENS_LAST;})
		;		
*/

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	
	
	//Afegeixo el títol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('date'));
		
	//Afegeixo el títol del gràfic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_tracked_dates_acumulated_title'));		

}; //Fi de graph_species_tracked_by_tracked_dates_acumulated()

GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations = function() {
	return this.graph_groupby_species_by_num_locations_(manage_sd.get_groupby_species_by_num_locations());
};


GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations_by_park = function() {
	
	_.forEach(manage_sd.get_unique_protected_areas(),function(w){
		
		var div_origin = 'sefa_graphs_groupby_species_by_num_locations_by_park';
		if(!$('#'+div_origin).length){return;}

		var div = 'sefa_graphs_groupby_species_by_num_locations_by_park_'+w;
		$('#'+div_origin).append('<div class="row"><div class="panel panel-default"><div class="panel-heading">'+sefa_config.translates.get_translate(w)+'</div><div id="'+div+'" class="panel-body"></div></div></div>');
		graphs.graph_groupby_species_by_num_locations_(manage_sd.get_groupby_species_by_num_locations_by_park(w),div);
	});
};

GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations_ = function(num_locations,div_) {

	var min_bar_width = 5;
	var div;
	if(!_.isUndefined(div_)){div = div_;}
	else{div = "sefa_graphs_groupby_species_by_num_locations";}
	if(!$('#'+div).length){return;}
		
	//Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (num_locations.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	//L'escala de les X s'ha de calcular sobre el total de totes les espècies a tots els parcs!
	//No és molt òptim, però demano manage_sd.get_groupby_species_by_num_locations()
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(manage_sd.get_groupby_species_by_num_locations(), function(d) {return d.locations_total;})])
	          //.domain([0, d3.max(num_locations, function(d) {return d.locations_total;})])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(num_locations, function(n){return n.sp;}));

	//Calculo l'alçada de la barra del gràfic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
				//.ticks(scaleX.domain()[1]-scaleX.domain()[0])
	            .tickFormat(d3.format('d'));
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select("div#"+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', '#fed976')
		.style('fill-opacity', '0.7')
		.style('stroke', '#fed976')
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var x = scaleX(d.locations_total);
									return x<min_bar_width?min_bar_width:x;
								}) //Com a mínim farà min_bar_width d'amplada
		;		

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars_pattern')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })		
	    //.style('fill', 'url(#diagonalHatch)')
		.style('fill', '#e31a1c')
		.style('fill-opacity', '0.7')
		.attr('width',function(d){
									if(d.locations_census){
										var x = scaleX(d.locations_census);
										return x<min_bar_width?min_bar_width:x;
									}
								
								}) //Com a mínim farà min_bar_width d'amplada
		;		

	//Barres amb el total, transparents
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		//.style('fill-opacity', '0.7')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var x = scaleX(d.locations_total);
									return x<min_bar_width?min_bar_width:x;
								}) //Com a mínim farà min_bar_width d'amplada
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#000000');})   
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})		
		.append("svg:title")
		.text(function(d) {return d.sp+', '+sefa_config.translates.get_translate('locations')+': '+d.locations_total+', '+sefa_config.translates.get_translate('locations_with_census')+': '+d.locations_census;})
		;		

	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var padding_label = 3;

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(num_locations)
		.enter()
		.append('text')
		//Posició del text
		.attr({
				'x':function(d){var x = scaleX(d.locations_census);
								return (x<min_bar_width?padding_label:x+padding_label);}, 
				'y':function(d){return scaleY(d.sp)+(bar_height/2);}
				})
		//A dins o a fora de la barra
		//.style('text-anchor', function(d){return scaleX(d.value)<min_bar_width?'start':'end';})
		.style('text-anchor', 'start')
		.style('alignment-baseline', 'middle') 
		.style("font-size", "9px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){
							var t = d.locations_census/d.locations_total;
							return _.floor(t)?'':percent(t);
					})
		;


	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	
	
	//Afegeixo el títol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('locations_number'));
		
	//Afegeixo el títol del gràfic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_groupby_species_by_num_locations_title'));		

}; //Fi de graph_groupby_species_by_num_locations()


GRAPH_SEFA.prototype.graph_groupby_species_by_num_census = function() {

	var div = 'sefa_graphs_groupby_species_by_num_census';
	if(!$('#'+div).length){return;}
	var min_bar_width = 5;
	
	//Data
	var num_census = manage_sd.get_groupby_species_by_num_census();
	
    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (num_census.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(num_census, function(d) {return d.census_total;})])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(num_census, function(n){return n.sp;}));

	//Calculo l'alçada de la barra del gràfic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Escala de colors
	var c = new GRAPHCOLOR(_.maxBy(num_census,'census_total').census_total, 'YlOrRd');

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
//		.style('fill', '#fed976')
		.style('fill', function(d){return c.get_colorRGB(d.census_total);})
		.style('fill-opacity', '0.9')
		.style('stroke', '#bdbdbd')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '1')
		.attr('width',function(d){
									if(d.census_total){
										var x = scaleX(d.census_total);
										return x<min_bar_width?min_bar_width:x;
									}
								}) //Com a mínim farà min_bar_width d'amplada
		;		

	//Barres amb el total, transparents
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		//.style('fill-opacity', '0.7')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									if(d.census_total){
										var x = scaleX(d.census_total);
										return x<min_bar_width?min_bar_width:x;
									}
								}) //Com a mínim farà min_bar_width d'amplada
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#000000');})   
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})		
		.append("svg:title")
		.text(function(d) {return d.sp+', '+sefa_config.translates.get_translate('n_census')+': '+d.census_total;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis)
		;	
	
	//Afegeixo el títol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('n_census'));
		
	//Afegeixo el títol del gràfic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_groupby_species_by_num_census_title'));		

}; //Fi de graph_groupby_species_by_num_census()

/* ***** */
GRAPH_SEFA.prototype.graph_protectedarea_species_locations = function() {

	var div = 'sefa_graphs_protectedarea_species_locations';
	if(!$('#'+div).length){return;}
	
	var min_bar_width = 5;
	var protectedarea_width = 10;
	var gap = 5;
	var sp_height = 15;
	
	//Data
	var w = manage_sd.get_protectedarea_species_locations();
	
	//w.species_list
	//w.psl --> protected areas
	//w.pasl --> All locations
	
	
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (w.species_list.length * sp_height) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, 1]);

	//Escala Y: Ordinal
	var scaleY_sp = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(w.species_list, function(n){return n.ESPECIE;}));

	var scaleY_pa = d3.scale.linear()
	          .range([0, height])
	          //.domain([0, d3.max(w.psl, function(d) {return d.locations_accumulated;})])
			  .domain([0, (d3.max(w.psl, function(d) {return d.locations_accumulated;}))+(_.last(w.psl)).locations_total])
			  ;	



	//Calculo l'alçada de la barra del gràfic, com una unitat de l'escala
	var bar_height_sp = scaleY_sp.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY_sp)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Escala de colors
	var c = new GRAPHCOLOR(w.psl.length, 'Spectral');

	//*******************************
	//Barres dels parcs naturals
	//*******************************
	svg.append('g')
		.attr('id','bars_pa')
		.selectAll('rect')
		.data(w.psl)
		.enter()
		.append('rect')
		.attr('height',function(d){return scaleY_pa(d.locations_total)})
		.attr({
					'x':scaleX(1)-protectedarea_width,
					'y':function(d){return scaleY_pa(d.locations_accumulated);}
			  })
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.9')
		.style('stroke', 'black')
		.style('stroke-opacity', '0.9')
		.style('stroke-width', '1')
		.attr('width',protectedarea_width) //Com a mínim farà min_bar_width d'amplada

		.on('mouseover', function(d,i){
										//PARCS
										//Esborrar les barres de tots els parcs
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.select(this).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										
										//FLUXES
										//Esborrar tots els fluxes
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il·luminar només els fluxes d'aquest parc natural
										d3.selectAll('#fluxes path').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//Etiquetes espècies
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										_.forEach(d.species, function(o){
												d3.selectAll('#bars_species rect').filter(function(r){return r.ESPECIE == o.specie;}).transition().style('fill-opacity', 0);
											});

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										//PARCS
										//Tornar a l'estat inicial
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);

									 })
		;		

	//Etiquetes dels Parcs
	svg.append('g')
		.attr('id','protectedareas_labels')
		.selectAll('text')
		.data(w.psl)
		.enter()
		.append('text')
		.attr({
					'x':scaleX(1)+gap,
					'y':function(d){return (scaleY_pa(d.locations_accumulated)+(scaleY_pa(d.locations_total)/2));}
			  })
		.text( function (d) { return d.protectedarea; })
		.style('font-family', 'sans-serif')
		.style('font-size', '8px')
		.style('fill', 'black')
		.style('fill-opacity', '1')
		;	

	//Rectangles sobre les etiquetes dels parcs
	svg.append('g')
		.attr('id','bars_pa_labels')
		.selectAll('rect')
		.data(w.psl)
		.enter()
		.append('rect')
		.attr('height',function(d){return scaleY_pa(d.locations_total)})
		.attr({
					'x':scaleX(1),
					'y':function(d){return scaleY_pa(d.locations_accumulated);}
			  })
		.style('fill', 'white')
		.style('fill-opacity', '0')
		.style('stroke', 'none')
		//.style('stroke-opacity', '0')
		//.style('stroke-width', '1')
		.attr('width',margin.right)

		.on('mouseover', function(d,i){
										//PARCS
										//Esborrar les barres de tots els parcs
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//d3.select(this).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_pa rect').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);										
										//FLUXES
										//Esborrar tots els fluxes
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il·luminar només els fluxes d'aquest parc natural
										d3.selectAll('#fluxes path').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//Etiquetes espècies
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										_.forEach(d.species, function(o){
												d3.selectAll('#bars_species rect').filter(function(r){return r.ESPECIE == o.specie;}).transition().style('fill-opacity', 0);
											});

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										//PARCS
										//Tornar a l'estat inicial
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);

									 })
		;		
	

	//Afegir eix Y - Espècies
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis)
		;	


	//* **********************
	// Rectangles sobre les etiquetes de les espécies
	//* **********************
	svg.append('g')
		.attr('id','bars_species')
		.selectAll('rect')
		.data(w.species_list)
		.enter()
		.append('rect')
		.attr('height',bar_height_sp)
		.attr({
					'x':scaleX(0)-margin.left,
					'y':function(d){return scaleY_sp(d.ESPECIE);}
			  })
		.style('fill', 'white')
		.style('fill-opacity', 0)
		.style('stroke', 'none')
		//.style('stroke-opacity', '0.9')
		//.style('stroke-width', '1')
		.attr('width',margin.left-gap)

		.on('mouseover', function(d,i){
										//FLUXES
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il·luminar només els fluxes d'aquesta espècie
										d3.selectAll('#fluxes path').filter(function(r){return r.specie == d.ESPECIE;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//ETIQUETES
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										d3.select(this).transition().style('fill-opacity', 0);
										
										//PARCS
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.selectAll('#bars_pa rect').filter(function(r){
															var q = _.find(r.species, function(i){return i.specie == d.ESPECIE});
															return _.isUndefined(q)?false:true;
													}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
									  
									  	//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){
															var q = _.find(r.species, function(i){return i.specie == d.ESPECIE});
															return _.isUndefined(q)?false:true;
													}).transition().style('fill-opacity', 1);										
									  })
									  
		.on('mouseout', function(d,i){
										//Tornar a l'estat inicial
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);
									 })
		;

	//********************
	//Path de fluxes
	//********************
	var poly = function(d){
		var xy0 = {'x':(scaleX(1)-protectedarea_width-gap), 'y':(scaleY_pa(d.s_locations_accumulated))};
		var xy1 = {'x':(scaleX(0)+gap), 'y':(scaleY_sp(d.specie))};
		var xy2 = {'x':(scaleX(0)+gap) ,'y':(scaleY_sp(d.specie)+(bar_height_sp))};
		var xy3 = {'x':(scaleX(1)-protectedarea_width-gap) ,'y':(scaleY_pa(d.s_locations_accumulated+d.s_locations_total))};
	
		var i = 'M '+xy0.x+' '+xy0.y+' ';
		var f= 'Z';
		var s0 = 'L '+xy2.x+' '+xy2.y+' ';
	
	//	var randomX = _.random(0.2, 0.8, true);
		var randomX = 0.3;
	
		//https://www.dashingd3js.com/svg-paths-and-d3js
		var curve_d1 = function(x1,y1){
			
			var xp = scaleX(randomX);
			var yp = y1;
			
			return 'Q '+xp+' '+yp+' '+x1+' '+y1+' ';
		};
	
		var curve_d2 = function(x0,y0,x1,y1){
			
			var xp = scaleX(randomX);
			var yp = y0;
			
			return 'Q '+xp+' '+yp+' '+x1+' '+y1+' ';
		};
		var d1 = curve_d1(xy1.x,xy1.y);
		var d2 = curve_d2(xy2.x,xy2.y,xy3.x,xy3.y);
		return i+d1+s0+d2+f;
	};
	svg.append('g')
		.attr('id','fluxes')
		.selectAll('rect')
		.data(w.pasl)
		.enter()
		.append('path')
		.attr('d', function(d){return poly(d);})
		.style('stroke', '#bdbdbd')
		.style('stroke-opacity', 0.9)
		.style('stroke-width', 0.5)
		.style('fill',function(d){return c.get_colorRGB(_.findIndex(w.psl, function(o){return d.protectedarea == o.protectedarea;}));})
		.style('fill-opacity', 0.5)

		.on('mouseover', function(d,i){
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.select(this).transition().style('fill-opacity', 0.9);
										
										//ETIQUETES
										d3.selectAll('#bars_species rect').filter(function(r){return !(r.ESPECIE == d.specie);}).transition().style('fill-opacity', 0.9);

										//PARCS
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.selectAll('#bars_pa rect').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.2);

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);
									 })
		;		

	//Afegeixo el títol del gràfic

	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_locations_species_protectedarea'));		

}; //Fi de graph_protectedarea_species_locations()



// THREATS
GRAPH_SEFA.prototype.graph_by_threats = function(){
	
	var div = 'sefa_graphs_threats';
	if(!$('#'+div).length){return;}
	var width = 500;
	var height = 300;
	var d = manage_sd.get_groupby_threats();
	var n_total = ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('threats'))+n_total;
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	defaults.size.pieInnerRadius='25%';
	defaults.size.canvasWidth = width;
	defaults.size.canvasHeight = height;	
	
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+width+'px;'+'height:'+height+'px;');
	return pie;
};


// IMPACTS
GRAPH_SEFA.prototype.graph_by_impacts = function(){
	
	var div = 'sefa_graphs_impacts';
	if(!$('#'+div).length){return;}
	var width = 500;
	var height = 300;
	var d = manage_sd.get_groupby_impacts();
	var n_total = ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('impacts'))+n_total;
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	defaults.size.pieInnerRadius='25%';
	defaults.size.canvasWidth = width;
	defaults.size.canvasHeight = height;	
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+width+'px;'+'height:'+height+'px;');
	return pie;
};

GRAPH_SEFA.prototype.graph_by_impacts_year_series = function(){
	
	var div = 'sefa_graphs_impacts_year_series';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_impacts_peryear();

	/* ************************************************************** */
    //Legend width
    var legend_width = 150;
    
    //Margins
	var margin = {top: 20, right: legend_width, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//padding a l'eix de les X
	var padding=10;

	//Llegenda
	legend_line_length = legend_width*0.50;
	legend_line_v_gap = 25;
	legend_line_h_gap = 10;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain(d.ry);

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_impacts_year_series')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Dibuixar les línies de les sèries
	var line = d3.svg.line()
    .x(function(u) { return scaleX(u.DATA); })
    .y(function(u) { return scaleY(u.VALOR); })
    ;

	//Escala de colors
	var c = new GRAPHCOLOR(_.keys(d.d).length, 'Spectral');
	
	var lines_transitions = {stroke_width_normal:2,
					  		stroke_width_selected:4,
					  		stroke_width_notselected:0.5,
					  		stroke_opacity_normal:0.8,
					  		stroke_opacity_selected:0.9,
					  		stroke_opacity_notselected:0.1
					  		};

	var circles_transitions = {					  			
						  		stroke_opacity_normal:0.8,
						  		stroke_opacity_selected:1,
						  		stroke_opacity_notselected:0.3,
						  		
						  		fill_opacity_normal:0.5,
						  		fill_opacity_selected:0.9,
						  		fill_opacity_notselected:0.1,
					  			
					  			radius_normal: '3px',
					  			radius_selected: '5px',
					  			radius_notselected: '1px'
					  			
					  		};

	//Escala Y per la llegenda: linear
	var scaleY_legend = d3.scale.linear()
	          .range([0, legend_line_v_gap*(_.keys(d.d)).length])
	          .domain([0,(_.keys(d.d)).length]);

	_.forOwn(d.d,function(value, key) 
	{
		//index del key a l'array
		var ii = _.indexOf(_.keys(d.d),key);
		var color = c.get_colorRGB(ii);
		var text_label = sefa_config.translates.get_translate(key);
		
		//Dibuixo la línia
		svg.append('path')
			.attr('id','linies_impacts'+ii)
			.attr('d', line(value))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)

			.on('mouseover', function(d,i){
											//LINIES, Esborrar totes les altres línies i seleccionada l'escollida
											//Seleccions especials amb selectAll: http://codepen.io/AlexBezuska/pen/EtDJe
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select(this).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);

										  	//CERCLES
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_impacts'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);

										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			.append("svg:title")
			.text(text_label)
			;
			//Més styles a: http://www.d3noob.org/2014/02/styles-in-d3js.html

		//Dibuixo un punt a cada vèrtex de la línia
		_.forEach(value, function(w){
			svg.append('circle')
				.attr('id','punts_impacts'+ii)
				.attr('cx', scaleX(w.DATA))           // position the x-centre
				.attr('cy', scaleY(w.VALOR))           // position the y-centre
				.attr('r', circles_transitions.radius_normal)             // set the radius
				.style('fill', color)     // set the fill colour*/
				.style('fill-opacity',circles_transitions.fill_opacity_normal)
				.style('stroke', color)
				.style('stroke-width', '0.5px')
				.style('stroke-opacity',circles_transitions.stroke_opacity_normal)
				.on('mouseover', function(d,i){
												//LINIES, Esborrar totes les altres línies i seleccionada l'escollida
												d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
												d3.select('path#linies_impacts'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
												                            .style('stroke-width', lines_transitions.stroke_width_selected);
												//BBOX
												d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
												d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);
											  
											  	//CERCLES
												d3.selectAll('[id*="punts_impacts"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_notselected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
													.attr('r', circles_transitions.radius_notselected);
	
												d3.selectAll('circle#punts_impacts'+ii).transition()
													.style('fill-opacity', circles_transitions.fill_opacity_selected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
													.attr('r', circles_transitions.radius_selected);
											  })
											  
				.on('mouseout', function(d,i){
												//LINIES, Tornar a l'estat inicial
												d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);

												//BBOX
												d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);
											 
											 	//CERCLES, Tornar a l'estat inicial
												d3.selectAll('[id*="punts_impacts"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_normal)
													.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
													.attr('r', circles_transitions.radius_normal);
											 })

				.append("svg:title")
				.text(function(d) {return sefa_config.translates.get_translate('n_total')+w.VALOR;})
				;
		});

		//Llegenda
		svg.append('line')
			.attr('id','legend_line_impact'+ii)
			.attr('x1', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y1', scaleY_legend(ii))
			.attr('x2', scaleX(d.rx[1])+legend_line_h_gap+legend_line_length)
			.attr('y2', scaleY_legend(ii))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			;
			
		svg.append('text')
			.attr('id','legend_text_impact'+ii)
			.style('text-anchor', 'start')
			.style('alignment-baseline', 'middle') 
			.style('font-size', '8px')
			.style('font-family', 'sans-serif')
			.text(text_label)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii)+lines_transitions.stroke_width_normal*4)
			;		

		svg.append('rect')
			.attr('id','legend_box_impact'+ii)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii))
			.attr('width', legend_width-legend_line_h_gap)
			.attr('height', legend_line_v_gap)
			.style('fill', 'white')
			.style('fill-opacity', '0')
			.style('stroke', 'none')
			.on('mouseover', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);

											//LINIES, Esborrar totes les altres línies i seleccionada l'escollida
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select('path#linies_impacts'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
										  	//CERCLES
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_impacts'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);

											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			;
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('impacts_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;

};

GRAPH_SEFA.prototype.graph_by_impacts_year_totals = function(){
	
	var div = 'sefa_graphs_impacts_year_totals';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_impacts_peryear();

	/* ************************************************************** */
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	var padding = 25;
	var width_bar = 50;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width-padding])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain([0,d.ry_d[1]])
	          .nice();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_impacts_year_totals')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Escala de colors
	var c = new GRAPHCOLOR(d.d_peryear.length, 'Spectral');

	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(d.d_peryear)
		.enter()
		.append('rect')
		.attr('height',function(h){return height-scaleY(h.val);})
		.attr('width',width_bar)
		.attr({'x':function(w){return scaleX(w.date)-(width_bar/2)},'y':function(r){return scaleY(r.val);}})
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.5')
		.style('stroke', function(d,i){return c.get_colorRGB(i);})
		.style('stroke-opacity', '1')
		.style('stroke-width', '1')
		.append("svg:title")
		.text(function(d) {return d.date+'\n'+sefa_config.translates.get_translate('n_total')+d.val;})
		;		
		
	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('impacts_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)-padding) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;
};

GRAPH_SEFA.prototype.graph_by_impacts_histo = function(){

	$('#sefa_graphs_impacts_year_totals').toggle();

	this.graph_by_impacts_year_series();
	this.graph_by_impacts_year_totals();
	
	//Botó per mostrar els totals per cada any (es modifica l'escala y i es dibuixa un histograma
	$('#sefa_graphs_impacts_year_series_button_totals').append('<div class="checkbox"><label><input id="check_graphs_impacts_year_series_button_totals" type="checkbox" value="">'+sefa_config.translates.get_translate('total_for_year')+'</label></div>');
	$('#check_graphs_impacts_year_series_button_totals').change(function() {
		
		if(this.checked) {
        	
        	$('#sefa_graphs_impacts_year_series').toggle('slow');
        	$('#sefa_graphs_impacts_year_totals').toggle('slow');
	   	}
    	else{
        	$('#sefa_graphs_impacts_year_series').toggle('slow');
        	$('#sefa_graphs_impacts_year_totals').toggle('slow');
    	}
	});	
};

GRAPH_SEFA.prototype.graph_by_threats_year_series = function(){
	
	var div = 'sefa_graphs_threats_year_series';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_threats_peryear();

	/* ************************************************************** */
 	//Legend width
    var legend_width = 150;
    
    //Margins
	var margin = {top: 20, right: legend_width, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//padding a l'eix de les X
	var padding=10;

	//Llegenda
	legend_line_length = legend_width*0.50;
	legend_line_v_gap = 25;
	legend_line_h_gap = 10;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain(d.ry);

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_threats_year_series')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Dibuixar les línies de les sèries
	var line = d3.svg.line()
    .x(function(u) { return scaleX(u.DATA); })
    .y(function(u) { return scaleY(u.VALOR); })
    ;

	//Escala de colors
	var c = new GRAPHCOLOR(_.keys(d.d).length, 'Spectral');
	
	var lines_transitions = {stroke_width_normal:2,
					  		stroke_width_selected:4,
					  		stroke_width_notselected:0.5,
					  		stroke_opacity_normal:0.8,
					  		stroke_opacity_selected:0.9,
					  		stroke_opacity_notselected:0.1
					  		};

	var circles_transitions = {					  			
						  		stroke_opacity_normal:0.8,
						  		stroke_opacity_selected:1,
						  		stroke_opacity_notselected:0.3,
						  		
						  		fill_opacity_normal:0.5,
						  		fill_opacity_selected:0.9,
						  		fill_opacity_notselected:0.1,
					  			
					  			radius_normal: '3px',
					  			radius_selected: '5px',
					  			radius_notselected: '1px'
					  			
					  		};

	//Escala Y per la llegenda: linear
	var scaleY_legend = d3.scale.linear()
	          .range([0, legend_line_v_gap*(_.keys(d.d)).length])
	          .domain([0,(_.keys(d.d)).length]);
	
	_.forOwn(d.d,function(value, key) 
	{
		//index del key a l'array
		var ii = _.indexOf(_.keys(d.d),key);
		var color = c.get_colorRGB(ii);
		var text_label = sefa_config.translates.get_translate(key);
		
		//Dibuixo la línia
		svg.append('path')
			.attr('id','linies_threats'+ii)
			.attr('d', line(value))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			//.style("stroke-linecap", "round")
			//.style("stroke-dasharray", ("10,3"))
			//.style("fill-opacity", .2
			//.style("stroke-opacity", .2)

			.on('mouseover', function(d,i){
											//LINIES, Esborrar totes les altres línies i seleccionada l'escollida
											//Seleccions especials amb selectAll: http://codepen.io/AlexBezuska/pen/EtDJe
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select(this).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

										  	//CERCLES
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_threats'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			.append("svg:title")
			.text(text_label)
			;
			//Més styles a: http://www.d3noob.org/2014/02/styles-in-d3js.html

		//Dibuixo un punt a cada vèrtex de la línia
		_.forEach(value, function(w){
			svg.append('circle')
				.attr('id','punts_threats'+ii)
				.attr('cx', scaleX(w.DATA))           // position the x-centre
				.attr('cy', scaleY(w.VALOR))           // position the y-centre
				.attr('r', circles_transitions.radius_normal)             // set the radius
				.style('fill', color)     // set the fill colour*/
				.style('fill-opacity',circles_transitions.fill_opacity_normal)
				.style('stroke', color)
				.style('stroke-width', '0.5px')
				.style('stroke-opacity',circles_transitions.stroke_opacity_normal)
				.on('mouseover', function(d,i){
												//LINIES, Esborrar totes les altres línies i seleccionada l'escollida
												d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
												d3.select('path#linies_threats'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
												                            .style('stroke-width', lines_transitions.stroke_width_selected);
												//BBOX
												d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
												d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

											  	//CERCLES
												d3.selectAll('[id*="punts_threats"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_notselected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
													.attr('r', circles_transitions.radius_notselected);
	
												d3.selectAll('circle#punts_threats'+ii).transition()
													.style('fill-opacity', circles_transitions.fill_opacity_selected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
													.attr('r', circles_transitions.radius_selected);
											  })
											  
				.on('mouseout', function(d,i){
												//LINIES, Tornar a l'estat inicial
												d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
											 
												//BBOX
												d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

											 	//CERCLES, Tornar a l'estat inicial
												d3.selectAll('[id*="punts_threats"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_normal)
													.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
													.attr('r', circles_transitions.radius_normal);
											 })

				.append("svg:title")
				.text(function(d) {return sefa_config.translates.get_translate('n_total')+w.VALOR;})
				;
			});
		//Llegenda
		svg.append('line')
			.attr('id','legend_line_threats'+ii)
			.attr('x1', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y1', scaleY_legend(ii))
			.attr('x2', scaleX(d.rx[1])+legend_line_h_gap+legend_line_length)
			.attr('y2', scaleY_legend(ii))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			;
			
		svg.append('text')
			.attr('id','legend_text_threats'+ii)
			.style('text-anchor', 'start')
			.style('alignment-baseline', 'middle') 
			.style('font-size', '8px')
			.style('font-family', 'sans-serif')
			.text(text_label)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii)+lines_transitions.stroke_width_normal*4)
			;		

		svg.append('rect')
			.attr('id','legend_box_threats'+ii)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii))
			.attr('width', legend_width-legend_line_h_gap)
			.attr('height', legend_line_v_gap)
			.style('fill', 'white')
			.style('fill-opacity', '0')
			.style('stroke', 'none')
			.on('mouseover', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

											//LINIES, Esborrar totes les altres línies i seleccionada l'escollida
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select('path#linies_threats'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
										  	//CERCLES
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_threats'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('threats_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;

};

GRAPH_SEFA.prototype.graph_by_threats_year_totals = function(){
	
	var div = 'sefa_graphs_threats_year_totals';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_threats_peryear();

	/* ************************************************************** */
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	var padding = 15;
	var width_bar = padding*2;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width-padding])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain([0,d.ry_d[1]])
	          .nice();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_threats_year_totals')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Escala de colors
	var c = new GRAPHCOLOR(d.d_peryear.length, 'Spectral');

	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(d.d_peryear)
		.enter()
		.append('rect')
		.attr('height',function(h){return height-scaleY(h.val);})
		.attr('width',width_bar)
		.attr({'x':function(w){return scaleX(w.date)-(width_bar/2)},'y':function(r){return scaleY(r.val);}})
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.5')
		.style('stroke', function(d,i){return c.get_colorRGB(i);})
		.style('stroke-opacity', '1')
		.style('stroke-width', '1')
		.append("svg:title")
		.text(function(d) {return d.date+'\n'+sefa_config.translates.get_translate('n_total')+d.val;})
		;		
		
	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('threats_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)-padding) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;
};

GRAPH_SEFA.prototype.graph_by_threats_histo = function(){

	$('#sefa_graphs_threats_year_totals').toggle();

	this.graph_by_threats_year_series();
	this.graph_by_threats_year_totals();
	
	//Botó per mostrar els totals per cada any (es modifica l'escala y i es dibuixa un histograma
	$('#sefa_graphs_threats_year_series_button_totals').append('<div class="checkbox"><label><input id="check_graphs_threats_year_series_button_totals" type="checkbox" value="">'+sefa_config.translates.get_translate('total_for_year')+'</label></div>');
	$('#check_graphs_threats_year_series_button_totals').change(function() {
		
		if(this.checked) {
        	
        	$('#sefa_graphs_threats_year_series').toggle('slow');
        	$('#sefa_graphs_threats_year_totals').toggle('slow');
	   	}
    	else{
        	$('#sefa_graphs_threats_year_series').toggle('slow');
        	$('#sefa_graphs_threats_year_totals').toggle('slow');
    	}
	});	
};

GRAPH_SEFA.prototype.graph_by_population_trend_by_park = function(id_park,species_trend,defaults){
	
	var factor_escala_1 = defaults.factor_escala_1;
	var factor_escala_2 = defaults.factor_escala_2;

    //Margins
	var margin = defaults.margin;
	//Absolute
	var abs_height = defaults.abs_height;
	var abs_width = defaults.abs_width;
	var width = defaults.width;
	var height = defaults.height;

	var scaleX = defaults.scaleX;

	var s_park = id_park;
	var s_div = 'sefa_graphs_population_trend_'+s_park;

	var v = species_trend;

	//Bucle per a totes les espècies dins del parc
	_.forEach(_.uniqBy(v, function(w){return w.SP;}), function(vv){
	
		var s_sp = vv.SP;
		s_div_sp = s_div+'_'+s_sp;
		$('#'+s_div).append('<div id="'+s_div_sp+'" class="col-md-6"></div>');
			
		//De totes les dades, seleccionar per park i espècie
		var r = _.filter(v, function(w){return _.isEqual(w.SP, vv.SP)});

		//Gràfic d'una espècie
		//Escala Y: linear, pròpia per a cada gràfica
		var scaleY = d3.scale.linear()
			.range([height, 0])
			.domain([0,_.maxBy(r,function(w){return w.VAL;}).VAL*factor_escala_1])
			.nice()
			;
		
		//Si només tinc una data per espècie, ajusto l'eix de les Y
		if(r.length<2)
		{
			scaleY.domain([0,(_.maxBy(r,function(w){return w.VAL;}).VAL)*factor_escala_2]);
		}

		//Eix X
		var xAxis = d3.svg.axis()
		            .scale(scaleX)
		            .orient("bottom")
		            .tickFormat(d3.format('d'))
		            //.tickPadding(10)
		            ;
		//Eix Y
		var yAxis = d3.svg.axis()
		            .scale(scaleY)
		            .orient("left")
		            //.innerTickSize(0)
		            //.outerTickSize(0)
		            .ticks(4)
		            .tickFormat(d3.format('d'))
		            ;
		//Objecte grafic
		var svg = d3.select('div#'+s_div_sp).append("svg")
			.attr('id',s_div+'_'+s_sp)
		    .style('width', width + margin.left + margin.right+'px')
		    .style('height', height + margin.top + margin.bottom+'px')
		    .attr('class', 'img-responsive')
			.append('g')
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//ClipPath per evitar que les línies de regressió surtin del CANVAS
		svg.append('clipPath')
			.attr('id', 'rect-clip')
			.append('rect')
				.attr('x', scaleX(scaleX.domain()[0]))
				.attr('y', scaleY(scaleY.domain()[1]))
				.attr('width', scaleX(scaleX.domain()[1])-scaleX(scaleX.domain()[0]))
				.attr('height', scaleY(scaleY.domain()[0])-scaleY(scaleY.domain()[1]))
				.style('stroke', 'red')
				.style('fill', 'black')
			;

		//Dibuixar les línies de les sèries
		var line = d3.svg.line()
		    .x(function(u){return scaleX(u.DATE);})
		    .y(function(u){return scaleY(u.VAL);})
	    ;

		//Si tenim més dues dates, dibuixo una línia
		if(r.length>1){
			//Dibuixo la línia
			svg.append('path')
				.attr('d', line(r))
				.style('fill', 'none')
				.style('stroke', 'black')
				.style('stroke-width', 1)
				.style('stroke-opacity', 1)
				;
		}

		//Vèrtexs de les línies
		_.forEach(r, function(w){
			svg.append('circle')
				.attr('cx', scaleX(w.DATE))
				.attr('cy', scaleY(w.VAL))
				.attr('r', 3)
				.style('fill', 'black')
				.style('fill-opacity',1)
				.append('svg:title')
				.text(sefa_config.translates.get_translate('n_total')+w.VAL+' ('+w.DATE+')')
				;
		});
		
		//Afegir la línia de regressió, només si tenim més de 2 punts
		if(r.length>2){
			var lrxy = [];
			_.forEach(_.orderBy(r, function(w){return w.DATE}), function(z){
					lrxy.push([z.DATE,z.VAL]);
				});
			var lr = regression('linear', lrxy);

			"y = lr.equation[0]*x + lr.equation[1]"
			svg.append('line')
				//.attr('id','legend_line_threats'+ii)
				.attr('x1', scaleX(scaleX.domain()[0]))
				.attr('y1', scaleY(lr.equation[0]*scaleX.domain()[0] + lr.equation[1]))
				.attr('x2', scaleX(scaleX.domain()[1]))
				.attr('y2', scaleY(lr.equation[0]*scaleX.domain()[1] + lr.equation[1]))
				//Faig un clipping perquè no surti la línia del CANVAS
				//http://www.d3noob.org/2015/07/clipped-paths-in-d3js-aka-clippath.html
				.attr('clip-path', 'url(#rect-clip)') 
				.style('fill', 'none')
				.style('stroke-dasharray', ('5, 3'))
				.style('stroke', 'red')
				.style('stroke-opacity', 0.9)
				.style('stroke-width', 0.8)
				;
		};

		//Afegir els eixos
		svg.append("g")
			.attr("class", "y_axis")
			.call(yAxis);
			
		svg.append("g")
			.attr("class", "x_axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
			
		//Titol
		svg.append('g')
	        .append('text')
	        .attr("text-anchor", "start")  
			.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))+10) +","+10+")")
	        .style("font-size", "11px")
	        .style("font-family", "open sans")
	        .text(_.capitalize(sefa_config.translates.get_translate(s_sp)));
	}); //Fi de bucle per a totes els espècies dins d'un parc
	
}//Fi de graph_by_population_trend_by_park()

GRAPH_SEFA.prototype.graph_by_population_trend = function(){
	
	var d = manage_sd.get_population_trend();

	//defaults
	var defaults={
		factor_escala_1 : 1.25,
		factor_escala_2 : 2,
	    //Margins
		margin : {top: 10, right: 20, bottom: 20, left: 50},
		//Absolute
		abs_height : 200,
		abs_width : 300,
		width : 0,
		height : 0,
		scaleX : {}
	}; //Fi de Defaults
	
	defaults.width = defaults.abs_width - defaults.margin.left - defaults.margin.right;
	defaults.height = defaults.abs_height - defaults.margin.top - defaults.margin.bottom;
	defaults.scaleX = d3.scale.linear()
	          			.range([0, defaults.width])
	          			.domain([_.minBy(d,function(w){return w.DATE;}).DATE,_.maxBy(d,function(w){return w.DATE;}).DATE])
	          			.nice();
	


	// **********************************************
	//	Bucle per parc
	// **********************************************
	_.forEach(_.uniqBy(d, function(w){return w.PARK;}), function(q){

		var s_div = 'sefa_graphs_population_trend_'+q.PARK;
		if(!$('#'+s_div+'_').length){return;}

		//Omplo el DIV per parc
		$('#'+s_div+'_').append('<div><div class="panel panel-default"><div class="panel-heading">'+sefa_config.translates.get_translate(q.PARK)+'</div><div id="'+s_div+'" class="panel-body"></div></div></div>');

		graphs.graph_by_population_trend_by_park(q.PARK, _.filter(d, function(w){return _.isEqual(w.PARK, q.PARK);}), defaults);
	});
}




GRAPH_SEFA.prototype.graph_by_anual_surveyed_localities = function(){

	var div = 'sefa_graphs_anual_surveyed_localities';
	if(!$('#'+div).length){return;}
	var id_div = div;
	
	var s = manage_sd.get_anual_surveyed_localities();
	
	var factor_escala = 1.25;
	
	// **********************************
	// Defaults
	// **********************************
    //Margins
	var margin = {top: 20, right: 20, bottom: 20, left: 25};
	//Absolute
	var abs_height = 200;
	var abs_width = 400;
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain(s.rx)
	          .nice();

	//Escala Y: linear
	var scaleY = d3.scale.linear()
		.range([height, 0])
		.domain([s.ry[0],s.ry[1]*factor_escala])
		.nice()
		;

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            //.outerTickSize(0)
	            .ticks(4)
	            .tickFormat(d3.format('d'))
			            ;
	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id',id_div)
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var line = d3.svg.line()
	    .x(function(u){return scaleX(u.year);})
	    .y(function(u){return scaleY(u.count);})
    ;
	
	svg.append('path')
		.attr('d', line(s.d))
		.style('fill', 'none')
		.style('stroke', '#a50f15')
		.style('stroke-width', 1)
		.style('stroke-opacity', 0.8)
		;

	//Vèrtexs de les línies
	_.forEach(s.d, function(w){
		svg.append('circle')
			.attr('cx', scaleX(w.year))
			.attr('cy', scaleY(w.count))
			.attr('r', 3)
			.style('fill', '#67000d')
			.style('fill-opacity',1)
			.append('svg:title')
			.text(sefa_config.translates.get_translate('n_total')+w.count+' ('+w.year+')')
			;
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		
	//Titol
	svg.append('g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+ ((scaleY(scaleY.domain()[1]))-(margin.top/2))   +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('surveyed_localities')));
};