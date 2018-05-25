const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

// LOAD TRIPS
const loadTrips = () => {
  const tripsList = $('#tbody');
  tripsList.empty();

  reportStatus('Loading trips! Please wait...');

  axios.get(URL)
  .then((response) => {
    $('#table').show();
    response.data.forEach((trip) => {
      tripsList.append(`<tr id="${trip.id}"><td>${trip.id}</td>
      <td>${trip.name}</td></tr>`);
    });
    reportStatus('Trips Loaded!');
  })
  .catch((error) => {
    reportStatus('Error: ${error.message}');
  });
};

// LOAD ONE TRIP

const loadTrip = (id) => {
  const tripInfo = $('#trip-info');
  tripInfo.empty();
  const reservationForm = $('#reservation-form');
  reservationForm.empty();

  reportStatus('Loading trip info! Please wait...');

  // GET TRIP DETAILS FROM API

  axios.get(URL + `/${id}`)
  .then((response) => {
    // console.log(response);
    $('#details').show();
    tripInfo.append(`<tr><td><strong>Name: </strong>     ${response.data.name}</td></tr>
      <tr><td><strong>Trip ID: </strong>${response.data.id}</td></tr>
      <tr><td><strong>Continent: </strong>${response.data.continent}</td></tr>
      <tr><td><strong>Category: </strong>${response.data.category}</td></tr>
      <tr><td><strong>Weeks: </strong>${response.data.weeks}</td></tr>
      <tr><td><strong>Cost: </strong>${response.data.cost}</td></tr>
      <tr><td><strong>About: </strong></br>${response.data.about}</td></tr>`);
      reportStatus('Trip Info Loaded!');
      reservationForm.append(`<div >
        <label for="name">Trip:${response.data.name}</label>
      </div>`);
      reservationForm.append(`<div>
          <label for="name">Name: </label>
          <input type="text" name="name" />
        </div>
        <div>
          <label for="email">Email: </label>
          <input type="text" name="email" />
        </div>
        <div class="submit-container">
          <input type="submit" name="add-reservation" value="Reserve" class="submit" id="reserve${response.data.id}"/>
        </div>`);

    })
    .catch((error) => {
      reportStatus('Error: ${error.message}');
    });
};

// RESERVE TRIP HELPERS

const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#reservation-form input[name="${name}"]`);

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
};

const clearForm = () => {
    FORM_FIELDS.forEach((field) => {
      inputField(field).val('');
    });
};


  //RESERVE TRIP

const reserveTrip = (event, id) => {
  console.log(id);
    event.preventDefault();
    console.log(event);
    const tripData = readFormData();
    console.log(tripData);


    axios.get(URL + `/${id}/reservations`)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully reserved trip for ${response.data.name}!`);
      clearForm(FORM_FIELDS);
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportStatus(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      }
    });
  }

// ACTION
$(document).ready(() => {
    $('#load').click(loadTrips);
    $('#tbody').on('click', 'tr', function () {
      let id = $(this).attr('id');
      loadTrip(id);
    });

    $('#reservation-form').on('click', '.submit', function () {
      let id = $(this).attr('id').substr(7);
      console.log(id);
      reserveTrip(id);
    });
  });
