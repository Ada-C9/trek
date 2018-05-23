const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  const tripList = $(`#trip-list`);
  tripList.empty();

  reportStatus('Loading trips! Please wait...');

  axios.get(URL)
  .then((response) => {
    console.log('inside the .then');
    response.data.forEach((trip) => {
      console.log(trip);
      tripList.append(`<li>${trip.name}</li>`);
    });
    reportStatus('Trips Loaded!');
  })
  .catch((error) => {
    console.log(error);
    reportStatus('Error: ${error.message}');
  });

  console.log('This is after .get');
};

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-form').submit(createTrip)
});
