
//Configuració i tractament de les dades
var sefa_config = new SEFA_CONFIG();
var fishnet = new FISHNET();
var manage_sd = new MANAGE_SD();
var graphs = new GRAPH_SEFA();
var tables = new SEFA_TABLES();

	
function main_()
{
	//create_page();

	mapa_sefa_localitats_quadricula();

	graphs.graph_by_method();
	graphs.graph_by_period();

	graphs.graph_locations_by_protectedarea();	
	graphs.graph_species_by_protectionlevel();
	graphs.graph_species_by_protectioncatalog();
	graphs.graph_species_by_protectedarea();
	
	tables.table_species_by_protectionlevel_list();
	tables.table_species_by_protectioncatalog_list();
	tables.table_species_by_protectionlevel_protectioncatalog_list();

	graphs.graph_species_tracked_by_protectionlevel();
	graphs.graph_species_tracked_by_protectioncatalog();
	graphs.graph_species_tracked_by_tracked_dates_acumulated();

	graphs.graph_groupby_species_by_num_locations();
	graphs.graph_groupby_species_by_num_locations_by_park();

	graphs.graph_groupby_species_by_num_census();
	graphs.graph_protectedarea_species_locations();

	graphs.graph_by_threats();
	graphs.graph_by_impacts();

	graphs.graph_by_impacts_histo();
	graphs.graph_by_threats_histo();

	graphs.graph_by_population_trend();
	
	graphs.graph_by_anual_surveyed_localities();
	
} // Fi de main_()
