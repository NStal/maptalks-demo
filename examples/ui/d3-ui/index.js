var width = 960,
  height = 500;

var data = d3.range(5000).map(function () {
  return [Math.random() * width, Math.random() * width];
});

var quadtree = d3.geom.quadtree()
            .extent([[-1, -1], [width + 1, height + 1]])(data);

var brush = d3.svg.brush()
            .x(d3.scale.identity().domain([0, width]))
            .y(d3.scale.identity().domain([0, height]))
            .extent([[100, 100], [200, 200]])
            .on('brush', brushed);

var svg = d3.select('#d3').append('svg')
            .attr('width', width)
            .attr('height', height);

svg.selectAll('.node')
            .data(nodes(quadtree))
          .enter().append('rect')
            .attr('class', 'node')
            .attr('x', function (d) { return d.x; })
            .attr('y', function (d) { return d.y; })
            .attr('width', function (d) { return d.width; })
            .attr('height', function (d) { return d.height; });

var point = svg.selectAll('.point')
            .data(data)
          .enter().append('circle')
            .attr('class', 'point')
            .attr('cx', function (d) { return d[0]; })
            .attr('cy', function (d) { return d[1]; })
            .attr('r', 4);

svg.append('g')
            .attr('class', 'brush')
            .call(brush);

brushed();

function brushed() {
  var extent = brush.extent();
  point.each(function (d) { d.scanned = d.selected = false; });
  search(quadtree, extent[0][0], extent[0][1], extent[1][0], extent[1][1]);
  point.classed('scanned', function (d) { return d.scanned; });
  point.classed('selected', function (d) { return d.selected; });
}

    // Collapse the quadtree into an array of rectangles.
function nodes(quadtree) {
  var nodes = [];
  quadtree.visit(function (node, x1, y1, x2, y2) {
    nodes.push({x: x1, y: y1, width: x2 - x1, height: y2 - y1});
  });
  return nodes;
}

    // Find the nodes within the specified rectangle.
function search(quadtree, x0, y0, x3, y3) {
  quadtree.visit(function (node, x1, y1, x2, y2) {
    var p = node.point;
    if (p) {
      p.scanned = true;
      p.selected = (p[0] >= x0) && (p[0] < x3) && (p[1] >= y0) && (p[1] < y3);
    }
    return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
  });
}


var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});


var echartsUI = new maptalks.ui.UIMarker([121.485428, 31.228541], {
  'draggable'     : false,
  'single'        : false,
  'content'       : document.getElementById('d3')
});
echartsUI.addTo(map).show();


