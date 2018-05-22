const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const loadTrips = function loadTrips() {
  //reportStatus('Loading trips... be patient');
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      tripList.prepend('<h2>All Trips</h2>');

      response.data.forEach((trip) => {
        tripList.append(`<li>${trip.name}</li>`);
      });
      //reportStatus(`Successfully loaded ${response.data.length} trips`);
      //
    })
    .catch((error) => {
      //reportStatus(`Encountered an error while loading pets: ${error.message}`);
      console.log(error);
    });
};

$(document).ready(() => {
  $('#load-trips').click(loadTrips);
  $('#trip-list').click(event)
});
