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


// Load ALL Trips
const loadTrips = () => {
  reportStatus('Loading trips...');

  const trekList = $('#trek-list');
  trekList.empty();

  axios.get(URL)

  .then((response) => {
    console.log(response)

    reportStatus(`Successfully loaded ${response.data.length} trips!`);
    trekList.html('<h4>All Trips</h4>')
    response.data.forEach((trip) => {
      let listTrip = $(`<li><a href=#>${trip.name}</a></li>`);

      trekList.append(listTrip);

      listTrip.click(() => {
        displayTrek(trip);
      });
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};


// Show one trip's detail
const displayTrek = (trip) => {

  const trekList = $('#trek-detail');

  axios.get(URL + trip.id)

  .then((response) => {

    console.log(response);

    if(response) {

      trekList.html('<h4>Trip Details</h4>')
      let html = '<li>';
        html += `Name: <strong>${trip.name}</strong></li>`,
        html += `<li>Continent: ${trip.continent}</li>`,
        html += `<li>Category: ${trip.category}</li>`,
        html += `<li>Weeks: ${trip.weeks}</li>`,
        html += `<li>Cost: ${trip.cost}</li>`,
        html += `<li>About: ${trip.about}</li>`,

      trekList.append(html);
    }

  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trip's details: ${error.message}`);
    console.log(error);
  })

};



$(document).ready(() => {
  $('#load').click(loadTrips);
});
