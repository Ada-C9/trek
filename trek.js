const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

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


const loadTreks = () => {
  reportStatus('Loading treks...');

  const trekList = $('#trek-list');
  trekList.empty();

  axios.get(URL)

  .then((response) => {
    console.log(response)

    reportStatus(`Successfully loaded ${response.data.length} treks`);
    trekList.html('<h4>All Trips</h4>')
    response.data.forEach((trek) => {
      trekList.append(`<li>${trek.name}</li>`);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
    console.log(error);
  });
};

$(document).ready(() => {
  $('#load').click(loadTreks);
});
