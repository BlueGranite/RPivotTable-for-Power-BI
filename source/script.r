source('./r_files/flatten_HTML.r')

############### Library Declarations ###############
libraryRequireInstall("plotly");
libraryRequireInstall("rpivotTable");
####################################################

################### Actual code ####################
#p = rpivotTable(Values, rendererName = "Table", width="100%", height="75vh");
initial_row <- colnames(Values)[1];
initial_column <- colnames(Values)[2];

p = rpivotTable(Values, rows=initial_row, cols=initial_column, rendererName = "Table", width="100%", height="75vh");
####################################################

############# Create and save widget ###############
internalSaveWidget(p, 'out.html');
####################################################
