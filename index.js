
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
      tripList.append(`<tr><td id=${trip.id}>${trip.name}</td></tr>`);
    });
    reportStatus('Trips Loaded');

    // //call
    // $('#1').click(loadTripDetails);
    // console.log('both events are going');
  })

  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message }`);

  });

  console.log('this is said after the get request and will run before the api responds');
}

const loadTripDetails = () => {
  const tripDetails = $('#tripDetails');
  tripDetails.empty();

  let id = 1;
  const tripId = `/trips/${id}`;

  let reportStatus = (message) => {
    $('#status-message').html(message);
  }

  reportStatus('Loading Trip Details!  Please Wait...!');

  axios.get(URL + tripId)
  // axios.get('https://ada-backtrek-api.herokuapp.com/trips/1')

  .then((response) => {
    console.log('Responding');
    console.log(response);

    tripDetails.append(`<tr><th>Trip Details</th></tr>`);

    let detail = response.data;
    tripDetails.append(`<tr ><td>${detail.name}</td></tr>`);
    tripDetails.append(`<tr ><td>${detail.cost}</td></tr>`);
    tripDetails.append(`<tr ><td>${detail.about}</td></tr>`);

    reportStatus('Trip Details Loaded');
  })

  .catch((error) => {
    console.log(error);
    // reportStatus(`Error: ${error.message }`);

  });

  console.log('this is said after the get request and will run before the api responds');
}


$(document).ready(() => {
  $('#seetrips').click(loadTrips);
  /// or can I do it like:
  $('#showtrips').on( 'click', 'tr', function( event ) {
    console.log('code runs for 2nd click event');
    event.preventDefault();
    loadTripDetails();
  });
});
