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
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trip details for ${tripId}`);
    console.log(error);
  });
};

$(document).ready(() => {
  $('#load').click(loadTrips);
});
