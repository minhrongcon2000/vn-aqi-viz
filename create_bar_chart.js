const construct_bar_selection = (selection, data) => {
    const bar_color = "";
    const threshold = 101;
    const innerWidth = history_width - history_margin.left - history_margin.right;
    const innerHeight = history_height - history_margin.top - history_margin.bottom;
    const bar = selection.selectAll("rect")
                         .data(data);

    const xScale = d3.scaleBand()
                     .domain(data.map(item => item.date))
                     .range([0, innerWidth])
                     .paddingInner(0.05);
                         
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.aqi) + 20])
                     .range([innerHeight, 0]);
    
          
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
          
    // Bar
    bar.enter()
       .append("rect")
       .merge(bar)
            .attr("x", d => xScale(d.date))
            .attr("y", innerHeight)
            .attr("width", xScale.bandwidth())
            .attr("height", 0)
            .attr("fill", d => d.aqi >= threshold ? "#c72424" : "#ccc")
            .transition()
            .delay((d, i) => i * 100)
            .attr("y", d => yScale(d.aqi))
            .attr("height", d => innerHeight - yScale(d.aqi));
    
    bar.exit().remove();

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

const draw_bar = (data) => {
    const g = d3.select("#history")
                .append("g")
                .attr("transform", `translate(${history_margin.left}, ${history_margin.top})`);
    construct_bar_selection(g, data);
}


const update = (data) => {
    const innerWidth = history_width - history_margin.left - history_margin.right;
    const innerHeight = history_height - history_margin.top - history_margin.bottom;
        
    const g = d3.select("#history > g");
    construct_bar_selection(g, data);
}