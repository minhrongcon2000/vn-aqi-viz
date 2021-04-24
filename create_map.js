d3.json("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json")
  .then(data => {
      // define width and height of images
      const width = document.querySelector("#map").getBoundingClientRect().width;
      const height = document.querySelector("#map").getBoundingClientRect().height;

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



      const projection = d3.geoAlbers()
                     .center([114, 4.4])
                     .rotate([2, 32])
                     .parallels([11, 20])
                     .scale(1500)
                     .translate([0, height / 2]);
      const path = d3.geoPath(projection);

      const g = d3.select("#map")
                  .append("g")
                  .attr("transform", 
                        `translate(${margin.left}, ${margin.top})`);
      
      const zoom = d3.zoom()
                     .on("zoom", e => {
                       g.selectAll("path")
                        .attr("transform", e.transform);
                     })
                
      
      const tooltip = d3.select("#map")
                       .append("text")
                       .attr("id", "tooltip")
                       .attr("display", "none");
      d3.select("#map").append("rect")
       .attr("width", width)
       .attr("height", height)
       .attr("x", 0)
       .attr("y", 0)
       .attr("fill", "none")
       .attr("stroke", "black")
       .attr("stroke-width", 3);
      g.selectAll("path")
       .data(data.features)
       .enter()
       .append('path')
       .attr("class", "province")
       .attr('d', path)
       .attr('name', d => d.properties.Name);

      g.on("mouseover", e => {
        const {x, y} = document.querySelector("#map").getBoundingClientRect();
        tooltip.text(e.target.getAttribute("name"))
               .attr("x", e.clientX - x)
               .attr("y", e.clientY - y)
               .attr("display", undefined);
      })
      .on("mouseleave", e => {
        if(!e.target.getAttribute("name")) {
          tooltip.attr("display", "none");
        }
      });
      d3.select("#map").call(zoom);
  })