const URL = 'https://ada-backtrek-api.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message)
}

const loadTrips = (event) => {
  $('.all-trips').removeClass('display-none');

  const tripList = $('#trip-list');
  tripList.empty(); // empty out the list each time so there aren't duplilcates

  reportStatus('Loading trips! Please wait...')

  // get info
  axios.get(URL) // returns a promise
    .then((response) => {
      response.data.forEach((trip) => {
        console.log(response.data);
        tripList.append(`<p class="${trip.id}">${trip.name}</p>`);
      });
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`${error.message}`)
    });

  reportStatus('Trips loaded!')

}




$(document).ready(() => {
  $('#trips-button').click(loadTrips);
});
