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
      trips.append(`<span>${trip.id}</span>`);
      $('span').hide();
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
    let tripId = $(this).next().text();
    console.log(tripId);
  });
});
