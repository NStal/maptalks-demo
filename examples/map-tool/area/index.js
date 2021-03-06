var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var areaTool = new maptalks.AreaTool({
  'symbol': {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 2,
    'polygonFill' : '#fff',
    'polygonOpacity' : 0.3
  },
  'vertexSymbol' : {
    'markerType'        : 'ellipse',
    'markerFill'        : '#34495e',
    'markerLineColor'   : '#1bbc9b',
    'markerLineWidth'   : 3,
    'markerWidth'       : 10,
    'markerHeight'      : 10
  },
  language: ''
}).addTo(map);
