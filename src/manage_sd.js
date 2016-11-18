function MANAGE_SD()
{
	//Eliminar NULL, compte! en queda un primer!
	this.sd = _.compact(sd_original);
		
	//Extreure la llista única de coordenades UTM1x1 i
	// crear la malla.
	_.forEach(_.uniqBy(this.sd, function(w){return w.UTMX+','+w.UTMY;}), function(c){
			fishnet.cells.push(new CELL(c.UTMX, c.UTMY));
		});	
};

MANAGE_SD.prototype.get_unique_protected_areas = function(){
	var w = [];
	_.forEach(_.uniqBy(this.sd, function(w){return w.ID_PARC;}), function(q){w.push(q.ID_PARC);});
	
	//Ordeno l'array de codis únics segons l'ordre que vol el David. Si un codi no apareix a la llista
	//de codis ordenats, s'afegeix al final. Si s'afegeix a les dades un parc nou, s'haurà d'actualizar el primer array!
	return _.union(['MTQ','GUI','MSY','SLL','MCO','SLI','SMA','COL','GRF','OLE'],w);
};


MANAGE_SD.prototype.get_locations_by_feature_name = function(feature_name){
	var coord = _.split(feature_name, ',');
	var cx = _.toNumber(coord[0]);
	var cy = _.toNumber(coord[1]);
	
	return _.orderBy(_.filter(this.sd, function(d) {return (d.UTMX == cx && d.UTMY == cy);}), 
					 ['ESPECIE', 'NUCLI_POBLACIONAL'], ['asc', 'asc']);	
};

MANAGE_SD.prototype.get_groupby_method = function(){
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'METODOLOGIA_SEGUIMENT'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('OrRd');
};

MANAGE_SD.prototype.get_groupby_period = function(){
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'PERIODICITAT'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('OrRd');
};

MANAGE_SD.prototype.get_groupby_species_by_protectedarea = function () {
	
	var gd = new GRAPHDATA();
	var p = _.groupBy(this.sd, 'ID_PARC');
	
	_.forEach(_.forOwn(p,function(value,key){
			var k = sefa_config.translates.get_translate(key);
			var v = _.uniqBy(value, 'ESPECIE').length;
			gd.set_graphdata(k,v);
		}));
	return gd.get_graphdata_colorbyvalue('Greens');
};


MANAGE_SD.prototype.get_groupby_locations_by_protectedarea = function () {
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'ID_PARC'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('GnBu');
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel = function () {
	var gd = new GRAPHDATA();
	_.forOwn(_.countBy(this.get_groupby_species_by_protectionlevel_list(), 'protection'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('YlGn');
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel_list = function () {
	
	var sps_protection = [];
	function SP_P(specie, protection)
	{
		this.sp = specie;
		this.protection = protection;
	}
	
	//A partir de la llista única d'espècies (de totes les localitats) buscar la seva categoria de protecció.
	//És necessari perquè hi ha espècies (en localitats) que no estan al diccionari i cal indicar la seva
	//categoria de protecció per defecte --> EIL
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No la trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, 'EIL'));
		}
		else
		{
			sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA));
		}
	});
	
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_species_by_protectioncatalog = function () {
	var gd = new GRAPHDATA();
	_.forOwn(_.countBy(this.get_groupby_species_by_protectioncatalog_list(), 'protection'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbyvalue('YlOrBr');
};

MANAGE_SD.prototype.get_groupby_species_by_protectioncatalog_list = function() {
	
	var sps_protection = [];
	function SP_P(specie, protection)
	{
		this.sp = specie;
		this.protection = protection;
	}
	
	//A partir de la llista única d'espècies (de totes les localitats) buscar la seva categoria al Catàleg.
	//És necessari perquè hi ha espècies (en localitats) que no estan al Catàleg i cal indicar la seva
	//categoria per defecte --> No present
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No l'ha trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate('nopresent')));
		}
		else
		{
			//Es troba al Tesaurus, però pot no tenir categoria al CFAC
			if(t.CFAC == '0'){
				sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate('nopresent')));
			}
			else {
				sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate(t.CFAC)));
			}
		}
	});
	
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel_protectioncatalog_list = function () {
	
	var sps_protection = [];
	function SP_P(specie, protectionlevel, protectioncatalog)
	{
		this.sp = specie;
		this.protectionlevel = protectionlevel;
		this.protectioncatalog = protectioncatalog;
	}
	
	//A partir de la llista única d'espècies (de totes les localitats) buscar les seves categories de protecció.
	//És necessari perquè hi ha espècies (en localitats) que no estan al diccionari i cal indicar la seva
	//categoria de protecció per defecte --> EIL + No present
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No la trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, 'EIL', sefa_config.translates.get_translate('nopresent')));
		}
		else
		{
			if(t.CFAC == '0'){
				sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA, sefa_config.translates.get_translate('nopresent')));
			}
			else {
				sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA, sefa_config.translates.get_translate(t.CFAC)));
			}
		}
	});
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_protectionlevel_from_tesaurus_list = function () {
	
	//A partir del diccionari d'espècies i nivell de protecció, fer un group by per 'CATEGORIA'
	return _.countBy(sd_tesaurus, 'CATEGORIA');
};

