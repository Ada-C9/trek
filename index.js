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

const loadtrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li trip-id="${trip.id}"><a>${trip.name}</a></li>`);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

};

const viewTrip = (id) => {
  reportStatus('Loading trip...');

  const tripDetail = $('#trip-details');
  tripDetail.empty();

  axios.get(URL + '/' + id)
  .then((response) => {
    reportStatus(`Successfully loaded trip #${id}`);
    let trip = response.data;
    let tripDetails = `
    <p> Id: ${trip.id} </p>
    <p> Name: ${trip.name} </p>
    <p> Continent: ${trip.continent} </p>
    <p> About: ${trip.about} </p>
    <p> Category: ${trip.category} </p>
    <p> Duration: ${trip.weeks} weeks</p>
    <p> Cost: ${trip.cost} </p>`;
    $('#trip-details').append(tripDetails);
  })
};


$(document).ready(() => {
  $('#load').click(loadtrips);
  $('ul').on('click', 'li', function() {
    let tripID = $(this).attr('trip-id');
    viewTrip(tripID);
    $('#tripLocation').show();
  });

  // $('#trip-form').submit(createTrip);

});
