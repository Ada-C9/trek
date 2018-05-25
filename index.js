
const URL = 'https://ada-backtrek-api.herokuapp.com';

const loadTrips = () => {
  const tripList = $('#showtrips');
  tripList.empty();
  $('.ReserveTrip').hide();

  $('#tripDetails').empty();

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

  })

  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message }`);

  });

}

const reserveTrip = function reserveTrip(tripId, reservationDetails){

  let reportStatus = (message) => {
    $('#status-message').html(message);
  }

  reportStatus('Loading Trip Details!  Please Wait...!');


  axios.post(`https://ada-backtrek-api.herokuapp.com/trips/${tripId}/reservations`, reservationDetails)

  .then((response) => {
    console.log('Responding');
    reportStatus('Successfully Reserved Trip');
  })

  .catch((error) => {
    console.log(error);
    reportStatus(`Unable to Reserve: ${error.message }`);
  });

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
    tripDetails.append(`<tr><td>Continent: ${detail.continent}</td></tr>`);
    tripDetails.append(`<tr><td>Category: ${detail.category}</td></tr>`);
    tripDetails.append(`<tr><td>Weeks: ${detail.weeks}</td></tr>`);
    tripDetails.append(`<tr><td>Cost: $${detail.cost}</td></tr>`);
    tripDetails.append(`<tr><td>${detail.about}</td></tr>`);

    reportStatus('Trip Details Loaded');

    $('#tripName').empty();
    $('#tripName').append(`<h5>Trip Name: ${detail.name}</h5>`);
    $('.ReserveTrip').show();
    $('#reservationForm').off();

    $('#reservationForm').submit(function(event) {

      // let name = $(this).attr('name');
      // let email = $(this).attr('email')

      let reservationDetails = {
        name: $('#travellerName').val(),
        email: $('#travellerEmail').val(),
      };

      event.preventDefault();

      reserveTrip(detail.id, reservationDetails);
    });
  })

  .catch((error) => {
    reportStatus(`Error: ${error.message }`);
  });
}

$(document).ready(() => {
  $('#seetrips').click(loadTrips);
  $('#showtrips').on( 'click', 'td', function(event) {
    let id = $(this).attr('id');
    event.preventDefault();
    loadTripDetails(id);
  });
  // #when do I put the event listener?
});
