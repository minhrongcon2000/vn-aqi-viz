const rowsConverter = (item) => ({
    aqi: +item.aqi,
    date: new Date(+item.date),
})

d3.csv("https://raw.githubusercontent.com/minhrongcon2000/vn-aqi-viz/bar-chart/data/da_nang_aqi.csv", rowsConverter)
  .then(data => {
      // preprocess data
      data = data.sort((date1, date2) => date1.date - date2.date);
      data = data.filter(item => item.date.getFullYear() === 2021);
      
      // define width and height of images
      const width = document.querySelector("#history").getBoundingClientRect().width;
      const height = document.querySelector("#history").getBoundingClientRect().height;

      const margin = {
          left: 30,
          top: 10,
          right: 30,
          bottom: 30,
      }
      // TODO: Draw bar chart of da_nang_aqi.csv in data folder
      // with date as x-axis and aqi as bar height
      // Performed by Nguyen Thanh Luan
      // view box width and height
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      
      const g = d3.select("#history")
                  .append("g")
                   .attr("transform", `translate(${margin.left}, ${margin.top})`);
      // Scale
      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(data, d => d.aqi)])
                       .range([0, innerHeight]);
      const xScale = d3.scaleBand()
                       .domain(data.map(item => item.date)
                                   .map(item => item.toLocaleString()))
                       .range([0, innerWidth])
                       .paddingInner(0.05);
        
      const yAxis = d3.axisLeft(yScale);
      const xAxis = d3.axisBottom(xScale);
        
      // Bar
      g.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => xScale(d.date.toLocaleString()))
       .attr("y", d => innerHeight - yScale(d.aqi))
       .attr("width", xScale.bandwidth())
       .attr("height", d => yScale(d.aqi));

     g.append("g")
      .attr("id", "y-axis")
      .call(yAxis);
     g.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);
  })