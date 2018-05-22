const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

// Status Management
const reportStatus = (message) => {
  $('#display-status').html(message);
};

const loadTrips = () => {
  reportStatus('Loading trips');

  const trips = $('#all-trips');
  trips.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips.`);
    response.data.forEach((trip) => {
      trips.append(`<li>${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`There was a problem loading trips: ${error.message}`);
    console.log(error);
  });
};

$(document).ready(() => {
  $('#display-trips').click(() => {
    loadTrips();
  });
  $('ul').on('click', 'li', function() {
    let tripName = $(this).text();
  });
});
