const URL = 'https://ada-backtrek-api.herokuapp.com/trips'


const reportStatus = (message) => {
  $('status-message').html(message);
};

const reportError = (message, errors) =>{
  let content = `<p>${message}</p><ul>`;
  for (const field in errors){
    for (const problem of errors[field]){
      content += `<li>${field}: ${problem}</li>;`
    }
  }

  content += "</ul>";
  reportStatus(content);
};

const loadTrips = () => {
  reportStatus('Loading trips ...');


  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded`);
    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
    reportError(error.message, error.response.data.errors)
    console.log(error);

  });
};

$(document).ready(() => {
  $('#load').click(loadTrips);

});
