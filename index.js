const URL = 'https://ada-backtrek-api.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus("Loading trips...")

  axios.get(URL)

};




$(document).ready(() => {
  $('#get-trips').click(loadTrips)
})
