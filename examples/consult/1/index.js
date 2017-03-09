var map = new maptalks.Map('map', {
    center: [121.48542888885189, 31.228541533313702],
    zoom: 14,
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: '$(urlTemplate)',
        subdomains: $(subdomains)
    })
});
var pointLayer = new maptalks.VectorLayer('points').addTo(map);
var polygonLayer = new maptalks.VectorLayer('polygons').addTo(map);


var widthStep = 200
var heightStep = 150
var offsetX = 200
var offsetY = 100
var w = 3
var h = 2
var coords = []
// Create points
var transferLength = function(x){
    return x
}
var transfer = function(x,y){
    x = x * widthStep
    y = y * heightStep
    var p = new maptalks.Point(x + offsetX,y + offsetY)
    var cord = map.viewPointToCoordinate(p)
    return cord
}

for(var i =0;i<h;i++){
    for(var j=0;j<w;j++){
        coords.push(transfer(j,i))
    }
}
var c = coords
var symbol = {
    "polygonFill":"rgba(0,0,0,0)"
}

var pl1 = new maptalks.Polygon([c[0],c[1],c[4],c[3]],{symbol:symbol})
var pl2 = new maptalks.Polygon([c[1],c[2],c[5],c[4]],{symbol:symbol})
pl1.addTo(polygonLayer)
pl2.addTo(polygonLayer)
var pCoords = transfer(0.5,0.5)
var polygons = [pl1,pl2]
var markers = []
var i = 0
var radar = new maptalks.Marker(transfer(-0.1,-0.1),{markerType:"ellipse"})
radar.step = 800
radar.ranges = [1,2,3].map(function(item){return item * radar.step})
radar.rangesColor = ["rgba(255,0,0,0.5)","rgba(0,255,0,0.5)","rgba(0,0,255,0.5)","rgba(0,0,0,0.5)"]
radar.ranges.forEach(function (range,index){
    var color = radar.rangesColor[index]
    var circle = new maptalks.Circle(radar.getCenter(),transferLength(range),{
        symbol:{
            lineColor:color
        }
    })
    circle.addTo(polygonLayer)
})
radar.addTo(pointLayer)
while(i < 5){
    var marker = new maptalks.Marker(transfer(2 * Math.random(),2 * Math.random()),{draggable:true,symbol:{markerType:"triangle"}})
    marker.markerIndex = i
    markers.push(marker)
    marker.addTo(pointLayer)
    marker.on("dragend",(e)=>{
        sync()
        e.domEvent.preventDefault()
        e.domEvent.stopImmediatePropagation()
    })
    i++
}
function sync(){
    // clear polygon's point
    polygons.forEach(function(p){
        p.myPoints = []
    })
    // put markers into polygons
    markers.forEach(function(m){
        var arr = polygons;
        for(var i=0;i <arr.length;i++){
	    var item = polygons[i];
	    if(item.containsPoint(m.getCenter())){
                item.myPoints.push(m)
            }
        }
    })
    // change polygon color by density
    polygons.forEach(function(p){
        // density > 2
        if(p.myPoints.length > 2){
            p.setSymbol({
                polygonFill:"rgba(255,0,0,0.5)"
            })
        }else{
            p.setSymbol({
                polygonFill:"rgba(0,0,0,0.1)"
            })

        }
    })
    // change point color by radar range
    markers.forEach(function(marker){
        let mp = new maptalks.Point(marker.getCenter())
        let rp = new maptalks.Point(radar.getCenter())
        let distance = map.computeLength(mp,rp)
        let index = Math.floor(distance/radar.step)
        let color = radar.rangesColor[index] || radar.rangesColor[3]
        let symbol = {
            markerFill:color
        }
        marker.updateSymbol(symbol)
        //console.error(symbol)A
        //marker.setSymbol({'markerType': 'pin',
        //                  'markerFill': "rgb(0,0,0)",
        //                  'markerFillOpacity': 1,
        //                  'markerLineColor': '#34495e',
        //                  'markerLineWidth': 3,
        //                  'markerLineOpacity': 1,
        //                  'markerLineDasharray':[],
        //                  'markerWidth': 40,
        //                  'markerHeight': 40,
        //                  'markerDx': 0,
        //                  'markerDy': 0})
        //marker.setSymbol(symbol)
    })
}

// identify multiple point and bring to front
map.on("click",function(e){
    map.identify({coordinate:e.coordinate,layers:[pointLayer]},function(geos){
        let menuItems = []
        console.error(geos)
        if(geos && geos.length > 1){
            geos.forEach(function(item){
                if(typeof item.markerIndex !== "number")return
                menuItems.push({
                    item:"marker" + item.markerIndex,
                    click:function(){
                        item.bringToFront()
                    }
                })
            })
            let menu = new maptalks.ui.Menu()
            menu.setItems(menuItems)
            menu.addTo(map)
            console.error("menuitems",menuItems)
            menu.show(e.coordinate)
        }
    })
})
function identify(geometry){
    
}
sync()
