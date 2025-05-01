var startDate = '2024-08-23';
var endDate = '2024-10-23';

// Define a function to process each gas type by clipping it to roi
function getGasCollection(collectionName, bandName, roi) {
  return ee.ImageCollection(collectionName)
    .select(bandName)
    .filterDate(startDate, endDate)
    .map(function(image) {
      return image.clip(roi);
    });
}

// Define a function to plot time series charts for each gas
function plotTimeSeries(gasCollection, region, label) {
  var chart = ui.Chart.image.series({
    imageCollection: gasCollection,
    region: region,
    reducer: ee.Reducer.mean(),
    scale: 1113.2,
    xProperty: 'system:time_start'
  }).setOptions({title: label + ' Time Series'});
  
  print(chart);
}

// Visualization parameters for each gas
var bandViz = {
  no2: {min: 0, max: 0.0002, palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']},
  co: {min: 0, max: 0.05, palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']},
  hcho: {min: 0, max: 0.0001, palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']},
  o3: {min: 0, max: 0.0004, palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']},
  so2: {min: 0, max: 0.0002, palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']},
  ch4: {min: 0, max: 1900, palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']}
};

// Process gases for all three ROIs
var gases = [
  {name: "NO2", collectionName: "COPERNICUS/S5P/OFFL/L3_NO2", bandName: 'NO2_column_number_density', viz: bandViz.no2},
  {name: "CO", collectionName: "COPERNICUS/S5P/OFFL/L3_CO", bandName: 'CO_column_number_density', viz: bandViz.co},
  {name: "HCHO", collectionName: "COPERNICUS/S5P/OFFL/L3_HCHO", bandName: 'tropospheric_HCHO_column_number_density', viz: bandViz.hcho},
  {name: "O3", collectionName: "COPERNICUS/S5P/OFFL/L3_O3", bandName: 'O3_column_number_density', viz: bandViz.o3},
  {name: "SO2", collectionName: "COPERNICUS/S5P/OFFL/L3_SO2", bandName: 'SO2_column_number_density', viz: bandViz.so2},
  {name: "CH4", collectionName: "COPERNICUS/S5P/OFFL/L3_CH4", bandName: 'CH4_column_volume_mixing_ratio_dry_air', viz: bandViz.ch4}
];

// Define the regions of interest with unique suffixes for each
var rois = [
  {roi: roi1, suffix: '_1'},
  {roi: roi2, suffix: '_2'},
  {roi: roi3, suffix: '_3'}
];

// Iterate over each region and gas type to generate layers and time series
rois.forEach(function(roiObj) {
  var roi = roiObj.roi;
  var suffix = roiObj.suffix;
  
  gases.forEach(function(gas) {
    // Get the gas collection and calculate its average
    var gasCollection = getGasCollection(gas.collectionName, gas.bandName, roi);
    var avgGas = gasCollection.mean();
    
    // Add each average layer to the map with unique names
    Map.addLayer(avgGas, gas.viz, 'Average ' + gas.name + suffix);
    
    // Plot each time series for the gas
    plotTimeSeries(gasCollection, roi, gas.name + suffix);
  });
});

// Center map on the first region of interest initially
Map.centerObject(roi1);
