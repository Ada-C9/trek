const ROOT = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
	$('#status-message').html(message);
};

const reportError = (message, errors) => {
	let content = `<p>${message}</p><ul>`;
	for (const field in errors) {
		for (const problrm of errors[field]) {
			content += `<li>${field}: ${problrm}</li>`;
		}
	}
	content += '</ul>';
	reportStatus(content);
};

const loadTrips = () => {
	reportStatus('Loading trips...');
	const tripList = $('#trip-list');
	axios.get(ROOT)
	.then( (response) => {
		reportStatus(`Successfully loaded ${response.data.length} trips`);
		response.data.forEach( (trip) => {
			// push trip into trip list
			// <li><a href=""></a></li>
			let link = `${ROOT}/${trip.id}`;
			tripList.append(`<li><a href=${link}>${trip.name}</a></li>`);
		});
	})
	.catch( (error) => {
		reportStatus(`Encountered an error while loading trips: ${error.message}`);
		console.log(error);
	});
};

const listTripById = (url) => {
	reportStatus(`Loading Trip`);
	axios.get(url)
	.then( (response) => {
		console.log(response.data.name);
		let tripInfo = 

		$('#details').html(tripInfo);
		// $('#details').append
	})
	.catch( (error) => {
		reportStatus(`Encountered an error while loading trips: ${error.message}`);
		console.log(error);
	});
};


$(document).ready( () => {
	$('#load-trips').click(loadTrips);

	$('#trip-list').on( 'click', 'a', function(event) {
		event.preventDefault();
		console.log(this.href);
		listTripById(this.href);
	});
})
