function TRANSLATES()
{
	this.language_list = ['ca','es','en'];
	this.lang_select;
	this.translate = [];
};//Fi de translate

TRANSLATES.prototype.set_lang = function(lang) 
{
    this.lang_select = lang;
};

TRANSLATES.prototype.get_translate = function(value)
{
	var langselect = this.lang_select;
	var t = _.find(this.translate, function(x){return x.value == value});
	if(_.isUndefined(t))
	{
		//No la trobat, retorno value
		return value;
	}
	else
	{
		var tt = _.find(t.chains, function(x){
			return x.lang == langselect});
		if(_.isUndefined(tt))
		{
			//No he trobat la cadena amb la llengua seleccionada
			return value;
		}
		else
		{
			//return utf8.encode(tt.text);
			return tt.text;
		} 
	}
};

function TRANSLATE(value)
{
	this.value = value;
	this.chains = [];
};

TRANSLATE.prototype.set_chain = function(lang,text)
{
	this.chains.push(new CHAIN(lang,text));
};

function CHAIN(lang, text)
{
	this.lang = lang;
	this.text = text;
};

TRANSLATES.prototype.set_translates = function(value, lang, text)
{
	var t = _.find(this.translate, function(x){return x.value == value});
	if(_.isUndefined(t))
	{
		t = new TRANSLATE(value);
		t.set_chain(lang,text);
		this.translate.push(t);
	}
	else
	{
		t.set_chain(lang,text);
	}
};

