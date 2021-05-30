// define width and height of images
const width = document.querySelector("#map").getBoundingClientRect().width;
const height = document.querySelector("#map").getBoundingClientRect().height;
const map_colors = {
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

      // define map projection
      const projection = d3.geoAlbers()
                     .center([117, 4])
                     .rotate([2, 32])
                     .parallels([11, 20])
                     .scale(1300)
                     .translate([100, height / 2 - 100]);
      
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
      d3.csv("./data/aqi.csv", item => ({
        date: new Date(item.date),
        province: item.province,
        aqi: +item.aqi,
      }))
        .then(map_data => {
          g.selectAll("path")
           .data(data.features)
           .enter()
           .append('path')
           .attr("class", "province")
           .attr('d', path)
           .attr("fill", d => {
             const name = d.properties.Name.split(" ").slice(0, -1).join(" ");
             const province_data = map_data.filter(item => item.province === name);
             if (province_data.length > 0) {
               let recent_data = province_data.sort((item1, item2) => item2 - item1);
               let recent_aqi = recent_data[0].aqi;
               if (recent_aqi <= 50) return map_colors.Good;
               else if ((recent_aqi >= 51) && (recent_aqi <= 100)) return map_colors.Moderate;
               else if ((recent_aqi >= 101) && (recent_aqi <= 150)) return map_colors["Unhealthy for sensitive group"];
               else if ((recent_aqi >= 151) && (recent_aqi <= 200)) return map_colors.Unhealthy;
               else if ((recent_aqi >= 201) && (recent_aqi <= 300)) return map_colors["Very Unhealthy"];
               return map_colors.Hazardous;
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
            const province_data = map_data.filter(item => item.province === name);
            if(province_data.length > 0) {
              let recent_data = province_data.sort((item1, item2) => item2 - item1);
              let recent_aqi = recent_data[0].aqi;
              aqi.attr("display", undefined)
                 .attr("x", width - width / 2 + 10)
                 .text(Math.round(recent_aqi));
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
  const legendHeight = Object.keys(map_colors).length * notationSize + (Object.keys(map_colors).length + 1) * margin.top;


  d3.select("#map")
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("x", 0)
    .attr("y", height - legendHeight)
    .attr("fill", "#e7ebd1")
    .attr("stroke", "black");
  let i = 0;
  for (const notation in map_colors) {
    d3.select("#map")
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", margin.left)
      .attr("y", i == 0 ? height - legendHeight + margin.top : height - legendHeight + margin.top + i * (10 + margin.top))
      .attr("fill", map_colors[notation])
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