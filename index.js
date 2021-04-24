d3.csv("vn_coord.csv", item => ({
    x: +item.lng,
    y: +item.lat,
    city: item.admin_name,
}))
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

      // axis scale
      const xScale = d3.scaleLinear()
                        .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
                        .range([0, innerWidth]);
      const yScale = d3.scaleLinear()
                        .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
                        .range([innerHeight, 0]);

      const g = d3.select("#map")
                  .append("g")
                  .attr("transform", 
                        `translate(${margin.left}, ${margin.top})`)
                  .attr("id", "main-graph");
      const dot_radius = 3;
      const tooltip = g.append("text")
                       .attr("id", "tooltip")
                       .attr("display", "none");
      
      g.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("fill", "blue")
       .attr("cx", d => xScale(d.x))
       .attr("cy", d => yScale(d.y))
       .attr("name", d => d.city)
       .attr("r", dot_radius)
       .attr("opacity", 0.5)
       .on("mouseover", d => {
           tooltip.attr("x", +d.target.getAttribute("cx") + 5)
                  .attr("y", +d.target.getAttribute("cy"))
                  .attr("display", undefined)
                  .text(d.target.getAttribute("name"));
        })
       .on("mouseleave", d => {
            tooltip.attr("display", "none");
        })
       .on("click", d => {
           const city = d.target.getAttribute("name");
           const codename = city2codename[city];
           if(!codename) {
             console.log("no data");
           } else {
             console.log("have data");           
           }
        });
  })