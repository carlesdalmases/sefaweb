function create_page()
{
	$('#body').append(
		"<div class='container-fluid'>"+

			"<script>function info_toggle(div){$(div).parent().next('div').toggle();}</script>"+
			"<script>function info_button_blur(div){$(div).blur();}</script>"+
			"<style>.info_text{border-color: rgb(221, 221, 221);border-width: 0.5px;border-style: solid;}</style>"+
			"<style>.btn-default{font-size: x-small}</style>"+

			"<div class='row'>"+
				"<div class='col-md-1'>"+
					"<button type='button' class='btn btn-default' onmouseover='info_toggle(this)' onmouseout='info_toggle(this)' onclick='info_button_blur(this)'>"+
					  "Ajuda"+
					"</button>"+
				"</div>"+
				"<div class='info_text' class='col-md-11' style='display:none'>XXX</div>"+
			"</div>"+			


			"<!-- MAPS -->"+
			"<div id='mapa_sefa_localitats_quadricula' class='panel panel-default'>"+
				"<div id='mapa_sefa_localitats_quadricula_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div id='mslq' class='map'></div>"+
				"</div>"+
			"</div>"+

			"<div class='row'>"+
				"<div class='col-md-1'>"+
					"<button type='button' class='btn btn-default' aria-label='Left Align' onmouseover='info_toggle(this)' onmouseout='info_toggle(this)' onclick='info_button_blur(this)'>"+
					  "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span>"+
					"</button>"+
				"</div>"+
				"<div class='info_text' class='col-md-11' style='display:none'>YYY</div>"+
			"</div>"+			


			
			"<!-- GRAPHS -->"+
			"<div id='sefa_graph' class='panel panel-default'>"+
				"<div id='sefa_graph_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_graphs_methods'></div>"+
						"<div id='sefa_graphs_protectedarea'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_protecionlevel'></div>"+
						"<div id='sefa_graphs_species_protectioncatalog'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_period'></div>"+
						"<div id='sefa_graphs_species_protectedarea'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_protectionlevel' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_protectioncatalog' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_tracked_dates_acumulated' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_locations' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_locations_by_park' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_census' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_protectedarea_species_locations' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_threats' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_impacts' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_impacts_year_series' class='col-md-12'></div>"+
						"<div id='sefa_graphs_impacts_year_totals' class='col-md-12'></div>"+
						"<div id='sefa_graphs_impacts_year_series_button_totals' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_threats_year_series' class='col-md-12'></div>"+
						"<div id='sefa_graphs_threats_year_totals' class='col-md-12'></div>"+
						"<div id='sefa_graphs_threats_year_series_button_totals' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+


					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_MCO_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_SLL_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_MSY_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_GRF_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_SLI_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_SMA_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_COL_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_OLE_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_MTQ_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_anual_surveyed_localities' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+
			
			"<!-- TABLES -->"+
			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectionlevel_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectionlevel_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+

			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectioncatalog_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectioncatalog_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+


			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectionlevel_protectioncatalog_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectionlevel_protectioncatalog_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+


		"</div>" //container-fluid
	);
}


