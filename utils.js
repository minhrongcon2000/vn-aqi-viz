const rowsConverter = (item) => ({
    aqi: +item.aqi,
    date: new Date(+item.date),
});

const getAvgAQIByYear = (data, year) => {
    const year_data = data.map(item => ({
        date: item.date.getFullYear(),
        aqi: item.aqi,
    }))
    .filter(item => item.date === year);

    return year_data.map(item => item.aqi).reduce((acc, curr) => acc + curr) / year_data.length;
}

const getDistinctYear = (data) => {
    let years = [];
    for (const item of data) {
        if (years.indexOf(item.date.getFullYear()) === -1) years.push(item.date.getFullYear());
    }
    return years;
}