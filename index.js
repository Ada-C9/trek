const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

//
// Status Management
//
const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

//
// Loading All Trips
//
const loadTrips = () => {
  reportStatus('One sec! Loading trips...');

  // const tripList = $('#trip-list');
  const tripList = $('#trip-table');
  tripList.empty();

  axios.get(URL)
    // .then((response) => {
    //   reportStatus(`Successfully loaded ${response.data.length} trips`);
    //   response.data.forEach((trip) => {
    //     tripList.append(`<li>${trip.name}</li>`);
    //   });
    // })
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<tr><td>${trip.name}</tr></td>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
 };

$(document).ready(() => {
  $('#load-all-trips').click(loadTrips);
  //$('#pet-form').submit(createPet);
});
