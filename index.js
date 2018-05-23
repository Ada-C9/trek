const URL = 'https://ada-backtrek-api.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message)
}

const loadTrips = (event) => {
  $('.all-trips').removeClass('display-none');

  const tripList = $('#trip-list');
  tripList.empty(); // empty out the list each time so there aren't duplilcates

  reportStatus('Loading trips! Please wait...')

  // get info
  axios.get(URL) // returns a promise
    .then((response) => {
      response.data.forEach((trip) => {
        // console.log(response.data);
        tripList.append(`<p>${trip.name}<span>${trip.id}</span></p>`);
      });
      reportStatus('Trips loaded!')
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`${error.message}`)
    });
}

const loadDetails = function(event) {
  const tripDetails = $('#details');
  const tripResNum = $('#trip-reservation-num')
  tripDetails.empty();
  tripResNum.empty();

  let trip = $(this).find('span').html()

  $('.trip-details').removeClass('display-none');

  reportStatus('Loading trip details! Please wait...')

  // get details
  axios.get(`${URL}\\${trip}`) // returns a promise
    .then((response) => {
      console.log(response.data);
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
        `<p>${tripData.name}<span>${tripData.id}</span></p>`
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

  const tripID = $(`#trip-reservation-num`).find('span').html();

  const tripData = readFormData();
  console.log(tripData);

  reportStatus('Making reservation...');

  axios.post(`${URL}\\${tripID}\\reservations`, tripData)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully made a reservation!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      // if (error.response.data && error.response.data.errors) {
      //   reportError(
      //     `Encountered an error: ${error.message}`,
      //     error.response.data.errors
      //   );
      // } else {
        reportStatus(`Encountered an error: ${error.message}`);
      // }
    });
};

$(document).ready(() => {
  $('#trips-button').click(loadTrips);
  $('#trip-list').on('click', 'p', loadDetails);
  $('#reserve-form').submit(reserveTrip);
});
