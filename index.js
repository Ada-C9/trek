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
	newTrip += '<div><label for="age">Age</label><input type="number" name="age"/></div>';
	newTrip += '<div><label for="email">Email</label><input type="text" name="email"/></div>';
	newTrip += `<div id="trip-id"><label>Trip_ID</label>: ${tripId}</div>`;	newTrip += '<input type="submit" name="reserve-trip" value="Reserve Trip" />';
	$('#reserve-trip').html(newTrip);
  $('#reserve-trip').addClass('add-bottom');
};

const addNewTrip = () => {
	let form = '<h1>Add a New Trip</h1><form id="trip-form"><div><label for="name">Name</label><input type="text" name="name" /></div><div><label for="continent">Continent</label><input type="text" name="continent" /></div><div><label for="about">About</label><input type="text" name="about" /></div><div><label for="categoty">Category</label><input type="text" name="category" /></div><div><label for="weeks">Weeks</label><input type="number" name="weeks" /></div><div><label for="cost">Cost</label><input type="number" name="cost" /></div><input type="submit" name="add-trip" value="Add trip" /></form>';

	$('#new-trip').html(form);
	$('#new-trip').addClass('add-bottom');

}

const FORM_FIELDS = ['name', 'age', 'email'];
const inputField = (name) => $(`#reserve-trip input[name="${name}"]`);

const readFormData = () => {
  const getInput = (name) => {
    const input = inputField(name).val();
		return input ? input : undefined;
	};

	const formData = {};
	FORM_FIELDS.forEach( (field) => {
		formData[field] = getInput(field);
	});
	let stringData = $('#trip-id').text();
	formData['trip_id'] = stringData[stringData.length - 1];
	return formData;
};

const clearForm = () => {
	FORM_FIELDS.forEach( (field) => {
		inputField(field).val('');
	});
};

const createReservation = (event) => {
	event.preventDefault();
	const reservationData = readFormData();

	reportStatus('Sending reservation data...');
	let URL = ROOT + '/' + reservationData.trip_id + '/reservations';

	axios.post(URL, reservationData)
	.then( (response) => {
    reportStatus(`Successfully reserved your trip with Reservation ${response.data['id']}!`);
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

$(document).ready( () => {
	$('#load-trips').click(loadTrips);

	$('#trip-list').on( 'click', 'a', function(event) {
		event.preventDefault();
		listTripById(this.href);
	});

	$('#add-trip').click(addNewTrip);
	$('#reserve-trip').submit(createReservation);
})
