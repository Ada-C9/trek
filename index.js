const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const tripList = $('#tbody');
  tripList.empty();
  reportStatus('Loading Trips! Please wait...')
  axios.get(URL)
  .then((response) => {
    $("#table").show();
    response.data.forEach((trip) => {
      tripList.append(`<tr><td id='${trip.id}'>${trip.name}</td></tr>`);
    })
    reportStatus('Trips Loaded!')
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`)
  });
}

const loadTrip = function loadTrip(tripID) {
  const tripInfo = $('#detailBody');
  const tripId = $('#trip-name');
  tripInfo.empty();
  tripId.empty();
  reportStatus('Loading Trip! Please wait...')
  axios.get(`${URL}/${tripID}`)
  .then((response) => {
    $("#trip-info").show();
    tripInfo.append(`<tr><td>Name: ${response.data.name}</td></tr><tr><td>Trip ID: ${response.data.id}</td></tr><tr><td>Continent: ${response.data.continent}</td></tr><tr><td>Category: ${response.data.category}</td></tr><tr><td>Weeks: ${response.data.weeks}</td></tr><tr><td>Cost: ${response.data.cost}</td></tr><tr><td>About:</br> ${response.data.about}</td></tr>`);
    tripId.append(`<span id="${response.data.id}">Name: ${response.data.name}</span>`);
    reportStatus(`Trip ${response.data.name} loaded!`)
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`)
  });
}

const FORM_FIELDS = ['name', 'email']
const inputField = name => $(`#reservation-form input[name="${name}"]`);
const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input? input : undefined;
  };
  const formData = {};
  FORM_FIELDS.forEach((field) => {
    formData[field] = getInput(field);
  });
  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}
const createReservation = (event) => {
  event.preventDefault();
  const reservationData = readFormData();
  reservationData['trip_id'] = $('#trip-name').children("span").attr("id");
  console.log(reservationData);
  // reportStatus('Sending trip data...');
  let tId = $('#trip-name').children("span").attr("id");
  axios.post(`${URL}/${tId}/reservations`, reservationData)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully created reservation for ${response.data.name}`);
  })
  .catch((error) => {
    console.log(error.response);
    reportStatus(`Encountered an error: ${error.message}`)
  });
  clearForm();
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#tbody').on('click', 'td', function(event) {
    loadTrip(event.target.id)
  });
  $('#reservation-form').submit(createReservation);
})
