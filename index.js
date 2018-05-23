const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

// add status in order to add colors??
// const reportStatus = (message, status) => {}..
const reportStatus = (message) => {
  $('#status-message').html(message);
};

const getTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading Trips...');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) =>{
        tripList.append(`<li><button id="trip class="button">${trip.name}</button></li>`)
      });
      reportStatus('Trips Loaded!');
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus(`Error: ${error.message}`);
    });
};

$(document).ready(() => {
  $('#all-trips').click(getTrips);
});
