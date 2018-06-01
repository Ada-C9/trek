const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
const URL_TRIP_BY_ID = 'https://ada-backtrek-api.herokuapp.com/trips';


//
// Status Management
//
const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    tripList.append(`<tr><th>All Trips</th></tr>`);
    response.data.forEach((trip) => {
      tripList.append(`<tr><td id="${trip.id}" class="trip-item">${trip.name}</td></tr>`);
    });
    $('.trip-item').click( function(event) {
      loadTripDetails(`${event.target.id}`);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

const loadTripDetails = (tripId) => {
  reportStatus(`Loading trip details for ${tripId}`);

  const tripDetails = $('#trip-details');
  tripDetails.empty();

  axios.get(URL_TRIP_BY_ID + `/${tripId}`)
  .then((response) => {
    let trip = response.data;
    reportStatus(`Successfully loaded trip details for ${tripId}`);
    console.log(response);
    tripDetails.append(`<div class="detail-header">Trip Details</div>`);
    tripDetails.append(`<div class="detail-content">`);
    tripDetails.append(`<h3>Name: ${trip.name}</h3>`);
    tripDetails.append(`<p>Continent: ${trip.continent}</p>`);
    tripDetails.append(`<p>Category: ${trip.category}</p>`);
    tripDetails.append(`<p>Weeks: ${trip.weeks}</p>`);
    tripDetails.append(`<p>Cost: ${trip.cost}</p>`);
    tripDetails.append(`<p>About:</br> ${trip.about}</p>`);
    tripDetails.append('</div>');

    $('input[name="tripName"]').val(`${trip.name}`);
    $('input[name="tripId"]').val(`${tripId}`);

  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trip details for ${tripId}`);
    console.log(error);
  });
};

const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#reserve-form input[name="${name}"]`);

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };

  const formData = {};
  FORM_FIELDS.forEach((field) => {
    formData[field] = getInput(field);
  });

  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}

const reserveTrip = (event) => {
  event.preventDefault();

  const tripId = inputField('tripId').val();
  if (tripId == "") {
    reportError("Please select a trip first.");
    return;
  }
  const reserveData = readFormData();
  // console.log(reserveData);

  reportStatus(`Reserving ${tripId}`);

  axios.post(URL + '/' + tripId + '/reservations', reserveData)
    .then((response) => {
      reportStatus(`Successfully reserved ${tripId}`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response)
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    })
  }

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#reserve-form').submit(reserveTrip);
});
