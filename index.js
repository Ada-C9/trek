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
    $('#trips-table').append("<tr><th>All Trips</th></tr>")
    response.data.forEach((trip) => {
      $('#trips-table').append(`<tr><td>${trip.name}</td></tr>`);
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
