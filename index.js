// url to retrieve all trips
const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('status-message').html(message);
}

const loadTrips = () => {
  reportStatus('Loading Trips! Thank you for waiting...');

  const tripList = $('#trip-list');
  tripList.empty();

  // get request to API
  axios.get(URL)
    // success vv
    .then((response) => {
      response.data.forEach((trip) => {
        console.log(response);
        tripList.append(`<li>${trip.name}</li>`);
      });
    reportStatus('Trips Loaded');
    })
    // fail vv
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });


}

$(document).ready(() => {
  $('#load').click(loadTrips);
})
