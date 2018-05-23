const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading Trips! Please Wait...');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
      });
      reportStatus('Trips Loaded!');
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`);
    })
}

$(document).ready(() => {
  $('#load').click(loadTrips);
})
