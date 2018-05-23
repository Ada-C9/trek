
const URL = 'https://ada-backtrek-api.herokuapp.com';

const loadTrips = () => {
  const tripList = $('#showtrips');
  tripList.empty();

  const tripParam = '/trips';

  let reportStatus = (message) => {
    $('#status-message').html(message);
  }

  reportStatus('Loading Trips!  Please Wait...!');

  axios.get(URL + tripParam)

  .then((response) => {
    console.log('Responding');
    console.log(response);

    tripList.append(`<tr><th>All Trips</th></tr>`);

    response.data.forEach((trip) => {
      tripList.append(`<tr><td>${trip.name}</td></tr>`);
    });
    reportStatus('Trips Loaded');
  })

  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message }`);

  });

  console.log('this is said after the get request and will run before the api responds');
}

$(document).ready(() => {
  $('#seetrips').click(loadTrips);
});
