
var map0 = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});


var map1 = new maptalks.Map('map1', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base1', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

map0.on('moving', function (param) {
  map1.setCenter(param.target.getCenter());
});

map0.on('zoomend', function (param) {
  map1.setCenterAndZoom(param.target.getCenter(), param.target.getZoom());
});
