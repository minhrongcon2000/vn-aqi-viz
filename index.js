
// define width and height of images
const width = document.querySelector("#map")
                      .getBoundingClientRect()
                      .width;
const height = document.querySelector("#map")
                       .getBoundingClientRect()
                       .height;


const projection = d3.geoAlbers()
                     .center([114, 4.4])
                     .rotate([2, 32])
                     .parallels([11, 20])
                     .scale(2500)
                     .translate([width / 2, height / 2]);
const path = d3.geoPath(projection);

d3.json("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json")
  .then(data => {
    console.log(data);
    const g = d3.select("#map");
    g.selectAll("path")
     .data(data.features)
     .enter()
     .append('path')
     .attr("class", "country")
     .attr('d', path);
  })

// // // define margin
// // const margin = {
// //   left: 150,
// //   right: 150,
// //   top: 20,
// //   bottom: 50
// // }

// // // view box width and height
// // const innerWidth = width - margin.left - margin.right;
// // const innerHeight = height - margin.top - margin.bottom