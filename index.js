const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

// Report Status and Errors to User
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
      tripList.append(`<li>${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Error loading trips: ${error.message}`);
    console.log(error);
  });

};


$(document).ready(() => {
  $('#load').click(loadTrips);
});
