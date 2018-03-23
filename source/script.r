source('./r_files/flatten_HTML.r')

############### Library Declarations ###############
libraryRequireInstall("plotly");
libraryRequireInstall("rpivotTable");
####################################################

################### Actual code ####################
if (!exists("settings_rpivottable_params_method"))
{
    settings_rpivottable_params_method = "Table";
}

initial_row <- colnames(Values)[1];
initial_column <- colnames(Values)[2];

p <- rpivotTable(Values, 
		rows = initial_row, 
		cols = initial_column, 
		rendererName = settings_rpivottable_params_method,
		width = "100%", 
		height = "75vh"
	);
####################################################

############# Create and save widget ###############
internalSaveWidget(p, 'out.html');
####################################################
