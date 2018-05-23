const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips, please wait...');

  axios.get(URL)
    .then((response) => {
      console.log(response);
      response.data.forEach((trip) => {
        tripList.append(`<li>${trip.name}</li>`);
      });
      reportStatus('Trips loaded.')
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
    console.log('this is after .get');
    console.log(tripList);
};

$(document).ready(() => {
  $('#load').click(loadTrips);
});
