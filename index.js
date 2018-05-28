
const TRIPS_URL = "https://ada-backtrek-api.herokuapp.com/trips"
const TRIP_URL = "https://ada-backtrek-api.herokuapp.com/trips/"

const reportStatus = message => {
  $("#status-message").html(message);
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

// To call more than one trip
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trips-list');
  tripList.empty();

  axios.get(TRIPS_URL)
  // success (think of it as an "if")
  .then(response => {

    let location = response.data.results

    console.log(location);

    reportStatus(`Yay we successfully added ${response.data.length} trip(s)!`);

    response.data.forEach(trip => {
      console.log(trip);
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
    }); //ends forEach loop
  }) // ends .then

  // failure ("else this other thing")
  .catch(error => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  }); // ends .catch
}; // ends const loadTrips

// To call only one trip
const loadTrip = function loadTrip(selectedTripID) {
  reportStatus('Loading one trip...');

  axios.get(TRIP_URL + `${selectedTripID}`)
  .then(response => {

    console.log(response);
    const tripDetails = $('#trip-details');

    tripDetails.empty();

    tripDetails.append(`<li><strong>Trip ID: </strong>${response.data.id}</li><br>`);
    tripDetails.append(`<li><strong>Trip Name: </strong>${response.data.name}</li><br>`);
    tripDetails.append(`<li><strong>Continent: </strong>${response.data.continent}</li><br>`);
    tripDetails.append(`<li><strong>About: </strong>${response.data.about}</li><br>`);
    tripDetails.append(`<li><strong>Category: </strong>${response.data.category}</li><br>`);
    tripDetails.append(`<li><strong>Duration (weeks): </strong>${response.data.weeks}</li><br>`);
    tripDetails.append(`<li><strong>Cost: $</strong>${response.data.cost}</li><br>`);

    reportStatus('Loaded trip details...')
    loadResForm(response.data.name);
  })

  .catch(error => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
}; // ends const loadTrip

const FORM_FIELDS = ["name", "email"];
const inputField = name => $(`.reserve-trip-form input[name="${name}"]`);

const clearForm = () => {
  FORM_FIELDS.forEach(field => {
    inputField(field).val("");
  });
};

const loadResForm = function loadResForm(tripName) {
  // hide the form using CSS (display-none)
  // show the form
  $('.reserve-trip-form').show();
  $('.reserve-trip-form .trip-name').text(tripName);
};

const createRes = function createRes(tripID) {
  // get info from form, send to Rails API, say make a new res
  let resData = {
    name: $('.reserve-trip-form input[name="name"]').val(),
    email: $('.reserve-trip-form input[name="email"]').val()

  };

  axios.post(TRIP_URL + tripID + "/reservations", resData)
    // get the trip ID

  .then(function(response) {
    // set the status message to say that we successfully added a res
    // clear the res form
    reportStatus(`Successfully added a trip with ID ${response.data.trip_id}!`);
    clearForm();
  })

  .catch(function(error) {
    // display the error messages
    console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
  });

};

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trips-list').on( "click", "li", function() {
    let selectedTripID = (this.id)
    loadTrip(selectedTripID);

    // clear out the handlers prior to adding submit handler
    $('.reserve-trip-form form').off( "submit");

    $('.reserve-trip-form form').submit(function (event) {
      event.preventDefault();
      createRes(selectedTripID); // <- a closure!!!
    });

  });

}); // ends (document).ready
