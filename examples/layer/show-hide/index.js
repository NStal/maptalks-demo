
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var marker = new maptalks.Marker(
  map.getCenter(),
  {
    symbol : {
      'textName' : 'Layer is shown.',
      'textWeight' : 'bold',
      'textSize' : 50,
      'textFill' : '#1bbc9b',
      'textHaloFill' : '#fff',
      'textHaloRadius' : 5
    }
  }
);
var layer = new maptalks.VectorLayer('vector')
    .addGeometry(marker)
    .addTo(map);

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Show',
      click: function () {
        layer.show();
      }
    },
    {
      item: 'Hide',
      click: function () {
        layer.hide();
      }
    }
  ]
}).addTo(map);
