// Constant API url
const URL = 'https://ada-backtrek-api.herokuapp.com/trips'

// Status Message Handling
const reportStatus = (message) => {
  $('.status-message').html(message)
}

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<p>${field}: ${problem}</p>`;
    }
  }
  reportStatus(content);
};

// Load All Trips
const loadTrips = (event) => {
  $('.all-trips').removeClass('display-none');

  const tripList = $('#trip-list');
  tripList.empty(); // empty out the list each time so there aren't duplilcates

  reportStatus('Loading trips! Please wait...')

  axios.get(URL) // returns a promise
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<p id="${trip.id}">${trip.name}</p>`);
      });
      reportStatus('Trips loaded!')
    })
    .catch((error) => {
      reportStatus(`${error.message}`)
    });
}

// Load Trip Details
const loadDetails = function(event) {
  const tripDetails = $('#details');
  const tripResNum = $('#trip-reservation-num')
  tripDetails.empty();
  tripResNum.empty();

  let trip = event.target.id

  $('.details').removeClass('display-none');
  $('.reserve-form').removeClass('display-none');

  $('input').removeClass('highlight') // removes and previous error outlining from form

  $('#reservation-status').html('');
  $('#reservation-status').removeClass('status-message'); // removes previous reservation status if new trip selected

  reportStatus('Loading trip details! Please wait...')

  axios.get(`${URL}\\${trip}`) // returns a promise
    .then((response) => {
      let tripData = response.data
      tripDetails.append(
        `<h2>Trip Details</h2>
        <h3>Name: ${tripData.name}</h3>
        <p>Continent: ${tripData.continent}</p>
        <p>Category: ${tripData.category}</p>
        <p>Weeks: ${tripData.weeks}</p>
        <p>Cost: ${tripData.cost}</p>
        <p>About: <br/> ${tripData.about}</p>`);

      tripResNum.append(
        `<p id="${tripData.id}">${tripData.name}</p>`
      );

      reportStatus('Trip details loaded!')
    })

    .catch((error) => {
      console.log(error);
      reportStatus(`${error.message}`)
    });

}

// Reserve Trip
const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#reserve-form input[name="${name}"]`);

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };

  const formData = {};
  FORM_FIELDS.forEach((field) => {
    formData[field] = getInput(field);
  });

  return formData;
}

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}

const reserveTrip = (event) => {
  event.preventDefault();

  $('p:first-of-type').removeClass('status-message');
  $('#reservation-status').addClass('status-message');

  const tripID = $('#trip-reservation-num p').attr('id');
  const tripData = readFormData();

  reportStatus('Making reservation...');

  axios.post(`${URL}\\${tripID}\\reservations`, tripData)
    .then((response) => {
      $('input').removeClass('highlight')
      reportStatus(`Successfully made a reservation!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);

      $('#reserve-form input').addClass('highlight')

      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
};

$(document).ready(() => {
  $('#trips-button').click(loadTrips);
  $('#trip-list').on('click', 'p', loadDetails);
  $('#reserve-form').submit(reserveTrip);
});