TRANSLATES.prototype.load_translates = function()
{
	//this.set_translates(value,lang,text);
	this.set_translates('n_total','ca','n='); //--> N=, total dels piegraphs
	this.set_translates('locations','ca','localitats');
	
	//Capçaleres de la taula amb els resultats al mapa
	this.set_translates('park','ca','parc');
	this.set_translates('species','ca','espècie');
	this.set_translates('method','ca','mètode');
	this.set_translates('period','ca','període');
	this.set_translates('date_start','ca','inici');
	this.set_translates('date_end','ca','fi');
	this.set_translates('n_census','ca','censos');
	this.set_translates('core','ca','nucli');
	
	//Gràfics
	this.set_translates('others','ca','altres');
	this.set_translates('methods','ca','Metodologies');
	this.set_translates('species_by_protectedarea','ca','espècies d\'interès (amb localitats) per parc');
	this.set_translates('locations_by_protectedarea','ca','Localitats per parc');
	this.set_translates('species_protecionlevel','ca','Espècies per categoria d\'interès');
	this.set_translates('species_protectioncatalog','ca','Espècies per categories CFAC');
	this.set_translates('periodicity','ca','periodicitat');
	this.set_translates('number','ca','número');
	this.set_translates('graph_species_tracked_by_protectionlevel_title','ca','Espècies amb seguiment per categoria d\'interès');
	this.set_translates('graph_species_tracked_by_protectioncatalog_title','ca','Espècies amb seguiment per categoria del CFAC');
	this.set_translates('date','ca','data');
//	this.set_translates('graph_species_tracked_by_tracked_dates_acumulated_title','ca','Data dels censos i període de seguiment');
	this.set_translates('graph_species_tracked_by_tracked_dates_acumulated_title','ca','Període de seguiment');
	this.set_translates('locations','ca','localitats');
	this.set_translates('locations_with_census','ca','amb seguiment');
	this.set_translates('graph_groupby_species_by_num_locations_title','ca','Localitats amb seguiment sobre el total per espècie');
	this.set_translates('locations_number','ca','número de localitats');
	this.set_translates('graph_groupby_species_by_num_census_title','ca','Número de censos per espècie');
	this.set_translates('graph_locations_species_protectedarea','ca','Localitats per espècie i parc');

	//group by method
	this.set_translates('Metodologia 2 - Recompte total','ca','Mètode 2');
	this.set_translates('Metodologia 1 - Presència / absència','ca','Mètode 1');
	this.set_translates('Metodologia 3 - Estimació amb parcel·les','ca','Mètode 3');
	this.set_translates('0','ca','Sense seguiment');
	
	
	//groupby_locations_by_protectedarea
	this.set_translates('MCO','ca','Montnegre i el Corredor');
	this.set_translates('SLI','ca','Serralada Litoral');
	this.set_translates('MSY','ca','Montseny');
	this.set_translates('SMA','ca','Serralada de Marina');
	this.set_translates('GUI','ca','Guilleries-Savassona');
	this.set_translates('GRF','ca','Garraf');
	this.set_translates('SLL','ca','Sant Llorenç del Munt i l\'Obac');
	
	//groupby_species_by_protectioncatalog
	this.set_translates('E','ca','En perill');
	this.set_translates('V','ca','Vulnerable');
	this.set_translates('nopresent','ca','No present');

	//Tables
	this.set_translates('sefa_table_species_by_protectioncatalog_list_heading','ca','Llistat d\'espècies per categories CFAC');
	this.set_translates('sefa_table_species_by_protectionlevel_list_heading','ca','llistat d\'espècies per categories de priorització');
	this.set_translates('sefa_table_species_by_protectionlevel_protectioncatalog_list_heading','ca','Llistat d\'espècies amb localitats introduïdes a la base de dades del SEFA');

	this.set_translates('protecionlevel','ca','categoria de priorització');
	this.set_translates('protecioncatalog','ca','Categoria CFAC');

	//Impactes i amenaces

	this.set_translates('threats','ca','Síntesi d\'amenaces');
	this.set_translates('impacts','ca','Síntesi d\'impactes');
	this.set_translates('year','ca','any');
	this.set_translates('totals','ca','totals');
	this.set_translates('total_for_year','ca','totals per any');

	this.set_translates('impacts_evolution','ca','Evolució temporal dels impactes');
	this.set_translates('threats_evolution','ca','Evolució temporal de les amenaces');
	

	
	this.set_translates('surveyed_localities','ca','localitats censades');


	this.set_translates('1. Canvi climàtic','ca','Canvi climàtic');
	this.set_translates('2. Reducció de l’hàbitat','ca','Reducció hàbitat');
	this.set_translates('3. Incendis forestals','ca','Incendis forestals');
	this.set_translates('4. Alteració del medi hídric','ca','Alteració medi hídric');
	this.set_translates('5. Pràctiques forestals inadequades','ca','Pràctiques forestals');
	this.set_translates('6. Pol·lució','ca','Pol·lució');
	this.set_translates('7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes','ca','Abandonament agroramader');
	this.set_translates('8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes','ca','Intensificació agroramadera');
	this.set_translates('9. Altres alteracions de l’hàbitat','ca','Altres alteracions hàbitat');
	this.set_translates('10. Competència','ca','Competència');
	this.set_translates('11. Predació','ca','Predació');
	this.set_translates('12. Parasitisme','ca','Parasitisme');
	this.set_translates('13. Malalties','ca','Malalties');
	this.set_translates('14. Hibridació','ca','Hibridació');
	this.set_translates('15. Població o superfície recoberta petita','ca','Població o superfície recoberta petita');
	this.set_translates('16. Aïllament biogeogràfic','ca','Aïllament biogeogràfic');
	this.set_translates('17. Freqüentació','ca','Freqüentació');
	this.set_translates('18. Altres','ca','Altres');

	this.set_translates('Aegpod','ca','Aegopodium podagraria');
	this.set_translates('Arclap','ca','Arctium lappa');
	this.set_translates('Arecav','ca','Arenaria fontqueri ssp. cavanillesiana');
	this.set_translates('Arisim','ca','Arisarum simorrhinum var. simorrhinum');
	this.set_translates('Asplae','ca','Asperula laevigata');
	this.set_translates('Aspsep','ca','Asplenium septentrionale');
	this.set_translates('Botmat','ca','Botrychium matricariifolium');
	this.set_translates('Brarob','ca','Brassica oleracea ssp. robertiana');
	this.set_translates('Caramp','ca','Cardamine amporitana');
	this.set_translates('Cardep','ca','Carex depauperata');
	this.set_translates('Carvir','ca','Carex flava ssp. viridula');
	this.set_translates('Cargri','ca','Carex grioletii');
	this.set_translates('Carpra','ca','Carex praecox');
	this.set_translates('Carcer','ca','Carpesium cernuum');
	this.set_translates('Cenhan','ca','Centaurea paniculata spp. hanrii');
	this.set_translates('Chahum','ca','Chamaerops humilis');
	this.set_translates('Chetin','ca','Cheilanthes tinaei');
	this.set_translates('Cicfil','ca','Cicendia filiformis');
	this.set_translates('Ciscri','ca','Cistus crispus');
	this.set_translates('Cislad','ca','Cistus ladanifer');
	this.set_translates('Coevir','ca','Coeloglossum viride');
	this.set_translates('Consic','ca','Convolvulus siculus');
	this.set_translates('Cosvel','ca','Cosentinia vellea');
	this.set_translates('Delbol','ca','Delphinium bolosii');
	this.set_translates('Dicalb','ca','Dictamnus albus');
	this.set_translates('Digobs','ca','Digitalis obscura');
	this.set_translates('Dippil','ca','Dipsacus pilosus');
	this.set_translates('Epiaph','ca','Epipogium aphyllum');
	this.set_translates('Equhye','ca','Equisetum hyemale');
	this.set_translates('Ericin','ca','Erica cinerea');
	this.set_translates('Eupdul','ca','Euphorbia dulcis ssp. dulcis');
	this.set_translates('Galsca','ca','Galium scabrum');
	this.set_translates('Gymdry','ca','Gymnocarpium dryopteris');
	this.set_translates('Halhal','ca','Halimium halimifolium');
	this.set_translates('Hyppul','ca','Hypericum pulchrum');
	this.set_translates('Ileaqu','ca','Ilex aquifolium');
	this.set_translates('Isodur','ca','Isoetes durieui');
	this.set_translates('Latsqu','ca','Lathraea squamaria');
	this.set_translates('Latcir','ca','Lathyrus cirrhosus');
	this.set_translates('Lavolb','ca','Lavatera olbia');
	this.set_translates('Lilmar','ca','Lilium martagon');
	this.set_translates('Limgir','ca','Limonium girardianum');
	this.set_translates('Lonnig','ca','Lonicera nigra');
	this.set_translates('Lycsel','ca','Lycopodium selago');
	this.set_translates('Melcat','ca','Melampyrum catalaunicum');
	this.set_translates('Melnut','ca','Melica nutans');
	this.set_translates('Nardub','ca','Narcissus dubius');
	this.set_translates('Orcmaj','ca','Orchis majalis');
	this.set_translates('Oroict','ca','Orobanche elatior ssp. icterica');
	this.set_translates('Osmreg','ca','Osmunda regalis');
	this.set_translates('Peuoff','ca','Peucedanum officinale');
	this.set_translates('Phepur','ca','Phelipanche purpurea');
	this.set_translates('Pinvul','ca','Pinguicula vulgaris');
	this.set_translates('Polver','ca','Polygonatum verticillatum');
	this.set_translates('Polbis','ca','Polygonum bistorta');
	this.set_translates('Potnat','ca','Potamogeton natans');
	this.set_translates('Potmon','ca','Potentilla montana');
	this.set_translates('Potpyr','ca','Potentilla pyrenaica');
	this.set_translates('Prulus','ca','Prunus lusitanica');
	this.set_translates('Samrac','ca','Sambucus racemosa');
	this.set_translates('Saxcat','ca','Saxifraga callosa ssp. catalaunica');
	this.set_translates('Saxgen','ca','Saxifraga genesiana');
	this.set_translates('Saxpan','ca','Saxifraga paniculata');
	this.set_translates('Saxvay','ca','Saxifraga vayredana');
	this.set_translates('Selden','ca','Selaginella denticulata');
	this.set_translates('Servom','ca','Serapias vomeracea');
	this.set_translates('Silmut','ca','Silene mutabilis');
	this.set_translates('Silvir','ca','Silene viridiflora');
	this.set_translates('Spipar','ca','Spiraea crenata ssp. parvifolia');
	this.set_translates('Spiaes','ca','Spiranthes aestivalis');
	this.set_translates('Stapal','ca','Stachys palustris');
	this.set_translates('Stramp','ca','Streptopus amplexifolius');
	this.set_translates('Sucbal','ca','Succowia balearica');
	this.set_translates('Tamafr','ca','Tamarix africana');
	this.set_translates('Taxbac','ca','Taxus bacatta');
	this.set_translates('Viobub','ca','Viola bubanii');
	this.set_translates('Viocat','ca','Viola suavis ssp. catalonica');
	this.set_translates('Vitagn','ca','Vitex agnus-castus');
	this.set_translates('Vitsyl','ca','Vitis vinifera ssp. sylvestris');



}; //Fi de load_translates






