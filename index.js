const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

// Status Management
const reportStatus = (message) => {
  $('#display-status').html(message);
};

// Load Trips

const loadTrips = () => {
  reportStatus('Loading trips');

  const trips = $('#all-trips');
  trips.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips.`);
    response.data.forEach((trip) => {
      trips.append(`<li>${trip.name}</li>`);
      trips.append(`<span>${trip.id}</span>`);
      $('span').hide();
    });
  })
  .catch((error) => {
    reportStatus(`There was a problem loading trips: ${error.message}`);
    console.log(error);
  });
};

const loadTrip = (id) => {
  reportStatus(`Loading trip ${id}`);

  const trip = $('#trip');
  trip.empty();

  axios.get(URL + '/' + id)
  .then((response) => {
    if (response.status == 200) {
      reportStatus(`Successfully loaded trip ${id}.`);
      let data = response.data;
      $('#trip').append(`
        <h3>Name: ${data.name}</h3>
        <div>
        <p><strong>Continent: </strong>${data.continent}</p>
        <p><strong>Category: </strong>${data.category}</p>
        <p><strong>Weeks: </strong>${data.weeks}</p>
        <p><strong>Cost: </strong>$${data.cost}</p>
        <p><strong>About: </strong><p>${data.about}</p>
        </div>
      `);
      $('#trip').append(`<span>${id}</span>`);
      $('span').hide();
    } else {
      reportStatus(`There was a problem loading the trip: ${response.statusText}.`);
    }
  })
  .catch((error) => {
    reportStatus(`There was a problem loading the trip: ${error.message}`);
    console.log(error);
  });
};

// Reserve Trip

const reserveTrip = (event) => {
  event.preventDefault();
  const tripId = $('#trip span').text();
  const reservationUrl = URL + '/' + tripId + '/reservations';
  const reservationData = {
    id: tripId,
    name: 'Jane Doe',
    email: 'example@example.com'
  };
  reportStatus(`Reserving trip ${tripId}`);

  axios.post(reservationUrl, reservationData)
  .then((response) => {
    reportStatus(`Successfully reserved trip ${tripId}`);
    console.log(response);
  })
  .catch();

};

// Document Ready

$(document).ready(() => {
  $('#display-trips').click(() => {
    loadTrips();
  });
  $('ul').on('click', 'li', function() {
    let tripId = $(this).next().text();
    loadTrip(tripId);
    $('#reservation').show();
  });
  $('#reservation-form').submit(reserveTrip);
});
