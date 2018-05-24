const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

// Load trips
const loadTrips = () => {
  const tripsList = $('#tbody');
  tripsList.empty();

  reportStatus('Loading trips! Please wait...');

  axios.get(URL)
  .then((response) => {
      $('#table').show();
      response.data.forEach((trip) => {
        tripsList.append(`<tr><td>${trip.id}</td>
        <td>${trip.name}</td></tr>`);
      });
      reportStatus('Trips Loaded!');
    })
    .catch((error) => {
      reportStatus('Error: ${error.message}');
    });
};

  // Load one trip

const loadTrip = (id) => {
  const tripInfo = $('#trip-info');
  tripInfo.empty();

  reportStatus('Loading trip info! Please wait...');

    // get trip details from API

  axios.get(URL + `/${id}`)
  .then((response) => {
      $('#details').show();
      tripInfo.append(`<tr><td><strong>Name: </strong> ${response.data.name}</td></tr>
        <tr><td><strong>Trip ID: </strong>${response.data.id}</td></tr>
        <tr><td><strong>Continent: </strong>${response.data.continent}</td></tr>
        <tr><td><strong>Category: </strong>${response.data.category}</td></tr>
        <tr><td><strong>Weeks: </strong>${response.data.weeks}</td></tr>
        <tr><td><strong>Cost: </strong>${response.data.cost}</td></tr>
        <tr><td><strong>About: </strong></br>${response.data.about}</td></tr>`);
      reportStatus('Trip Info Loaded!');
    })
    .catch((error) => {
      reportStatus('Error: ${error.message}');
    });
};

$(document).ready(() => {
      $('#load').click(loadTrips);
      $('#tbody').on('click', 'td', function () {
          let id = $(this).attr('id');
          loadTrip(id);
        });

      // $('#trip-form').submit(createTrip)
    });
