/* ****************************************************************************/
//							Objecte SEFA_CONFIG
/* ****************************************************************************/
function SEFA_CONFIG()
{
	this.translates = new TRANSLATES();
	this.translates.set_lang('ca');
	this.translates.load_translates();

	//Fishnet resolution, in meters
	this.fishnet_resolution = 1000
	
	//Maps
	this.map_centerXY = [423850,4617000];
	this.map_zoom_initial = 0;
	this.map_EPSG = 'EPSG:25831';
	this.map_extent = [257904,4484796,535907,4751795];
	this.map_projection = ol.proj.get('EPSG:25831');
	this.map_projection.setExtent(this.get_map_extent());
	this.map_resolutions = [275,100,50,25,10,5,2,1,0.5,];


}; //Fi de SEFA_CONFIG()

/* ****************************************************************************/
//									METHODS
/* ****************************************************************************/

SEFA_CONFIG.prototype.get_map_centerXY = function(){return this.map_centerXY;}
SEFA_CONFIG.prototype.get_map_zoom_initial = function(){return this.map_zoom_initial;}
SEFA_CONFIG.prototype.get_map_epsg = function(){return this.map_EPSG;}
SEFA_CONFIG.prototype.get_map_resolutions = function(){return this.map_resolutions;}
SEFA_CONFIG.prototype.get_map_projection = function(){return this.map_projection;}
SEFA_CONFIG.prototype.get_map_extent = function(){return this.map_extent;}





