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
  console.log(id);
  reportStatus("Loading trip details...");
  const reserve = $('#trip-form');
  const trip = $('#trip');
  trip.empty();
  reserve.empty();

  let urlTrip = URL + id;
  axios.get(urlTrip)
  .then((response) => {

    reportStatus(`Successfully loaded trip to: ${response.data.name}`);

    trip.append(
      `
      <tr><th>Trip Details:</th></tr>
      <tr><th>${response.data.name}</th></tr>
      <tr><th>Continent</th><td>${response.data.continent}</td></tr>
      <tr><th>Category</th><td>${response.data.category}</td></tr>
      <tr><th>Cost</th><td>${response.data.cost}</td></tr>
      <tr><th>Cost</th><td>${response.data.weeks}</td></tr>
      <tr><th>About</th><td>${response.data.about}</td></tr>
      `
    );
    reserve.addClass(id);
    reserve.html(
      `<h1>Reservation</h1>
      <div>
      <label for="name">Name</label>
      <input type="text" name="name" />
      </div>

      <div>
      <label for="email">Email</label>
      <input type="text" name="email" />
      </div>

      <input type="submit" name="add-reservation" value="Add Reservation" />
      `
    );


    $('#trip-form').submit(function(event) {
      console.log(event);
      event.preventDefault();
      createReservation(urlTrip);

    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading this trip: ${error.message}`);
    console.log(error);
  });
};

const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#trip-form input[name="${name}"]`);

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

const createReservation = (urlTrip) => {

  const reservationData = readFormData();
  console.log(reservationData);

  reportStatus('Doing your reservation...');

  let urlReservation = urlTrip + '/reservations'
  axios.post(urlReservation, reservationData)

  .then((response) => {
    console.log(response);
    reportStatus(`Successfully added a reservation with ID ${response.data.trip_id}!`);
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

});
