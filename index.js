const allTripsUrl = " https://ada-backtrek-api.herokuapp.com/trips"

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`;
  content += '<ul>';
}


// axios.get(allTripsUrl)
const getTrips = function getTrips() {
  // console.log("Am i inside?");
  let tripList = $('.trips')

  axios.get(allTripsUrl)
  .then((response) => {
    console.log('inside the .then');
    response.data.forEach((trip) => {
      console.log(trip);
      tripList.append(`<li>${trip.name}</li>`);
    });
    reportStatus('Trips Loaded!');
  })
};

$(document).ready(() => {
  // $('#load').click(loadWonders);
  getTrips()
});
