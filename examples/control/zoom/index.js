
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  zoomControl: {
    'position'  : 'top-left',
    'slider'    : true,
    'zoomLevel' : true
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var noZoomLevel = new maptalks.control.Zoom({
  'position'  : 'top-right',
  'slider'    : true,
  'zoomLevel' : false
});
map.addControl(noZoomLevel);

var noSlider = new maptalks.control.Zoom({
  'position'  : 'bottom-right',
  'slider'    : false,
  'zoomLevel' : true
});
map.addControl(noSlider);

var customPosition = new maptalks.control.Zoom({
  'position'  : {'bottom' : '20', 'left' : '20'},
  'slider'    : false,
  'zoomLevel' : false
});
map.addControl(customPosition);
