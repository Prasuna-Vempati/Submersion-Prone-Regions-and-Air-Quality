var nasadem = ee.Image("NASA/NASADEM_HGT/001");

// Create land data from elevation, and clip it to the geometry
var elevation = nasadem.select('elevation').clip(geometry);
var land = elevation.gt(0);
var landElevation = elevation.updateMask(land);

// Create hillshade + dem for visualization, clipped to the geometry
var hillshade = ee.Terrain.hillshade(landElevation.multiply(10)).visualize();
var elevationVisualized = landElevation.visualize({ min: 0, max: 2000, palette: ['green', 'yellow', 'chocolate', 'white'], opacity: 0.6});
var combined = hillshade.blend(elevationVisualized);
Map.addLayer(combined, {}, 'Elevation');

// Base year and rise
var baseYear = 2050;
var baseRise = 100;

// Add sea rise on start, clipped to the geometry
seaRise(baseRise, baseYear);


// Create UI for sea rise slider
var panel = ui.Panel([], ui.Panel.Layout.flow('vertical'), { width: '400px', padding: '1%' });
ui.root.add(panel); // Add the panel to the left of map

// Title
var title = ui.Label('Sea Level Rise Simulation', { color: 'red', fontSize: '30px', fontWeight: 'bold', stretch: 'horizontal'});
panel.add(title);

// Slider for sea rise
var seaRiseLabel = ui.Label('Sea level rise per year (mm)', { stretch: 'horizontal'});
panel.add(seaRiseLabel);

var seaRiseSlider = ui.Slider(0, 1000, baseRise, 1, 
  function(mm){ seaRise(mm, yearSlider.getValue()); }, 
  'horizontal', false, { stretch: 'horizontal' });
panel.add(seaRiseSlider);

// Year slider
var yearLabel = ui.Label('Year', { stretch: 'horizontal'});
panel.add(yearLabel);

var yearSlider = ui.Slider(2020, 2100, baseYear, 1, 
  function(year){ seaRise(seaRiseSlider.getValue(), year); }, 
  'horizontal', false, { stretch: 'horizontal' });
panel.add(yearSlider);

// Add legend panel for elevation
var legendElevation = ui.Panel([], ui.Panel.Layout.flow('vertical'), { position: 'bottom-left' });
Map.add(legendElevation);
legendPanel('Elevation (m)', { min: 0, max: 2000, palette: ['green', 'yellow', 'chocolate', 'white'], opacity: 0.8}, legendElevation);

// Legend for drown area
var drownLegend = ui.Panel(
  [
    ui.Label('', { height: '20px', width: '30px', backgroundColor: 'blue' }),
    ui.Label('Drown area', { height: '20px' })
  ], 
  ui.Panel.Layout.flow('horizontal'), { position: 'bottom-left' }
);
Map.add(drownLegend);

// Function to add sea level rise data, clipped to the geometry
function seaRise(mm, year){
  var rise = mm / 1000 * (year - 2020);
  var drown = landElevation.lte(rise).selfMask();
  var layer = ui.Map.Layer(drown.clip(geometry), { palette: 'blue', opacity: 0.6 }, 'Sea rise ' + mm + ' per year in ' + year);
  Map.layers().set(1, layer);
}

// Legend
function legendPanel(title, visual, legend){
  // Create legend title
  var legendTitle = ui.Label({
    value: title,
    style: {
    fontWeight: 'bold',
    fontSize: '15px',
    textAlign: 'center',
    stretch: 'horizontal'
    }
  });
   
  // Add the title to the panel
  legend.add(legendTitle);
   
  // Create the legend image
  var lon = ee.Image.pixelLonLat().select('latitude');
  var gradient = lon.multiply((visual.max-visual.min)/100.0).add(visual.min);
  var legendImage = gradient.visualize(visual);
   
  // Create text on top of legend
  var max = ui.Label({
    value: visual.max,
    style: {textAlign: 'center', stretch: 'horizontal'}
  });
  legend.add(max);
   
  // Create thumbnail from the image
  var thumbnail = ui.Thumbnail({
    image: legendImage,
    params: {bbox:'0,0,10,100', dimensions:'10x50'},
    style: {textAlign: 'center', stretch: 'horizontal', height: '150px'}
  });
   
  // Add the thumbnail to the legend
  legend.add(thumbnail);
   
  // Create text on bottom of legend
  var min = ui.Label({
    value: visual.min,
    style: {textAlign: 'center', stretch: 'horizontal'}
  });
  legend.add(min);
  
  return legend;
}
