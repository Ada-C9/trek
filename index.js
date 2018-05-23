const allTripsUrl = " https://ada-backtrek-api.herokuapp.com/trips";

const singleTripUrl = "https://ada-backtrek-api.herokuapp.com/trips/";

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`;
  content += '<ul>';
}

const loadTrips = function loadTrips() {
  let tripList = $('.trips');

  axios.get(allTripsUrl)
  .then((response) => {
    console.log('inside the .then');
    response.data.forEach((trip) => {
      console.log(trip);
      tripList.append(`<li><a class="trip" href="#">${trip.name}</a></li>`);
    });
    reportStatus('Trips Loaded!');
  })
  .catch((error) => {
    console.log(error);
    if (error.response.data && error.response.data.errors) {
      // User our new helper method
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Error: ${error.message }`);
    }
  });
};

const getTrip = function getTrip(event) {
  // id, name, continent, about, category, weeks and cost
  // params to get id ???
  event.preventDefault();

  axios.get(singleTripUrl + '3' )
  .then((response) => {
    $('#details').empty().append(`<h2>${response.data.name}</h2><h3>${response.data.continent}</h3><p>${response.data.about}</p><p>${response.data.category}</p><p>${response.data.weeks}</p><p>${response.data.cost}</p>`);
    reportStatus('Trips Loaded!');
  });
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('.trips').on('click', '.trip', getTrip);
});
