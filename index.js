
const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
  const Trips = $('#trip-list');
  Trips.empty();

  reportStatus('Trips Loading...')

  axios.get(URL)
  .then((response) => {
    console.log(response);

    response.data.forEach((trip) => {
      Trips.append(`<li>${trip.name}</li>`);
    });
    reportStatus('')
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`)
  });
};


$(document).ready(() => {
  $('#load').click(loadTrips);
});
