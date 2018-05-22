const URL = 'https://ada-backtrek-api.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus("Loading trips...")

  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      $('#trip-list').append(`<li>${trip.name}</trip>`);
    });
    reportStatus('Trips loaded :)');
  })
  .catch((error) => {
    reportStatus(`Error: ${error.message}`);
  })
};




$(document).ready(() => {
  $('#get-trips').click(loadTrips)
})
