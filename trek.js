const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

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
// Loading Trips
//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trips-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

$(`#trips-list`).on(`click`, `li`, function(){
  console.log(this.id);
  const tripId = this.id
  reportStatus("Loading trip details...");

  const trip = $('#trip');
  trip.empty();

  let urlTrip = URL + tripId;
  axios.get(urlTrip)
  .then((response) => {

     reportStatus(`Successfully loaded trip to: ${response.data.name}`);

     trip.append(
       `<tr><th>${response.data.name}</th></tr>
       <tr><th>${response.data.continent} weeks</th></tr>
       <tr><th>Category</th><td>${response.data.category}</td></tr>
       <tr><th>Continent</th><td>${response.data.weeks}</td></tr>
       <tr><th>Cost</th><td>${response.data.cost}</td></tr>
       <tr><th>About</th><td>${response.data.about}</td></tr>
       `);
  });
});




//
// OK GO!!!!!
//

$(document).ready(() => {
  $('#load').click(loadTrips);

});
