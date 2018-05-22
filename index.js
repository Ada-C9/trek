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

const url = 'https://ada-backtrek-api.herokuapp.com/trips'

const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(url)
    .then((response) => {
      reportStatus(`Successfully loaded trips`);
      let results = response.data
      results.forEach((result) => {
        let html = '<li>';
        html += `<strong>ID: ${result.id}</strong>`;
        html += ` Trip: ${result.name}`;
        html += ` Continent: ${result.continent}`;
        html += ` Price: $${result.cost}`;
        html += `</li><br></br>`;
        tripList.append(html)
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    })
};



$(document).ready(() => {
  $('#load').click(loadTrips());
});
