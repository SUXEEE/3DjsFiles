var w = 1000;
var h = 1000;
//Create SVG Element
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var width = 960,
  height = 1160;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append('g');

svg.append("circle")
  .attr("cx", 50)
  .attr("cy", 50)
  .attr("r", 20)
  .attr("fill", "red")
  .attr("stroke-width", 3)
  .attr("stroke", "orange");
document.write("Hello ! 3D.js world!");

// 色の範囲を指定
var color = d3.scale.quantize()
  .range([
    "rgb(191,223,255)",
    "rgb(153,204,255)",
    "rgb(115,185,253)",
    "rgb(77,166,255)",
    "dnnrgb(38,147,255)",
    "rgb(0,128,255)",
    "rgb(0,109,217)",
    "rgb(0,89,178)",
    "rgb(0,70,140)",
    "rgb(0,51,102)"
  ]);

d3.csv("../pop2014re.csv", function(data) {
  color.domain([
    d3.min(data, function(d) {
      return Number(d.value);
    }),
    d3.max(data, function(d) {
      return Number(d.value);
    })
  ]);
  d3.json("../todouhuken.geojson", function(json) {
    for (var i = 0; i < data.length; i++) {
      var dataState = data[i].ken;
      var dataValue = parseFloat(data[i].population);
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.nam;
        if (jsonState == dataState) {
          json.features[j].properties.value = dataValue;
          console.log(dataValue);
          break;
        }
      }
    }
    var projection,
      path;

    projection = d3.geo.mercator()
      .scale(2000)
      .center(d3.geo.centroid(json))
      .translate([width / 2, height / 2]);

    path = d3.geo.path().projection(projection);

    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style("fill", function(feat) {
        //featは仮引数，json.featuresが入る
        var population = feat.properties.value;
        console.log(population + feat.properties.nam);
        if (population > 13000000)
          var c = "darkred";
        else if (population > 5000000)
          var c = "orangered";
        else if (population > 2500000)
          var c = "orange";
        else if (population > 1000000)
          var c = "gold";
        else
          var c = "yellow";
        return c;
      })

  });
});

//  d3.json("../todouhuken.geojson", function(json) {
//         var projection,
//         path;
//
//         projection = d3.geo.mercator()
//                .scale(2000)
//                .center(d3.geo.centroid(json))  // データから中心点を計算
//                .translate([width / 2, height / 2]);
//
//          path = d3.geo.path().projection(projection);
//
//          svg.selectAll('path')
//          .data(json.features)
//          .enter()
//          .append('path')
//          .attr('d', path)
//  });
