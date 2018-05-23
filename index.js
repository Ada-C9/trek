const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

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

// Loading Trips
//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);

    response.data.forEach((trip) => {
      let item = $(`<li>${trip.name}</li>`);
      item.click(function() {
        getTripData(trip.id);
      });
      tripList.append(item);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading the trips: ${error.message}`);
    console.log(error);
  });

}; // end of load Trips

const getTripData = (trip_id) => {
  const tripDetails = $(`#trip-details`);
  tripDetails.empty();
  let tripURL = URL + trip_id;

  axios.get(tripURL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded trip details for: ${response.data.name}`);
    tripDetails.append(
      `<li><strong>Trip Name: ${response.data.name}</strong></li>
      <li>Travel Category: ${response.data.category}</li>
      <li>Continent: ${response.data.continent}</li>
      <li>Cost: $${response.data.cost}</li>
      <li>Weeks of Travel: ${response.data.weeks}</li>
      <li>About this Trip:</li>
      <li>${response.data.about}</li>`);
  });
}









$(document).ready(() => {
  $('#load').click(loadTrips);
});