MANAGE_SD.prototype.get_groupby_protectionlevel_from_tesaurus = function () {
	var gd = new GRAPHDATA();
	_.forOwn(this.get_groupby_protectionlevel_from_tesaurus_list(), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbycategory_invert('RdPu');
};

MANAGE_SD.prototype.get_groupby_protectioncatalog_from_tesaurus_list = function () {
	
	//A partir del diccionari d'espècies i nivell de protecció del catàleg, fer un group by per 'CFAC'
	return _.countBy(sd_tesaurus, 'CFAC');
};

MANAGE_SD.prototype.get_groupby_protectioncatalog_from_tesaurus = function () {
	var gd = new GRAPHDATA();
	_.forOwn(this.get_groupby_protectioncatalog_from_tesaurus_list(), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbycategory_invert('YlGnBu');
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_acumulated = function () {

	return this.get_groupby_species_by_tracked_dates_acumulated_list();
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_acumulated_list = function () {
	
	//A partir de les dades, per a cada espècie, recollir la data mínima i màxima de seguiment.
	var sps_times = [];
	function SP_T(specie, t0, t1)
	{
		this.sp = specie;
		this.t0 = t0;
		this.t1 = t1;
	}
	
	//Només aquelles localitats amb, com a mínim, un cens
	var x  = _.filter(this.sd, function(o) { return o.N_CENSOS; });

	//Agrupar per espècies i determinar la data mínima i máxima dins de cada grup
	_.forEach(_.groupBy(x, 'ESPECIE'), function(w){
			
			//El nom de l'espècie l'agafo del primer element de l'array
			sps_times.push(new SP_T(w[0].ESPECIE,
									(_.minBy(w, function(t){return moment(t.DATA_CENS_FIRST, 'DD-MM-YYYY').valueOf();})).DATA_CENS_FIRST, 
									(_.maxBy(w, function(t){return moment(t.DATA_CENS_LAST, 'DD-MM-YYYY').valueOf();})).DATA_CENS_LAST
									));
			});
	
	return _.orderBy(sps_times, ['sp'], ['asc']); 
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates = function () {

	return this.get_groupby_species_by_tracked_dates_list();
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_list = function () {
	
	//A partir de les dades, per a cada espècie, recollir les dates de tots els censos.
	//Només aquelles localitats amb, com a mínim, un cens
	return _.filter(this.sd, function(o) { return o.N_CENSOS; });
};

MANAGE_SD.prototype.get_groupby_species_by_num_locations_by_park = function (id_park) {
	return this.get_groupby_species_by_num_locations_list(id_park);
};

MANAGE_SD.prototype.get_groupby_species_by_num_locations = function () {
	return this.get_groupby_species_by_num_locations_list();
};
MANAGE_SD.prototype.get_groupby_species_by_num_locations_list = function (id_park) {
	
	//A partir de les dades, per a cada espècie, comptar el total de localitats i les localitats amb censos
	var sps_locations = [];
	function SP_L(specie, locations_total, locations_census)
	{
		this.sp = specie;
		this.locations_total = locations_total;
		this.locations_census = locations_census;
	}

	if (_.isUndefined(id_park)){r = this.sd;}
	else {r = _.filter(this.sd,function(w){return _.isEqual(w.ID_PARC,id_park)});}

	//Agrupar per espècies i comptar el num. total de localitats i de localitats amb censos.
	_.forEach(_.groupBy(r, 'ESPECIE'), function(w){
				var x = _.countBy(w, function(d){return !d.N_CENSOS?false:true;}).true;
				//El nom de l'espècie l'agafo del primer element de l'array
				sps_locations.push(new SP_L(w[0].ESPECIE,
											w.length,
											_.isUndefined(x)?0:x));
			});
	return _.orderBy(sps_locations, ['sp'], ['asc']);
}; //get_groupby_species_by_num_locations_list

MANAGE_SD.prototype.get_groupby_species_by_num_census = function () {
	return this.get_groupby_species_by_num_census_list();
};
MANAGE_SD.prototype.get_groupby_species_by_num_census_list = function () {
	
	//A partir de les dades, per a cada espècie, comptar el número total de censos
	var sps_census = [];
	function SP_C(specie, census_total)
	{
		this.sp = specie;
		this.census_total = census_total;
	}

	//Agrupar per espècies i comptar el número total de censos
	_.forEach(_.groupBy(this.sd, 'ESPECIE'), function(w){
				var x = _.sumBy(w, 'N_CENSOS');
				//El nom de l'espècie l'agafo del primer element de l'array
				sps_census.push(new SP_C(w[0].ESPECIE,_.sumBy(w, 'N_CENSOS')));
			});

	return _.orderBy(sps_census, ['sp'], ['asc']);
}; //get_groupby_species_by_num_locations_list

MANAGE_SD.prototype.get_protectedarea_species_locations = function (){
	return this.get_protectedarea_species_locations_list();
};

MANAGE_SD.prototype.get_protectedarea_species_locations_list = function (){
	function ALL_LOCATIONS (protectedarea, p_locations_total, p_locations_accumulated, specie, s_locations_total, s_locations_accumulated)
	{
		this.protectedarea = protectedarea;
		this.p_locations_total = p_locations_total;
		this.p_locations_accumulated = p_locations_accumulated;
		this.specie = specie;
		this.s_locations_total = s_locations_total;
		this.s_locations_accumulated = s_locations_accumulated;
	}
	
	function PSL_SPECIE (specie, locations_total, locations_accumulated)
	{	
		this.specie = specie;
		this.locations_total = locations_total;
		this.locations_accumulated = locations_accumulated;
	}

	function PSL (protectedarea, locations_total, locations_accumulated)
	{
		this.protectedarea = protectedarea;
		this.locations_total = locations_total;
		this.locations_accumulated = locations_accumulated;
		this.species = [];
	}
	
	var tpsl = {psl:[], pasl:[]};
	
	//Unique Species List
	tpsl.species_list = _.orderBy(_.uniqBy(this.sd, 'ESPECIE'), ['ESPECIE'],['asc']);
	
	_.forOwn(_.groupBy(this.sd, 'ID_PARC'),  function(value,key){
			
			//Total locations on ProtectedArea
			var i = tpsl.psl.push(new PSL(key,value.length,0));
			
			//Total locations by species on ProtectedArea
			_.forOwn(_.groupBy(value, 'ESPECIE'), function(value,key){
					tpsl.psl[i-1].species.push(new PSL_SPECIE(key, value.length,0));
			});
		});
	
	//Order By locations_total
	tpsl.psl = _.orderBy(tpsl.psl,['locations_total'],['desc']);
	
	//Order by locations_total on ProtectedArea
	_.forEach(tpsl.psl, function(d){
			d.species = _.orderBy(d.species,['locations_total','specie'],['desc','asc']);
		});
	
	//Accumulated calculate
	_.forEach(tpsl.psl, function(d,i){
			if(i){
				d.locations_accumulated = tpsl.psl[i-1].locations_accumulated + tpsl.psl[i-1].locations_total;
			};
			_.forEach(d.species, function(w,j){
				if(!j){
					w.locations_accumulated = d.locations_accumulated;
				}
				else{
					w.locations_accumulated = d.species[j-1].locations_accumulated + d.species[j-1].locations_total;
				}
			});
		});	
	
	//Flatten Global array
	_.forEach(tpsl.psl, function(d){
			_.forEach(d.species, function(w){
				tpsl.pasl.push(new ALL_LOCATIONS (d.protectedarea, d.locations_total, d.locations_accumulated, w.specie, w.locations_total, w.locations_accumulated));
				});
		});
	
	return tpsl;
};

//THREATS
MANAGE_SD.prototype.get_groupby_threats = function(){
	
	var gd = new GRAPHDATA();
	
	//Selecciono les amenaces, agrupo per paràmetre i calculo el total de VALOR (per cada paràmetre)
	_.forOwn(_.groupBy(_.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Amenaces');}), 'PARAMETRE'),function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key), _.sumBy(value, function(o) {return o.VALOR;}));
					  });

	return gd.get_graphdata_colorbyvalue('BuPu');
};

//IMPACTS
MANAGE_SD.prototype.get_groupby_impacts = function(){
	
	var gd = new GRAPHDATA();
	
	//Selecciono els impactes, agrupo per paràmetre i calculo el total de VALOR (per cada paràmetre)
	_.forOwn(_.groupBy(_.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Impactes');}), 'PARAMETRE'),function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key), _.sumBy(value, function(o) {return o.VALOR;}));
					  });

	return gd.get_graphdata_colorbyvalue('YlGn');
};

MANAGE_SD.prototype.get_impacts_peryear = function(){

	function DY (date,val)
	{
		this.date = date;
		this.val = val;
	};
		
	var g = {rx:[], ry:[], d:[], d_peryear:[], ry_d:[]};
	
	//Selecciono els impactes
	var p = _.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Impactes');});

	//Calculo els rangs de l'eix x,y
	//Mínim x
	g.rx.push(_.minBy(p, function(o){return o.DATA;}).DATA);
	
	//Màxim x
	g.rx.push(_.maxBy(p, function(o){return o.DATA;}).DATA);
	
	//Mínim y
	g.ry.push(_.minBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Màxim y
	g.ry.push(_.maxBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Agrupo per paràmetre
	g.d = _.groupBy(p, 'PARAMETRE');

	//Calculo el total d'impactes per any
	_.forOwn(_.groupBy(p, 'DATA'),function(value, key) {
  						g.d_peryear.push(new DY( _.toInteger(key), _.sumBy(value, function(o) {return o.VALOR;})));
					  });
	//Calculo el mínim/màxim de la Y agrupada per anys
	g.ry_d.push(_.minBy(g.d_peryear, function(o){return o.val;}).val);
	g.ry_d.push(_.maxBy(g.d_peryear, function(o){return o.val;}).val);

	return g;
};

MANAGE_SD.prototype.get_threats_peryear = function(){

	function DY (date,val)
	{
		this.date = date;
		this.val = val;
	};
		
	var g = {rx:[], ry:[], d:[], d_peryear:[], ry_d:[]};
	
	//Selecciono els impactes
	var p = _.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Amenaces');});

	//Calculo els rangs de l'eix x,y
	//Mínim x
	g.rx.push(_.minBy(p, function(o){return o.DATA;}).DATA);
	
	//Màxim x
	g.rx.push(_.maxBy(p, function(o){return o.DATA;}).DATA);
	
	//Mínim y
	g.ry.push(_.minBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Màxim y
	g.ry.push(_.maxBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Agrupo per paràmetre
	g.d = _.groupBy(p, 'PARAMETRE');

	//Calculo el total d'impactes per any
	_.forOwn(_.groupBy(p, 'DATA'),function(value, key) {
  						g.d_peryear.push(new DY( _.toInteger(key), _.sumBy(value, function(o) {return o.VALOR;})));
					  });
	//Calculo el mínim/màxim de la Y agrupada per anys
	g.ry_d.push(_.minBy(g.d_peryear, function(o){return o.val;}).val);
	g.ry_d.push(_.maxBy(g.d_peryear, function(o){return o.val;}).val);

	return g;
};

MANAGE_SD.prototype.get_population_trend = function(){

	var sd = [];
	function SD (park,sp,date,val)
	{
		this.PARK = park;
		this.SP = sp;
		this.DATE = date;
		this.VAL = val;
	};

	//Agrupar per Parc
	_.forOwn(_.groupBy(sd_tendenciapobl, function(w){return _.split(w.IDMOSTREIG,'_')[0]}), function(value,key){
			//Parc
			var p=key;
			//Agrupar per espècie
			_.forOwn(_.groupBy(value, function(w){return _.split(w.IDMOSTREIG,'_')[1]}),function(value,key){
				var sp = key;
				//Total anual
				_.forOwn(_.groupBy(value, function(w){return moment(_.split(w.IDMOSTREIG,'_')[3]).year();}), function(value,key){
					
					sd.push(new SD(p,
					   			   sp,
					   			   _.toInteger(key),
					   			   _.sumBy(value,function(w){return w.N;})));
				});
				
				
			});
		
	});
	return sd;
};

MANAGE_SD.prototype.get_population_trend_by_park = function(id_park){
	
	return _.filter(this.get_population_trend(), function(w){return _.isEqual(w.PARK, id_park)});
};

MANAGE_SD.prototype.get_anual_surveyed_localities = function(){
	
	var s  = {d:[], rx:[], ry:[]};
	function S(year,count){
		this.year = year;
		this.count = count;
	};
	
	_.forOwn(_.groupBy(sd_localitatscensadesany,function(w){return moment(w.DATE,'DD-MM-YYYY').year()}), function(value,key){
			s.d.push(new S(_.toInteger(key),value.length));
		});
	
	s.d = _.orderBy(s.d,'year');
	s.rx = [_.minBy(s.d,function(w){return w.year}).year,_.maxBy(s.d,function(w){return w.year}).year];
	s.ry = [_.minBy(s.d,function(w){return w.count}).count,_.maxBy(s.d,function(w){return w.count}).count];
	
	return s;
};