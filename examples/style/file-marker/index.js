
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker1 = new maptalks.Marker(
  map.getCenter().substract(0.009, 0),
  {
    'symbol' : {
      'markerFile'   : '1.png',
      'markerOpacity': 1,
      'markerWidth'  : 28,
      'markerHeight' : 40,
      'markerDx'     : 0,
      'markerDy'     : 0
    }
  }
).addTo(layer);

var marker2 = new maptalks.Marker(
  map.getCenter().substract(0.006, 0),
  {
    'symbol' : {
      'markerFile'   : '2.png',
      'markerOpacity': 1,
      'markerWidth'  : 28,
      'markerHeight' : 40,
      'markerDx'     : 0,
      'markerDy'     : 0
    }
  }
).addTo(layer);

var marker3 = new maptalks.Marker(
  map.getCenter().substract(0.003, 0),
  {
    'symbol' : {
      'markerFile'   : '3.png',
      'markerOpacity': 1,
      'markerWidth'  : 28,
      'markerHeight' : 40,
      'markerDx'     : 0,
      'markerDy'     : 0
    }
  }
).addTo(layer);

var marker4 = new maptalks.Marker(
  map.getCenter(),
  {
    'symbol' : {
      'markerFile'   : '4.png',
      'markerOpacity': 1,
      'markerWidth'  : 28,
      'markerHeight' : 40,
      'markerDx'     : 0,
      'markerDy'     : 0
    }
  }
).addTo(layer);

var marker5 = new maptalks.Marker(
  map.getCenter().add(0.003, 0),
  {
    'symbol' : {
      'markerFile'   : '5.png',
      'markerOpacity': 1,
      'markerWidth'  : 28,
      'markerHeight' : 40,
      'markerDx'     : 0,
      'markerDy'     : 0
    }
  }
).addTo(layer);

var marker6 = new maptalks.Marker(
  map.getCenter().add(0.006, 0),
  {
    'symbol' : {
      'markerFile'   : '6.png',
      'markerOpacity': 1,
      'markerWidth'  : 28,
      'markerHeight' : 40,
      'markerDx'     : 0,
      'markerDy'     : 0
    }
  }
).addTo(layer);
