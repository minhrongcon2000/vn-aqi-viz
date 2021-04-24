const rowsConverter = (item) => ({
    aqi: +item.aqi,
    date: new Date(+item.date),
})

d3.csv("./data/da_nang_aqi.csv", rowsConverter)
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
  })