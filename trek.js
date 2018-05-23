const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';
const dataField = ['Name', 'Continent', 'Category', 'Weeks', 'Cost', 'About'];

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

  const trekDetail = $('#trek-detail');

  axios.get(URL + trip.id)

  .then((response) => {

    console.log(response.data);

    trekDetail.html('<h4>Trip Details</h4>')
    for (let data of dataField) {
      let html = `<li><strong>${data}:</strong> ${response.data[data.toLowerCase()]}</li>`;
      trekDetail.append(html);
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
