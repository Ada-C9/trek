const allTripsUrl = " https://ada-backtrek-api.herokuapp.com/trips"

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`;
  content += '<ul>';
}


// axios.get(allTripsUrl)
const loadTrips = function loadTrips() {
  // console.log("Am i inside?");
  let tripList = $('.trips')

  axios.get(allTripsUrl)
  .then((response) => {
    console.log('inside the .then');
    response.data.forEach((trip) => {
      console.log(trip);
      tripList.append(`<li>${trip.name}</li>`);
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

$(document).ready(() => {
  $('#load').click(loadTrips);
  // loadTrips()
});
