const rowsConverter = (item) => ({
    aqi: +item.aqi,
    date: new Date(+item.date),
})

d3.csv("https://raw.githubusercontent.com/minhrongcon2000/vn-aqi-viz/bar-chart/data/da_nang_aqi.csv", rowsConverter)
  .then(data => {
      // preprocess data
      data = data.sort((date1, date2) => date1.date - date2.date);
      data = data.map(item => ({
          aqi: item.aqi,
          date: item.date.toLocaleDateString(),
      }));

      // define width and height of images
      const width = document.querySelector("#history").getBoundingClientRect().width;
      const height = document.querySelector("#history").getBoundingClientRect().height;

       // TODO: Draw bar chart of da_nang_aqi.csv in data folder
       // with date as x-axis and aqi as bar height
       // Performed by Nguyen Thanh Luan

        var arr_data = [];
        for(var i = 0; i < data.length; i++){
            arr_data.push([ data[i]["aqi"] , data[i]["date"] ]);
        }

        console.log(arr_data);

        var padding = 50;

        svg = d3.select("#history");

        // Scale
        var xScale = d3.scaleTime()
                        .domain( [
                            d3.min(arr_data, function(d){
                                return d3.timeParse(d[1]);
                            }),
                            d3.max(arr_data, function(d){
                                return d3.timeParse(d[1]);
                            })
                        ])
                        .range([padding, width - padding]);
        var yScale = d3.scaleLinear()
                        .domain([
                            0,
                            d3.max(arr_data, function(d){
                                return d[0];
                            })
                        ])
                        .range([height-padding, padding]);
        var barScale = d3.scaleBand()
                        .domain(d3.range(arr_data.length))
                        .range([padding, width - padding])
                        .paddingInner(0.05);
            
        // Axis
        // var xAxis = d3.axisBottom(xScale);
        // svg.append("g")
        //     .attr("class", "axis")
        //     .attr("transform", "translate(0," +(height-padding)+ ")")
        //     .call(xAxis);
        var yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" +padding+ ", 0)")
            .call(yAxis);
        
        // Bar
        svg.selectAll("rect")
            .data(arr_data)
            .enter()
            .append("rect")
            .attr("x", function(d,i){
                return barScale(i);
            })
            .attr("y", function(d){
                return height + padding - yScale(d[0]);
            })
            .attr("width", barScale.bandwidth())
            .attr("height", function(d) {
                return yScale(d[0]); 
            });
  })