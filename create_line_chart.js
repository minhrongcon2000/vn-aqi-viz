const construct_line_selection = (selection, data, x, y, width, height, margin, color, displayXAxis, displayYAxis, xMin, xMax, yMin, yMax) => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    let xScale;
    if((!xMax) && !(xMin)) {
      xScale = d3.scaleLinear()
                 .domain([d3.min(data, d => d[x]), d3.max(data, d => d[x])])
                 .range([0, innerWidth]);
    }
    else {
      xScale = d3.scaleLinear()
                 .domain([xMin, xMax])
                 .range([0, innerWidth]);
    }

    let yScale;
    if ((!yMax) && (!yMin)) {
      yScale = d3.scaleLinear()
                 .domain([d3.min(data, d => d[y]), d3.max(data, d => d[y])])
                 .range([innerHeight, 0]);
    } else {
      yScale = d3.scaleLinear()
                 .domain([yMin, yMax])
                 .range([innerHeight, 0]);
    }
        

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    const line = d3.line()
                   .x(d => xScale(d[x]))
                   .y(d => yScale(d[y]));
    
    selection.select("path").remove();  
    selection.append("path")
             .transition()
             .delay(100)
             .attr("d", line(data))
             .attr("stroke", color)
             .attr("stroke-width", 5)
             .attr("fill", "none");

    const points = selection.selectAll("circle").data(data);

    points.enter()
          .append("circle")
          .merge(points)
            .attr("cx", d => xScale(d[x]))
            .attr("cy", d => yScale(d[y]))
            .attr(x, d => d[x])
            .attr(y, d => d[y])
            .attr("r", 5)
            .attr("fill", color);
    points.exit().remove();
    
    if(displayXAxis) {
      selection.select("#x-axis").remove();
      selection.append("g")
               .attr("id", "x-axis")
               .attr("transform", `translate(0, ${innerHeight})`)
               .call(xAxis);
    }

    if(displayYAxis) {
      selection.select("#y-axis").remove();
   
      selection.append("g")
               .attr("id", "y-axis")
               .call(yAxis);
    }
}

new Story({
  containerSelector: "#main-page",
  panelSelector: "#main-page > .bar-graph-panel",
  enterHandler: (story, panel) => {
    if(panel === 3) {
      d3.csv("./data/forest.csv", row => ({ year: +row.year, forest_area: +row.forest_area }))
        .then(data => {
            const width = document.querySelector("#forest").getBoundingClientRect().width;
            const height = document.querySelector("#forest").getBoundingClientRect().height;
            const margin = {
              left: 150,
              top: 10,
              right: 150,
              bottom: 30,
            }
            const g = d3.select("#forest")
                        .append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);
            construct_line_selection(g, data, "year", "forest_area", width, height, margin, "red", true, true);
        });
    }

    if(panel === 4) {
      d3.csv("./data/co2.csv", row => ({ year: +row.year, co2: +row.co2 }))
        .then(data => {
            const width = document.querySelector("#co2").getBoundingClientRect().width;
            const height = document.querySelector("#co2").getBoundingClientRect().height;
            const margin = {
              left: 150,
              top: 10,
              right: 150,
              bottom: 30,
            }
            const g = d3.select("#co2")
                        .append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);
            construct_line_selection(g, data, "year", "co2", width, height, margin, "red", true, true);
        });
    }

    if(panel === 5) {
      d3.csv("./data/co2_fuel.csv", rows => ({year: +rows.Year, gas: +rows.gas, oil: +rows.oil, coal: +rows.coal}))
        .then(data => {
          const width = document.querySelector("#human").getBoundingClientRect().width;
          const height = document.querySelector("#human").getBoundingClientRect().height;
          const margin = {
            left: 150,
            top: 10,
            right: 150,
            bottom: 30,
          }
          const clean_data = data.filter(item => (item.oil > 0) & (item.gas > 0) & (item.coal > 0));
          const oil_g = d3.select("#human")
                          .append("g")
                          .attr("id", "oil")
                          .attr("transform", `translate(${margin.left}, ${margin.top})`);
          const gas_g = d3.select("#human")
                          .append("g")
                          .attr("id", "gas")
                          .attr("transform", `translate(${margin.left}, ${margin.top})`);
          const coal_g = d3.select("#human")
                          .append("g")
                          .attr("id", "coal")
                          .attr("transform", `translate(${margin.left}, ${margin.top})`);
          const oil_data = clean_data.map(item => ({ year: item.year, oil: item.oil }));
          const gas_data = clean_data.map(item => ({ year: item.year, gas: item.gas }));
          const coal_data = clean_data.map(item => ({ year: item.year, coal: item.coal }));
      
          const oil_max = d3.max(oil_data, d => d.oil);
          const gas_max = d3.max(gas_data, d => d.gas);
          const coal_max = d3.max(coal_data, d => d.coal);
          const oil_min = d3.min(oil_data, d => d.oil);
          const gas_min = d3.min(gas_data, d => d.gas);
          const coal_min = d3.min(coal_data, d => d.coal);
      
          const yMax = d3.max([oil_max, gas_max, coal_max]);
          const yMin = d3.min([oil_min, gas_min, coal_min]);
      
          construct_line_selection(oil_g, oil_data, "year", "oil", width, height, margin, "red", true, true, undefined, undefined, yMin, yMax);
          construct_line_selection(gas_g, gas_data, "year", "gas", width, height, margin, "blue", true, true, undefined, undefined, yMin, yMax);
          construct_line_selection(coal_g, coal_data, "year", "coal", width, height, margin, "green", true, true, undefined, undefined, yMin, yMax);
        });
    }
  },
  exitHandler: (story, panel) => {
    if(panel === 3) {
      d3.select("#forest > g").remove();
    } else if(panel === 4) {
      d3.select("#co2 > g").remove();
    }
    else if(panel === 5) {
      d3.selectAll("#human > g").remove();
    }
  }    
})



