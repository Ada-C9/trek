const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

//
// Report Status and Errors to User
//
const reportStatus = (message) => {
  $('#status-message').html(message)
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li> ${field}: ${problem}<li>`;
    }
  }
  content += '</ul>';
  reportStatus(content)
};

//
// Load all Trips
//
const loadTrips = () => {
  reportStatus('Please wait, we\'re gathering our Trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li><a href='https://ada-backtrek-api.herokuapp.com/trips/${trip.id}'>${trip.name}</a></li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Error loading trips: ${error.message}`);
    console.log(error);
  });
};

//
// View Trip Details
//
const loadDetails = function loadDetails(event) {
  reportStatus('Loading trip data...');
  event.preventDefault();
  const tripLink = event.currentTarget.getAttribute('href');
  const tripDetails = $('#trip-details');

  axios.get(tripLink)
    .then((response) => {
      reportStatus('Trip Details successfully retrieved.');
      const trip = response.data;
      tripDetails.empty();
      tripDetails.append(
        `<ul>
        <li>Name: ${trip.name}</li>
        <li>Trip id: ${trip.id}</li>
        <li>Continent: ${trip.continent}</li>
        <li>Category: ${trip.category}</li>
        <li>Trip Length: ${trip.weeks}</li>
        <li>Price: $${trip.cost}</li>
        <li>Description: ${trip.about}</li>
        </ul>
        <button id='show-form'>Let's Go!</button>
        `
      );

    })
    .catch((error) => {
      reportStatus ( `Error loading trip: ${error.message}`);
      console.log(error);
    });
};

$(document).ready(() => {
  $('form').hide();
  $('#load').click(loadTrips);
  $('#trip-list').on('click', 'a', loadDetails);
  // $('#show-form').on('click', 'button, ')
});
