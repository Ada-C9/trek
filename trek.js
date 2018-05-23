const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

//
// Status Management
//
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

//
// Loading Trips
//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trips-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

const individualTrip = (id) => {
  console.log(this.id);
  reportStatus("Loading trip details...");

  const trip = $('#trip');
  trip.empty();

  let urlTrip = URL + id;
  axios.get(urlTrip)
  .then((response) => {

    reportStatus(`Successfully loaded trip to: ${response.data.name}`);

    trip.append(
      `<tr><th>${response.data.name}</th></tr>
      <tr><th>${response.data.continent} weeks</th></tr>
      <tr><th>Category</th><td>${response.data.category}</td></tr>
      <tr><th>Continent</th><td>${response.data.weeks}</td></tr>
      <tr><th>Cost</th><td>${response.data.cost}</td></tr>
      <tr><th>About</th><td>${response.data.about}</td></tr>
      `
    );
    trip.append(
      `<section class="new-reservation">
        <h1>Reservation</h1>
        <form id="trip-form">
          <div>
            <label for="name">Name</label>
            <input type="text" name="name" />
          </div>

          <div>
            <label for="email">Email</label>
            <input type="text" name="email" />
          </div>

          <input type="submit" name="add-reservation" value="Add Reservation" />
        </form>
      </section>`
    );
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading this trip: ${error.message}`);
    console.log(error);
  });
};

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
}

const createReservation = (event) => {

  event.preventDefault();

  const reservationData = readFormData();
  console.log(reservationData);

  reportStatus('Doing your reservation...');

  let urlReservation = 'urlTrip + /reservations'
  axios.post(urlReservation)
  .then((response) => {
    reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
    clearForm();
  })
  .catch((error) => {
    console.log(error.response);
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
  $('#load').click(loadTrips);
  $(`#trips-list`).on(`click`, `li`, function(){
    individualTrip(this.id);
  });
  $('#reservation-form').submit(createReservation);

});
