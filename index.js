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
	});
};

const TRIPINFO = ['Name', 'Continent', 'Category', 'Weeks', 'Cost', 'About'];

const listTripById = (url) => {
	axios.get(url)
	.then( (response) => {

		let tripInfo = '<h1>Trip Details</h1>';
		if (response.data) {
			reserveTrip(response.data['id']);
			for (let key of TRIPINFO) {
				tripInfo += `<p><strong>${key}</strong>: ${response.data[key.toLowerCase()]}</p>`;
			}
		}

		$('#details').html(tripInfo);
		$('#details').addClass('add-bottom');

	})
	.catch( (error) => {
		reportStatus(`Encountered an error while loading trips: ${error.message}`);
	});
};

const reserveTrip = (tripId) => {
	let newTrip = '<h1>Reserve You Trip</h1>';
	// add a form for reserve a trip
	newTrip += '<form>';
	newTrip += '<div><label for="name">Name</label><input type="text" name="name"/></div>';
	newTrip += '<div><label for="email">Email</label><input type="text" name="email"/></div>';
	newTrip += `<div id="trip-id"><label>Trip_ID: </label>${tripId}</div>`;	newTrip += '<input type="submit" name="reserve-trip" class="submit" value="Reserve trip" />';
	$('#reserve-trip').html(newTrip);
	$('#reserve-trip').addClass('add-bottom');
};

const addNewTrip = () => {
	let form = '<h1>Add a New Trip</h1><form id="trip-form"><div><label for="name">Name</label><input type="text" name="name" /></div><div><label for="continent">Continent</label><input type="text" name="continent" /></div><div><label for="about">About</label><input type="text" name="about" /></div><div><label for="categoty">Category</label><input type="text" name="category" /></div><div><label for="weeks">Weeks</label><input type="number" name="weeks" /></div><div><label for="cost">Cost</label><input type="number" name="cost" /></div><input type="submit" name="add-trip" class="submit" value="Add trip" /></form>';

	$('#new-trip').html(form);
	$('#new-trip').addClass('add-bottom');

}

const FORM_FIELDS = ['name', 'email'];

const NEW_TRIP = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

const readFormData = () => {
	const formData = {};

	const inputField = (name) => $(`#reserve-trip input[name="${name}"]`);

	const getInput = (name) => {
		const input = inputField(name).val();
		return input ? input : undefined;
	};

	FORM_FIELDS.forEach( (field) => {
		formData[field] = getInput(field);
	});

	let stringData = $('#trip-id').text();
	formData['trip_id'] = stringData.split(' ')[1];
	return formData;
};

const inputField = (name) => $(`#new-trip input[name="${name}"]`);

const readTripData = () => {
	const formData = {};

	const getInput = (name) => {
		const input = inputField(name).val();
		return input ? input : undefined;
	};

	NEW_TRIP.forEach( (field) => {
		formData[field] = getInput(field);
	});
	// console.log(formData);
	return formData;
};

const clearForm = () => {
	FORM_FIELDS.forEach( (field) => {
		inputField(field).val('');
	});
};

const createReservation = () => {
	const reservationData = readFormData();

	reportStatus('Sending reservation data...');
	let URL = ROOT + '/' + reservationData.trip_id + '/reservations';

	axios.post(URL, reservationData)
	.then( (response) => {
		reportStatus(`Successfully reserved your trip!`);
		clearForm();
	})
	.catch( (error) => {
		if (error.response.data && error.response.data.errors) {
			reportError( `Encountered an error: ${error.message}`, error.response.data.errors);
		} else {
			reportStatus(	`Encountered an error: ${error.message}`);
		}
	});
};

const createTrip = () => {
	const tripData = readTripData();
	reportStatus('Sending new trip data...');
	axios.post(ROOT, tripData)
	.then( (response) => {
		reportStatus(`Successfully created a new trip ${response.data['name']}!`);
		clearForm();
	})
	.catch( (error) => {
		if (error.response.data && error.response.data.errors) {
			reportError(
				`Encountered an error: ${error.message}`, error.response.data.errors
			);
		} else {
			reportStatus(`Encountered an error: ${error.message}`);
		}
	});
};

$(document).ready( () => {
	$('#load-trips').click(loadTrips);
	$('#add-trip').click(addNewTrip);

	$('#trip-list').on( 'click', 'a', function(event) {
		event.preventDefault();
		listTripById(this.href);
	});

	$('#reserve-trip').submit( (event) => {
		event.preventDefault();
		createReservation();
	});

	$('#new-trip').submit( (event) => {
		event.preventDefault();
		createTrip();
	});
})
