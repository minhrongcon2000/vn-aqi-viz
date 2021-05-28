const construct_line_selection = (selection, data, x, y, width, height, margin) => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d[x]), d3.max(data, d => d[x])])
                     .range([0, innerWidth]);
        
    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[y]), d3.max(data, d => d[y])])
        .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    const line = d3.line()
                   .x(d => xScale(d[x]))
                   .y(d => yScale(d[y]));
    
    selection.select("path").remove();  
    selection.append("path")
             .attr("d", line(data))
             .attr("stroke", "red")
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
            .attr("fill", "red")
            // .on("mouseover", e => {
            //     const cx = +e.target.getAttribute("cx");
            //     const cy = +e.target.getAttribute("cy");
            //     const xValue = +e.target.getAttribute(x);
            //     const yValue = Math.round(+e.target.getAttribute(y));
            //     selection.append("rect")
            //              .attr("id", "tooltip")
            //              .attr("x", cx)
            //              .attr("y", cy)
            //              .attr("width", 200)
            //              .attr("height", 50)
            //              .attr("fill", "#04458f");
            //     selection.append("text")
            //              .text(`${x}: ${xValue}`)
            //              .attr("x", cx + 10)
            //              .attr("y", cy + 17)
            //              .attr("id", "date");
            //     selection.append("text")
            //              .text(`${y}: ${yValue}`)
            //              .attr("x", cx + 10)
            //              .attr("y", cy + 40)
            //              .attr("id", "aqi");
            // })
            // .on("mouseleave", e => {
            //     selection.select("#tooltip").remove();
            //     selection.select("#date").remove();
            //     selection.select("#aqi").remove();
            // });
    points.exit().remove();
    

    selection.select("#x-axis").remove();
    selection.select("#y-axis").remove();
 
    selection.append("g")
             .attr("id", "y-axis")
             .call(yAxis);
    
    selection.append("g")
             .attr("id", "x-axis")
             .attr("transform", `translate(0, ${innerHeight})`)
             .call(xAxis);
}

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
      construct_line_selection(g, data, "year", "forest_area", width, height, margin);
  });

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
      construct_line_selection(g, data, "year", "co2", width, height, margin);
  });

d3.csv("./data/motor.csv", row => ({year: +row.year, num_motor: +row.num_motor}))
  .then(data => {
    const width = document.querySelector("#human").getBoundingClientRect().width;
    const height = document.querySelector("#human").getBoundingClientRect().height;
    const margin = {
      left: 150,
      top: 10,
      right: 150,
      bottom: 30,
    }
    const g = d3.select("#human")
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
    construct_line_selection(g, data, "year", "num_motor", width, height, margin);
  })
