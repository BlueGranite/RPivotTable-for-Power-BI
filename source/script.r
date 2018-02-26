source('./r_files/flatten_HTML.r')

############### Library Declarations ###############
libraryRequireInstall("plotly");
libraryRequireInstall("rpivotTable");
####################################################

################### Actual code ####################
p = rpivotTable(Values);
####################################################

############# Create and save widget ###############
internalSaveWidget(p, 'out.html');
####################################################
