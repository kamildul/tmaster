let jsonResult;

function initMapCountries() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://restcountries.com/v3.1/all',
            dataType: 'json',
            success: function (data) {
				const countries = data.map((country, index) => {
					return {
						index: index,
						country: country.name.common,
						capital: country.capital ? country.capital[0] : 'N/A',
						capitalInfo: country.capitalInfo
					};
				});
                jsonResult = JSON.stringify(countries, null, 2);
                resolve();
            },
            error: function (error) {
                console.error('Messages:', error);
                reject(error);
            }
        });
    });
}

$(document).ready(function () {
    initMapCountries()
		.then(() => {
			var parsedResult = JSON.parse(jsonResult);
			var cityList = $('#cityList');
			$.each(parsedResult, function (index, city) {
				var listItem = $('<li>');
				listItem.html('<a href="#" class="showMap" data-row-id="' + city.index + '">Country: ' + city.country + ', Capital: ' + city.capital + '</a>');
				cityList.append(listItem);
			});
		})
		.catch(error => {
			console.error('Messages:', error);
		});

	var map = L.map('map').setView([0, 0], 2);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

	$('#cityList').on('click', '.showMap', function () {
		var rowIndex = $(this).attr('data-row-id');
		var foundCity = JSON.parse(jsonResult)[rowIndex];
		var capitalInfo = foundCity.capitalInfo;
		var capitalCoordinates = [capitalInfo.latlng[0], capitalInfo.latlng[1]];
		map.setView(capitalCoordinates, 6);
		L.marker(capitalCoordinates).addTo(map)
			.bindPopup('Stolica: ' + foundCity.capital)
			.openPopup();
	});
});