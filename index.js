
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

const loadTripDetails = (id) => {
  const tripDetails = $('#tripDetails');
  tripDetails.empty();

  const tripId = `/trips/${id}`;

  let reportStatus = (message) => {
    $('#status-message').html(message);
  }

  reportStatus('Loading Trip Details!  Please Wait...!');

  axios.get(URL + tripId)

  .then((response) => {
    console.log('Responding');
    console.log(response);

    tripDetails.append(`<tr><th>Trip Details</th></tr>`);

    let detail = response.data;
    tripDetails.append(`<tr><td>Name: ${detail.name}</td></tr>`);
    tripDetails.append(`<tr><td>Trip Id:${detail.id}</td></tr>`);
    tripDetails.append(`<tr><td>Continent:${detail.continent}</td></tr>`);
    tripDetails.append(`<tr><td>Category:${detail.category}</td></tr>`);
    tripDetails.append(`<tr><td>Weeks:${detail.weeks}</td></tr>`);
    tripDetails.append(`<tr><td>Cost: $${detail.cost}</td></tr>`);
    tripDetails.append(`<tr><td>${detail.about}</td></tr>`);

    reportStatus('Trip Details Loaded');
  })

  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message }`);

  });

  console.log('this is said after the get request and will run before the api responds');
}


$(document).ready(() => {
  $('#seetrips').click(loadTrips);
  $('#showtrips').on( 'click', 'td', function(event) {
    let id = $(this).attr('id');
    event.preventDefault();
    loadTripDetails(id);
  });
});
