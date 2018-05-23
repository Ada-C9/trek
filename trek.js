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
const loadTreks = () => {
  reportStatus('Loading trips...');

  const trekList = $('#trek-list');
  trekList.empty();

  axios.get(URL)

  .then((response) => {
    console.log(response)

    reportStatus(`Successfully loaded ${response.data.length} trips!`);
    trekList.html('<h4>All Trips</h4>')
    response.data.forEach((trip) => {
      trekList.append(`<li><a href=${trip.name}></a></li>`);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
    console.log(error);
  });
};



// Show ONE Trip
const displayTrek = (event) => {

  const trekList = $('trek-list');

  axios.get(URL + id)

  .then((response) => {

    console.log('whaatttt');
    console.log(response);

    const result = response.data

    if(result) {

      trekList.html('<h4>Trip Details</h4>')
      result.forEach((trip) => {
        let html = '<li>';
        html += `<strong>${trip.name}</strong>: `;
        html += `${trip.continent}`;
        html += '</li>';

        trekList.append(html);
      })

    }

  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading seven wonders: ${error.message}`);
    console.log(error);
  })

};



$(document).ready(() => {
  $('#load').click(loadTreks);
  $('#trek-list').click(displayTrek);
});
