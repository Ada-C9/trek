const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  const tripList = $('#tbody');
  tripList.empty();

  reportStatus('Loading trips! Please wait...');

  axios.get(URL)
  .then((response) => {
    $('#table').show();
    response.data.forEach((trip) => {
      tripList.append(`<tr><td>${trip.name}</td></tr>`);
      console.log(trip);
    });
    reportStatus('Trips Loaded!');
  })
  .catch((error) => {
    console.log(error);
    reportStatus('Error: ${error.message}');
  });
};

const openTrip = (id) => {
  const tripList = $('#tbody/${id}');
  tripList.empty();

  reportStatus('Loading trip! Please wait...');

  axios.get(`${URL}/${id}`, (trip))
  .then((response) => {
    $('#table').show();
    response.data.forEach((trip) => {
      tripList.append(`<tr><td>${trip.name}</td></tr>`);
      console.log(trip);
    });
    reportStatus('Trip Loaded!');
  })
  .catch((error) => {
    console.log(error);
    reportStatus('Error: ${error.message}');
  });
};

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-form').submit(createTrip)
});
