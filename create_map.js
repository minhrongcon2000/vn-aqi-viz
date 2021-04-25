// define width and height of images
const width = document.querySelector("#map").getBoundingClientRect().width;
const height = document.querySelector("#map").getBoundingClientRect().height;
const colors = {
  Good: "#598f59",
  Moderate: "#e5ff00",
  "Unhealthy for sensitive group": "#eda813",
  Unhealthy: "#ed0c0c",
  "Very Unhealthy": "#a600ff",
  Hazardous: "#8608c9",
  "No data": "#ccc",
}

d3.json("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json")
  .then(data => {
      // define margin
      const margin = {
        left: 150,
        right: 150,
        top: 20,
        bottom: 50
      }

      // view box width and height
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // define map projection
      const projection = d3.geoAlbers()
                     .center([114, 4.4])
                     .rotate([2, 32])
                     .parallels([11, 20])
                     .scale(1500)
                     .translate([0, height / 2]);
      
      const path = d3.geoPath(projection);

      const g = d3.select("#map")
                  .append("g")
                  .attr("transform", `translate(${margin.left}, ${margin.top})`);;

      // zoom functionality
      const zoom = d3.zoom()
                     .on("zoom", e => {
                       g.selectAll("path")
                        .attr("transform", e.transform);
                     });
      
      // tooltip
      const tooltip_box = d3.select("#map").append("rect")
                            .attr("width", width / 2)
                            .attr("height", 45)
                            .attr("x", width - width / 2)
                            .attr("fill", "none");
                
      
      const city_name = d3.select("#map")
                          .append("text")
                          .attr("y", 15)
                          .attr("display", "none");
      
      const aqi = d3.select("#map")
                    .append("text")
                    .attr("y", 32)
                    .attr("display", "none");
      g.selectAll("path")
       .data(data.features)
       .enter()
       .append('path')
       .attr("class", "province")
       .attr('d', path)
       .attr("fill", d => {
         const name = d.properties.Name.split(" ").slice(0, -1).join(" ");
         if (city2codename[name]) {
           const avg_aqi = city2data[city2codename[name]].map(item => item.aqi).reduce((acc, curr) => acc + curr) / city2data[city2codename[name]].length;
           if (avg_aqi <= 50) return colors.Good;
           else if ((avg_aqi >= 51) && (avg_aqi <= 100)) return colors.Moderate;
           else if ((avg_aqi >= 101) && (avg_aqi <= 150)) return colors["Unhealthy for sensitive group"];
           else if ((avg_aqi >= 151) && (avg_aqi <= 200)) return colors.Unhealthy;
           else if ((avg_aqi >= 201) && (avg_aqi <= 300)) return colors["Very Unhealthy"];
           return colors.Hazardous;
         }
         return "#ccc";
       })
       .attr('name', d => d.properties.Name.split(" ").slice(0, -1).join(" "));


      g.on("mouseover", e => {
        const name = e.target.getAttribute("name");
        city_name.text(name)
               .attr("display", undefined)
               .attr("x", width - width / 2 + 10);
        tooltip_box.attr("stroke", "black")
                   .attr("fill", "#fcffc7");
        if(city2codename[name]) {
          const avg_aqi = city2data[city2codename[name]].map(item => item.aqi).reduce((acc, curr) => acc + curr) / city2data[city2codename[name]].length;
          aqi.attr("display", undefined)
             .attr("x", width - width / 2 + 10)
             .text(parseInt(avg_aqi));
        } else {
          aqi.attr("display", undefined)
             .attr("x", width - width / 2 + 10)
             .text("no data");
        }
      })
      .on("mouseleave", e => {
        const name = e.target.getAttribute("name");
        if(!name) {
          city_name.attr("display", "none");
          tooltip_box.attr("fill", "none")
                     .attr("stroke", "none");
          aqi.attr("display", "none");
        }
      });
      d3.select("#map").call(zoom);
      create_legend();
  });

const create_legend = () => {
  const notationSize = 10;
  const margin = {
    top: 10,
    left: 10,
    right: 0,
    bottom: 0,
  }
  const legendWidth = 250;
  const legendHeight = Object.keys(colors).length * notationSize + (Object.keys(colors).length + 1) * margin.top;


  d3.select("#map")
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("x", 0)
    .attr("y", height - legendHeight)
    .attr("fill", "#e7ebd1")
    .attr("stroke", "black");
  let i = 0;
  for (const notation in colors) {
    d3.select("#map")
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", margin.left)
      .attr("y", i == 0 ? height - legendHeight + margin.top : height - legendHeight + margin.top + i * (10 + margin.top))
      .attr("fill", colors[notation])
      .attr("stroke", "black");
    d3.select("#map")
      .append("text")
      .attr("font-size", 15)
      .attr("x", 2 * margin.left + notationSize)
      .attr("y", i == 0 ? height - legendHeight + margin.top + notationSize : height - legendHeight + margin.top + notationSize + i * (10 + margin.top))
      .text(notation);
    i += 1;
  }
      

}