const construct_bar_selection = (selection, data, year, width, height, margin) => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
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
            .attr("yVal", d => d["Country/Region"])
            .attr("xVal", d => d[year + " AVG"])
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
      new Story({
          containerSelector: "#main-page",
          panelSelector: "#main-page > .bar-graph-panel",
          enterHandler: (story, panel) => {
              if(panel === 1) {
                  const width = document.querySelector("#rank-world-graph").getBoundingClientRect().width;
                  const height = document.querySelector("#rank-world-graph").getBoundingClientRect().height;
                  const margin = {
                      left: 150,
                      top: 10,
                      right: 150,
                      bottom: 30,
                  }
                  let chosen_data = data.filter(item => item["2020 AVG"] !== NaN);
                  chosen_data = chosen_data.sort((item1, item2) => item2["2020 AVG"] - item1["2020 AVG"]);
                  chosen_data = chosen_data.slice(0, chosen_data.findIndex(item => item["Country/Region"] === "Vietnam") + 1 + 5);
                  let g = d3.select("#rank-world-graph > g");
                  if(g._groups[0][0] === null) {
                      g = d3.select("#rank-world-graph")
                            .append("g")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`);
                  }
                  construct_bar_selection(g, chosen_data, "2020", width, height, margin);
                  const countryLegend = g.append("text")
                                  .attr("fill", "white")
                                  .attr("id", "country");

                  const aqiLegend = g.append("text")
                                     .attr("fill", "white")
                                     .attr("id", "aqi");
                  d3.selectAll("#rank-world-graph > g > rect")
                    .on("mouseover", (e) => {
                        const countryName = e.target.getAttribute("yVal");
                        const aqiVal = e.target.getAttribute("xVal");
                        countryLegend.text(countryName);
                        aqiLegend.text(aqiVal);

                        const innerWidth = width - margin.left - margin.right;
                        const innerHeight = height - margin.top - margin.bottom;
                        
                        const countryLegendWidth = document.querySelector("#rank-world-graph > g > #country").getBoundingClientRect().width;
                        const countryLegendHeight = document.querySelector("#rank-world-graph > g > #country").getBoundingClientRect().height;
                        const aqiLegendWidth = document.querySelector("#rank-world-graph > g > #aqi").getBoundingClientRect().width;
                        const aqiLegendHeight = document.querySelector("#rank-world-graph > g > #aqi").getBoundingClientRect().height;

                        countryLegend.attr("x", innerWidth - countryLegendWidth - 10)
                                     .attr("y", innerHeight - countryLegendHeight - aqiLegendHeight);
                        aqiLegend.attr("x", innerWidth - aqiLegendWidth - 10)
                                 .attr("y", innerHeight - aqiLegendHeight);
                    })
                    .on("mouseout", e => {
                        countryLegend.text("");
                        aqiLegend.text("");
                    });
                  d3.selectAll("#world > .year-option")
                    .on("click", e => {
                        const year = e.target.innerText;
                        chosen_data = data.filter(item => item[year + " AVG"].toString() !== "NaN");
                        chosen_data = chosen_data.sort((item1, item2) => item2[year + " AVG"] - item1[year + " AVG"]);
                        chosen_data = chosen_data.slice(0, chosen_data
                                                 .findIndex(item => item["Country/Region"] === "Vietnam") + 1 + 5);
                        construct_bar_selection(g, chosen_data, year, width, height, margin);
                        d3.selectAll("#rank-world-graph > g > rect")
                          .on("mouseover", (e) => {
                              const countryName = e.target.getAttribute("yVal");
                              const aqiVal = e.target.getAttribute("xVal");
                              countryLegend.text(countryName);
                              aqiLegend.text(aqiVal);

                              const innerWidth = width - margin.left - margin.right;
                              const innerHeight = height - margin.top - margin.bottom;
                        
                              const countryLegendWidth = document.querySelector("#rank-world-graph > g > #country").getBoundingClientRect().width;
                              const countryLegendHeight = document.querySelector("#rank-world-graph > g > #country").getBoundingClientRect().height;
                              const aqiLegendWidth = document.querySelector("#rank-world-graph > g > #aqi").getBoundingClientRect().width;
                              const aqiLegendHeight = document.querySelector("#rank-world-graph > g > #aqi").getBoundingClientRect().height;

                              countryLegend.attr("x", innerWidth - countryLegendWidth - 10)
                                           .attr("y", innerHeight - countryLegendHeight - aqiLegendHeight);
                              aqiLegend.attr("x", innerWidth - aqiLegendWidth - 10)
                                       .attr("y", innerHeight - aqiLegendHeight);
                          })
                          .on("mouseout", e => {
                              countryLegend.text("");
                              aqiLegend.text("");
                          });
                          if (year === "2020") {
                              d3.select("#world-rank > p")
                                .text("Vietnam stands at " + 
                                    "position 21st among the most" + 
                                    " 100 air-polluted countries in 2020.");
                          } 
                          else if (year === "2019") {
                              d3.select("#world-rank > p")
                                .text("Vietnam stands at" + 
                                    " position 14th among the most" + 
                                    " 100 air-polluted countries in 2019.");
                          }
                          else if (year === "2018") {
                              d3.select("#world-rank > p")
                                .text("Vietnam stands at position" +
                                    " 16th among the most 100 air-polluted" + 
                                    " countries in 2018.");
                          }
                    });
              } else if(panel === 2) {
                  const width = document.querySelector("#rank-asia-graph").getBoundingClientRect().width;
                  const height = document.querySelector("#rank-asia-graph").getBoundingClientRect().height;
                  const margin = {
                      left: 150,
                      top: 10,
                      right: 150,
                      bottom: 30,
                  }
                  const asean_countries = ["Brunei", "Cambodia", "East Timor", "Indonesia", "Laos", "Malaysia", "Myanmar", "Philippines", "Singapore", "Thailand", "Vietnam"];
                  chosen_data = data.filter(item => asean_countries.indexOf(item["Country/Region"]) !== -1);
                  chosen_data = chosen_data.filter(item => item["2020 AVG"].toString() !== "NaN");
                  chosen_data = chosen_data.sort((item1, item2) => item2["2020 AVG"] - item1["2020 AVG"]);
                  
                  let asean_g = d3.select("#rank-asia-graph > g");
                  if(asean_g._groups[0][0] === null) {
                      asean_g = d3.select("#rank-asia-graph")
                                  .append("g")
                                  .attr("transform", `translate(${margin.left}, ${margin.top})`);
                  }
                  construct_bar_selection(asean_g, chosen_data, "2020", width, height, margin);

                  const countryLegend = asean_g.append("text")
                                  .attr("fill", "white")
                                  .attr("id", "country");

                  const aqiLegend = asean_g.append("text")
                                     .attr("fill", "white")
                                     .attr("id", "aqi");
                  d3.selectAll("#rank-asia-graph > g > rect")
                    .on("mouseover", (e) => {
                        const countryName = e.target.getAttribute("yVal");
                        const aqiVal = e.target.getAttribute("xVal");
                        countryLegend.text(countryName);
                        aqiLegend.text(aqiVal);

                        const innerWidth = width - margin.left - margin.right;
                        const innerHeight = height - margin.top - margin.bottom;
                        
                        const countryLegendWidth = document.querySelector("#rank-asia-graph > g > #country").getBoundingClientRect().width;
                        const countryLegendHeight = document.querySelector("#rank-asia-graph > g > #country").getBoundingClientRect().height;
                        const aqiLegendWidth = document.querySelector("#rank-asia-graph > g > #aqi").getBoundingClientRect().width;
                        const aqiLegendHeight = document.querySelector("#rank-asia-graph > g > #aqi").getBoundingClientRect().height;

                        countryLegend.attr("x", innerWidth - countryLegendWidth - 10)
                                     .attr("y", innerHeight - countryLegendHeight - aqiLegendHeight);
                        aqiLegend.attr("x", innerWidth - aqiLegendWidth - 10)
                                 .attr("y", innerHeight - aqiLegendHeight);
                    })
                    .on("mouseout", e => {
                        countryLegend.text("");
                        aqiLegend.text("");
                    });

                  d3.selectAll("#asean > .year-option")
                    .on("click", e => {
                        const year = e.target.innerText;
                        chosen_data = data.filter(item => asean_countries.indexOf(item["Country/Region"]) !== -1);
                        chosen_data = chosen_data.filter(item => item[year + " AVG"].toString() !== "NaN");
                        chosen_data = chosen_data.sort((item1, item2) => item2[year + " AVG"] - item1[year + " AVG"]);
                        construct_bar_selection(asean_g, chosen_data, year, width, height, margin);
                        d3.selectAll("#rank-asia-graph > g > rect")
                    .on("mouseover", (e) => {
                        const countryName = e.target.getAttribute("yVal");
                        const aqiVal = e.target.getAttribute("xVal");
                        countryLegend.text(countryName);
                        aqiLegend.text(aqiVal);

                        const innerWidth = width - margin.left - margin.right;
                        const innerHeight = height - margin.top - margin.bottom;
                        
                        const countryLegendWidth = document.querySelector("#rank-asia-graph > g > #country").getBoundingClientRect().width;
                        const countryLegendHeight = document.querySelector("#rank-asia-graph > g > #country").getBoundingClientRect().height;
                        const aqiLegendWidth = document.querySelector("#rank-asia-graph > g > #aqi").getBoundingClientRect().width;
                        const aqiLegendHeight = document.querySelector("#rank-asia-graph > g > #aqi").getBoundingClientRect().height;

                        countryLegend.attr("x", innerWidth - countryLegendWidth - 10)
                                     .attr("y", innerHeight - countryLegendHeight - aqiLegendHeight);
                        aqiLegend.attr("x", innerWidth - aqiLegendWidth - 10)
                                 .attr("y", innerHeight - aqiLegendHeight);
                    })
                    .on("mouseout", e => {
                        countryLegend.text("");
                        aqiLegend.text("");
                    });
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
              }
          },
          exitHandler: (story, panel) => {
              if(panel === 1) {
                  d3.selectAll("#rank-world-graph > g > rect").remove();
                  d3.selectAll("#rank-world-graph > g > text").remove();
                  d3.select("#world-rank > p").text("Vietnam stands at position 21st among the most 100 air-polluted countries in 2020.");
              }

              if(panel === 2) {
                  d3.selectAll("#rank-asia-graph > g > rect").remove();
                  d3.selectAll("#rank-asia-graph > g > text").remove();
                  d3.select("#asean-rank > p").text("Vietnam stands at position 3rd among ASEAN countries in terms of AQI in 2020.");
              }
          },
      });
  })
