source('./r_files/flatten_HTML.r')

############### Library Declarations ###############
libraryRequireInstall("plotly");
libraryRequireInstall("rpivotTable");
####################################################

################### Actual code ####################
p = rpivotTable(Values, rendererName = "Table", width="100%", height="75vh");
####################################################

############# Create and save widget ###############
internalSaveWidget(p, 'out.html');
####################################################
