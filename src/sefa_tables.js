function SEFA_TABLES() {
}; //Fi de sefa_tables()


SEFA_TABLES.prototype.table_species_by_protectionlevel_list = function() {
	

	//Actualitzo el títol
	$('div#sefa_table_species_by_protectionlevel_list_heading').html('<h1 class="panel-title">'+_.capitalize(sefa_config.translates.get_translate('sefa_table_species_by_protectionlevel_list_heading'))+'</h1>');


	var list = manage_sd.get_groupby_species_by_protectionlevel_list();
	
	//groupBy
	_.forEach(_.sortBy(_.toPairs(_.groupBy(list, 'protection')), function(o){return o[1].length}), function(c){
			$newtable = $('<table/>')
					    .addClass('table')
					    .addClass('table-condensed');
		
			$newtable.append('<thead>'+
				'<tr>'+
					'<th>'+c[0]+'</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>'
			);
			
			_.forEach(c[1], function(q){
				
				$newtable.append('<tr>'+
						'<td class=\'specie\'>'+q.sp+'</td>'+
						'</tr>'
					);
				});

		$newtable.append('</tbody>');
	
		//Afegeixo la taula al DIV
		$newdivtable = $('<div/>')
						.addClass('col-md-3');
							
		$newdivtable.append($newtable);
		$('#sefa_table_species_by_protectionlevel_list').append($newdivtable);
		});
};

SEFA_TABLES.prototype.table_species_by_protectioncatalog_list = function() {
	
	//Actualitzo el títol
	$('div#sefa_table_species_by_protectioncatalog_list_heading').html('<h1 class="panel-title">'+sefa_config.translates.get_translate('sefa_table_species_by_protectioncatalog_list_heading')+'</h1>');
	
	var list = manage_sd.get_groupby_species_by_protectioncatalog_list();
	
	//groupBy
	_.forEach(_.sortBy(_.toPairs(_.groupBy(list, 'protection')), function(o){return o[1].length}), function(c){

			$newtable = $('<table/>')
					    .addClass('table')
					    .addClass('table-condensed');
		
			$newtable.append('<thead>'+
				'<tr>'+
					'<th>'+c[0]+'</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>'
			);
			
			_.forEach(c[1], function(q){
				
				$newtable.append('<tr>'+
						'<td class=\'specie\'>'+q.sp+'</td>'+
						'</tr>'
					);
				});

		$newtable.append('</tbody>');
	
		//Afegeixo la taula al DIV
		$newdivtable = $('<div/>')
						.addClass('col-md-3');
							
		$newdivtable.append($newtable);
		$('#sefa_table_species_by_protectioncatalog_list').append($newdivtable);
		});
};

SEFA_TABLES.prototype.table_species_by_protectionlevel_protectioncatalog_list = function() {
	
	//Actualitzo el títol
	$('div#sefa_table_species_by_protectionlevel_protectioncatalog_list_heading').html('<h1 class="panel-title">'+sefa_config.translates.get_translate('sefa_table_species_by_protectionlevel_protectioncatalog_list_heading')+'</h1>');
	
	var list = manage_sd.get_groupby_species_by_protectionlevel_protectioncatalog_list();
	
	$newtable = $('<table/>')
			    .addClass('table')
			    .addClass('table-condensed')
			    .addClass('table-striped');

	$newtable.append('<thead>'+
		'<tr>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('espècie'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('protecionlevel'))+'</th>'+
			'<th>'+sefa_config.translates.get_translate('protecioncatalog')+'</th>'+
		'</tr>'+
	'</thead>'+
	'<tbody>'
	);

	_.forEach(list, function(q){
		$newtable.append('<tr ' + (q.protectionlevel=='EICP1'?'class=danger': (q.protectionlevel=='EICP2'?'class=warning':  (q.protectionlevel=='EIC'?'class=info':''))  ) +'>'+
				'<td class=\'specie\'>'+q.sp+'</td>'+
				'<td class=\'specie\'>'+q.protectionlevel+'</td>'+
				'<td class=\'specie\'>'+q.protectioncatalog+'</td>'+
				'</tr>'
			);
		});

	$newtable.append('</tbody>');
	
	//Afegeixo la taula al DIV
	$newdivtable = $('<div/>')
					.addClass('col-md-6');
						
	$newdivtable.append($newtable);
	$('#sefa_table_species_by_protectionlevel_protectioncatalog_list').append($newdivtable);
};
