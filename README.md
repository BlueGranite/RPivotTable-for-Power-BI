# R Pivot Table for Power BI
An interactive R HTML *Pivot Table* for Microsoft Power BI from [BlueGranite](https://www.blue-granite.com).

![](https://github.com/BlueGranite/RPivotTable-for-Power-BI/raw/master/images/RPivotTableSample.gif)  

### PREVIEW
R Pivot Table is in early preview. It is in the process of being submitted to Microsoft AppSource. For limited use and testing, you can download **RPivotTable-1.0.2.1.pbiviz** for non-production environments from the [*packaged-versions*](https://github.com/BlueGranite/RPivotTable-for-Power-BI/tree/master/packaged-versions) folder in this repository. There is no support currently offered for this visual while in preview, but please log any problems in the Issues section of this repository. 

### Using R Pivot Table by BlueGranite  
R Pivot Table for Power BI is an interactive R HTML visual that relies on R's *rpivotTable* package. This visual is available for use in both Power BI Desktop and Service. As an R visual, it will not render in Power BI Report Server or the Mobile app. If using this visual in Power BI Desktop, be sure to install both the *htmlwidgets* and *rpivotTable* packages in your local R environment.

1) Add an instance of the R Pivot Table visual to the report canvas.  
2) Add data to *Values*. The first value in the list will default to Rows. The second (if available) will default to columns. Additional fields will be available for use as desired.  
3) Click and drag available fields to the dark "Row" and "Column" panes to dynamically build a pivot table.  
4) Select options to change the appearance of the pivot table.  


### Format options
 
**Font Size** - set the font size ranging from 10 to 20 (default 12)  

### Limitations
There are several limitations to this pivot table that make it a good *exploratory* visual but not a good *explanatory* visual:
1) Although R HTML visuals are interactive, you cannot select and filter other visuals by clicking inside the R visual.
2) Pivot table will not save a user-selected state. You will always start with the defaults.
3) There is no "freeze header" capability like you have in Excel.
4) The Custom Visuals API does not currently expose format string for R visuals. The number of decimal places and formatting may not be what you expect based on other, non-R, visuals.
5) Printing or exporting the filtered view is not available from the pivot table.


R Pivot Table requires both the htmlwidgets and rpivotTable R packages installed if you use the visual in Power BI Desktop. These packages are already available in Power BI Service.
 
![](https://github.com/BlueGranite/RPivotTable-for-Power-BI/raw/master/images/rpivotTable.PNG)  
![](https://github.com/BlueGranite/RPivotTable-for-Power-BI/raw/master/images/rpivotTable.gif)
