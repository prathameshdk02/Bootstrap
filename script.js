const getTableData = async () => {
    let table = null;

	await $.get('https://viaje.ai/seatinfo_api/', function (data, status, xhr) {
		dataList = data.data.map((obj) => {
			let list = [];
			list.push(obj.seat_no);
			list.push(obj.price);
			list.push(obj.status);
			return list;
		});

        table = $('#table-id').DataTable({
            paging: false,
            searching: false,
            info: false,
            ordering: false,
            responsive: true,
            aaData: dataList,
        });
	});

    return table;
};

const getChartData = () => {
	$.get('https://viaje.ai/mainvia_api/', function (data, status, xhr) {
		console.log(data);

		// Extract the categories --> X-axis
		let categories = data.data.map((obj) => obj[0]);
		let arrs = [];

		for (let i = 1; i < Object.keys(data.data[0]).length; i++) {
			arrs.push(data.data.map((obj) => obj[i]));
		}

		let seriesNames = ['via-Route-bookings', 'Main-Route-bookings', 'Total Seats'];

		let series = arrs.map((list, index) => {
			return {
				name: seriesNames[index],
				data: list,
				stack: index != 2 ? 'totalBookings' : 'totalSeats',
			};
		});

		console.log(series);

		// Configure Highcharts
		let chartOptions = {
			chart: { renderTo: 'hiw-highchart', type: 'column' },
			title: { text: 'Travel Bookings.' },
			xAxis: { categories: categories },
			yAxis: { title: { text: 'No. of Bookings' } },
			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500,
						},
						chartOptions: {
							legend: {
								enabled: false,
							},
						},
					},
				],
			},
			plotOptions: {
				column: {
					stacking: 'normal',
				},
			},
			series: series,
		};

		const chart = new Highcharts.Chart(chartOptions);
	});
};

$(document).ready(() => {
    let table = getTableData()
    getChartData();
})