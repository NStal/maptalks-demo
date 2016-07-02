
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector');
map.addLayer(layer);

var line = new maptalks.LineString([[121.485428, 31.228541], [121.496428, 31.228541]], {
  symbol:{
    'linePatternFile' : 'marker.png',
    'lineOpacity' : 1,
    'lineWidth' : 20
  }
});
layer.addGeometry(line);