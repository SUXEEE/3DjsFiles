// var w = 1000;
// var h = 1000;
//Create SVG Element
// var svg = d3.select("body")
// .append("svg")
// .attr("width", w)
// .attr("height",h);

var width = 960,
    height = 1160;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append('g');

svg.append("circle")
    .attr("cx",50)
    .attr("cy",50)
    .attr("r",20)
    .attr("fill","red")
    .attr("stroke-width",3)
    .attr("stroke","orange");
document.write("Hello ! js world!");
//

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
  //         //  .attr("fill", function(d){
  //         //      return "hsl(0,0%,80%)";
  //         //  })
  //         //  .attr("stroke","hsl(80,100%,0%)" )
  //         //  .on('mouseover', function(d){
  //         //  })
  //         //  .on('click', function(d) {
  //         //  });
  //  });


d3.csv("pop2014.csv", function(data) {
  console.log(data);
  d3.json("../todouhuken.geojson", function(json) {
         var projection,
         path;
    for(var i=0; i<data.length; i++) {
      for(var j=0; j<json.features.length; j++) {
        if( data[i].ken == json.features[j].properties.name_local ) {
          json.features[j].properties.population = data[i].population;
        }
      }
    }

    projection = d3.geo.mercator()
           .scale(2000)
           .center(d3.geo.centroid(json))  // データから中心点を計算
           .translate([width / 2, height / 2]);

     path = d3.geo.path().projection(projection);

    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function (d) {
        var population = d.properties.population;
        console.log(population);
        if( population > 10000000 )
          var c = "darkred";
        else if( population > 5000000 )
          var c = "orangered";
        else if( population > 2500000 )
          var c = "orange";
        else if( population > 1000000 )
          var c = "gold";
        else
          var c = "yellow";
        return c;
      })
      .style("stroke", "gray")
      .style("stroke-width", "0.5px");
  });
});



// //Load Japan topojson
// d3.json("../json/japan.topojson", function(json) {
//       //geo data
// 	    var geodata = json.objects.japan;
//       //draw(json);
//       var japan = topojson.feature(json, geodata).features;
//       //projection method
//       var projection = d3.geo.mercator()
//       .center([137, 34])
//       .translate([w / 2, h / 2])
//       .scale(1500);
//       //latitude and longtitude 2 path data settings
//       var path = d3.geo.path()
//       .projection(projection);
//       //latitude and longtitude 2 path data settings
//       svg.selectAll("path")
//       .data(japan)
//       .enter()
//       .append("path")
//       .attr("d", path);
//     });
