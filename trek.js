const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

// LOAD TRIPS
const loadTrips = () => {
  const tripsList = $('#tbody');
  tripsList.empty();

  reportStatus('Loading trips! Please wait...');
  $('#table').show();

  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripsList.append(`<tr id="${trip.id}"><td>${trip.id}</td>
      <td>${trip.name}</td></tr>`);
    });
    reportStatus('Trips Loaded!');
  })
  .catch((error) => {
    reportStatus('Error: ${error.message}');
  });
};

// LOAD ONE TRIP

const loadTrip = (id) => {
  const tripInfo = $('#trip-info');
  tripInfo.empty();
  const reservationForm = $('#reservation-form');
  reservationForm.empty();

  reportStatus('Loading trip info! Please wait...');
  $('#details').show();

  // GET TRIP DETAILS FROM API

  axios.get(URL + `/${id}`)
  .then((response) => {
    // console.log(response);
    tripInfo.append(`<tr><td><strong>Name: </strong>     ${response.data.name}</td></tr>
      <tr><td><strong>Trip ID: </strong>${response.data.id}</td></tr>
      <tr><td><strong>Continent: </strong>${response.data.continent}</td></tr>
      <tr><td><strong>Category: </strong>${response.data.category}</td></tr>
      <tr><td><strong>Weeks: </strong>${response.data.weeks}</td></tr>
      <tr><td><strong>Cost: </strong>${response.data.cost}</td></tr>
      <tr><td><strong>About: </strong></br>${response.data.about}</td></tr>`);
      reportStatus('Trip Info Loaded!');
      reservationForm.append(`<div >
        <label for="name">Trip:${response.data.name}</label>
      </div>`);
      reservationForm.append(`<div>
          <label for="name">Name: </label>
          <input type="text" name="user-name" />
        </div>
        <div>
          <label for="email">Email: </label>
          <input type="text" name="email" />
        </div>
        <div class="submit-container">
          <input type="submit" name="add-reservation" value="Reserve" class="reserve" id="reserve${response.data.id}"/>
        </div>`);

    })
    .catch((error) => {
      reportStatus('Error: ${error.message}');
    });
};


  //RESERVE TRIP

  const reserveTrip = (id) => {
  reportStatus('');
  reportStatus('Reserving The Trip...');

  let userData = {
    'name': $('input[name="user-name"]').val(),
    'email': $('input[name="email"]').val()
  }

  axios.post(URL + `/${id}/reservations`, userData)
    .then((response) => {
      reportStatus(`Successfully reserved this trip with the name ${response.data.name}`);
      })
    .catch((error) => {
      reportStatus(`Encountered an error: ${error.message}`);
      });

  $('input[name="user-name"]').val('');
  $('input[name="email"]').val('');
}

// ACTION
$(document).ready(() => {
    $('#load').click(loadTrips);
    $('#tbody').on('click', 'tr', function () {
      let id = $(this).attr('id');
      loadTrip(id);
    });

    $('#reservation-form').on('click', '.reserve', function () {
      let id = $(this).attr('id').substr(7);
      reserveTrip(id);
    });
  });
