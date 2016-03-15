//Create SVG Element
var width = 1600,
  height = 1600,
  centered;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append('g');

var bool = new Boolean(false);

svg.append("circle")
  .attr("cx", 100)
  .attr("cy", 50)
  .attr("r", 20)
  .attr("fill", "red")
  .attr("stroke-width", 3)
  .transition().delay(1500).duration(2000)
  .attr("stroke", "orange");
//document.write("Hello ! D3.js world!");

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
      var dataExtra = data[i].extra;
      var dataTweet1 = data[i].tweet1;
      var dataTweet2 = data[i].tweet2;
      var dataTweet3 = data[i].tweet3;
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.nam;
        if (jsonState == dataState) {
          json.features[j].properties.value = dataValue;
          json.features[j].properties.extra = dataExtra;
          json.features[j].properties.tweet1 = dataTweet1;
          json.features[j].properties.tweet2 = dataTweet2;
          json.features[j].properties.tweet3 = dataTweet3;
          break;
        }
      }
    }

    var projection, path;
    projection = d3.geo.mercator()
      .scale(3000)
      .center(d3.geo.centroid(json))
      .translate([width / 2, height / 2]);
    path = d3.geo.path().projection(projection);

    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .on('click', click)
      .style("fill", function(jfeat) {
        //jfeatは仮引数，json.featuresが入る
        var population = jfeat.properties.value;
        //console.log(population + feat.properties.nam);
        if (population > 13000000)
          var c = "darkred";
        else if (population > 5000000)
          var c = "orangered";
        else if (population > 2500000)
          var c = "orange";
        else if (population > 1000000)
          var c = "gold";
        else if (population > 750000)
          var c = "yellow";
        else
          var c = "blue";
        return c;
      })
      .style("stroke", "gray")
      .style("stroke-width", "0.5px");


    function click(d, i) {
      var p = d3.select(this).selectAll('path');
      console.log(p);
      console.log(d.properties.nam + "のtweetの1位は" + d.properties.tweet1);
      console.log(d.properties.nam + "のtweetの2位は" + d.properties.tweet2);
      console.log(d.properties.nam + "のtweetの3位は" + d.properties.tweet3);
      //console.log(d.geometry.coordinates);
      var x, y, k;

      if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;

        //データを上に表示
        svg.selectAll("text")
          .data(json.features)
          .enter()
          .append("text")
          .attr("x", function(d) {
            return path.centroid(d)[0];
          })
          .attr("y", function(d) {
            return path.centroid(d)[1];
          })
          .text(function(d) {
            var textArray = [d.properties.nam, d.properties.tweet1, d.properties.tweet2, d.properties.tweet3];
            return textArray;
          })

      } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;

        //データを削除
        textArray = null;
        svg.selectAll("text").remove();

      }

      svg.selectAll("path")
        .classed("active", centered && function(d) {
          return d === centered;
        });

      svg.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");



      function leftLinebreak(array) {
        var string = "";
        array.forEach(function(t, i) {
          string += '<tspan class="line' + i + '" ' + 'y="' + i + 'em" x="0em">' + t + '</tspan>'
        });
        return string;
      }

    }
  });
});
