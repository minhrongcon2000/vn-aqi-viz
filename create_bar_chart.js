const construct_bar_selection = (selection, data, year) => {
    const innerWidth = world_rank_width - world_rank_margin.left - world_rank_margin.right;
    const innerHeight = world_rank_height - world_rank_margin.top - world_rank_margin.bottom;
    const bar = selection.selectAll("rect")
                         .data(data);

    const widthScale = d3.scaleLinear()
                          .domain([0, d3.max(data, item => item[year +" AVG"])])
                          .range([0, innerWidth]);
                         
    const yScale = d3.scaleBand()
                     .domain(data.map(item => item["Country/Region"]))
                     .range([0, innerHeight])
                     .padding(0.5);
    
          
    const xAxis = d3.axisBottom(widthScale);
    const yAxis = d3.axisLeft(yScale);
          
    // Bar
    bar.enter()
       .append("rect")
       .merge(bar)
            .attr("x", 0)
            .attr("y", d => yScale(d["Country/Region"]))
            .attr("height", yScale.bandwidth())
            .transition()
            .delay((d, i) => (data.length - i) * 10)
            .attr("width", d => widthScale(d[year + " AVG"]))
            .attr("fill", d => d["Country/Region"] === "Vietnam" ? "red" : "#3d3d3d");
    
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

const rowConverter = row => ({
    ...row,
    Rank: +row.Rank,
    "2018 AVG": row["2018"] !== "-" ? +row["2018 AVG"] : row["2018 AVG"],
    "2019 AVG": row["2019"] !== "-" ? +row["2019 AVG"] : row["2019 AVG"],
    "2020 AVG": row["2020"] !== "-" ? +row["2020 AVG"] : row["2020 AVG"],
    Population: +row.Population.split(",").join(""),
})

d3.csv("./data/national_aqi.csv", rowConverter)
  .then(data => {
      // construct world pannel
      let chosen_data = data.filter(item => item["2020 AVG"] !== NaN);
      chosen_data = chosen_data.sort((item1, item2) => item2["2020 AVG"] - item1["2020 AVG"]);
      chosen_data = chosen_data.slice(0, chosen_data.findIndex(item => item["Country/Region"] === "Vietnam") + 1 + 5);
      const g = d3.select("#rank-world-graph")
                  .append("g")
                  .attr("transform", `translate(${world_rank_margin.left}, ${world_rank_margin.top})`)

      construct_bar_selection(g, chosen_data, "2020");
      d3.selectAll("#world > .year-option")
        .on("click", e => {
            const year = e.target.innerText;
            chosen_data = data.filter(item => item[year + " AVG"].toString() !== "NaN");
            chosen_data = chosen_data.sort((item1, item2) => item2[year + " AVG"] - item1[year + " AVG"]);
            chosen_data = chosen_data.slice(0, chosen_data.findIndex(item => item["Country/Region"] === "Vietnam") + 1 + 5);
            construct_bar_selection(g, chosen_data, year);
            if (year === "2020") {
                d3.select("#world-rank > p").text("Vietnam stands at position 21st among the most 100 air-polluted countries in 2020.");
            } 
            else if (year === "2019") {
                d3.select("#world-rank > p").text("Vietnam stands at position 14th among the most 100 air-polluted countries in 2019.");
            }
            else if (year === "2018") {
                d3.select("#world-rank > p").text("Vietnam stands at position 16th among the most 100 air-polluted countries in 2018.");
            }
        });

      // ASEAN panel
      const asean_countries = ["Brunei", "Cambodia", "East Timor", "Indonesia", "Laos", "Malaysia", "Myanmar", "Philippines", "Singapore", "Thailand", "Vietnam"];
      chosen_data = data.filter(item => asean_countries.indexOf(item["Country/Region"]) !== -1);
      chosen_data = chosen_data.filter(item => item["2020 AVG"].toString() !== "NaN");
      chosen_data = chosen_data.sort((item1, item2) => item2["2020 AVG"] - item1["2020 AVG"]);
      const asean_g = d3.select("#rank-asia-graph")
                        .append("g")
                        .attr("transform", `translate(${world_rank_margin.left}, ${world_rank_margin.top})`);
      construct_bar_selection(asean_g, chosen_data, "2020");
      d3.selectAll("#asean > .year-option")
        .on("click", e => {
            const year = e.target.innerText;
            chosen_data = data.filter(item => asean_countries.indexOf(item["Country/Region"]) !== -1);
            chosen_data = chosen_data.filter(item => item[year + " AVG"].toString() !== "NaN");
            chosen_data = chosen_data.sort((item1, item2) => item2[year + " AVG"] - item1[year + " AVG"]);
            construct_bar_selection(asean_g, chosen_data, year);
            if (year === "2020") {
                d3.select("#asean-rank > p").text("Vietnam stands at position 3rd among ASEAN countries in terms of AQI in 2020.");
            } 
            else if (year === "2019") {
                d3.select("#asean-rank > p").text("Vietnam stands at position 2nd among ASEAN countries in terms of AQI in 2019.");
            }
            else if (year === "2018") {
                d3.select("#asean-rank > p").text("Vietnam stands at position 2nd among ASEAN countries in terms of AQI in 2018.");
            }
        });
  })
