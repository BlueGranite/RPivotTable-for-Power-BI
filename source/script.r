source('./r_files/flatten_HTML.r')

############### Library Declarations ###############
libraryRequireInstall("plotly");
libraryRequireInstall("jsonlite");
libraryRequireInstall("rpivotTable");
####################################################

################### Actual code ####################
initial_renderer <- "Table";
initial_agg <- "Count";
initial_vals <- "";
initial_row <- colnames(Values)[1];
initial_column <- colnames(Values)[2];
initial_row_order <- "key_a_to_z";
initial_col_order <- "key_a_to_z";

if (exists("internal_settings_settings"))
{
	user_persisted_settings <- fromJSON(internal_settings_settings);
	
	initial_renderer <- user_persisted_settings$rendererName;
	initial_agg <- user_persisted_settings$aggregatorName;
	initial_vals <- user_persisted_settings$vals;
	initial_row <- user_persisted_settings$rows;
	initial_column <- user_persisted_settings$cols;
	initial_row_order <- user_persisted_settings$rowOrder;
	initial_col_order <- user_persisted_settings$colOrder;
}

p <- rpivotTable(Values, 
		rows = initial_row, 
		cols = initial_column,
        vals = initial_vals,
		aggregatorName  = initial_agg,
		rendererName = initial_renderer,
		rowOrder = initial_row_order,
		colOrder = initial_col_order,
		width = "100%", 
		height = "95vh"
	);

p$sizingPolicy$browser$padding = 0

####################################################

############# Create and save widget ###############
internalSaveWidget(p, 'out.html');
####################################################
