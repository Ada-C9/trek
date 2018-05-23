const allTripsUrl = " https://ada-backtrek-api.herokuapp.com/trips";

const singleTripUrl = "https://ada-backtrek-api.herokuapp.com/trips/";

const reserveUrl = "https://ada-backtrek-api.herokuapp.com/trips/1/reservations"

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`;
  content += '<ul>';
}

const loadTrips = function loadTrips() {
  let tripList = $('.trips');

  axios.get(allTripsUrl)
  .then((response) => {
    console.log('inside the .then');
    response.data.forEach((trip) => {
      console.log(trip);
      tripList.append(`<li><a class="trip" data-id="${trip.id}" href="#">${trip.name}</a></li>`);
    });
    reportStatus('Trips Loaded!');
  })
  .catch((error) => {
    console.log(error);
    if (error.response.data && error.response.data.errors) {
      // User our new helper method
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Error: ${error.message }`);
    }
  });
};

const getTrip = function getTrip(event) {
  // id, name, continent, about, category, weeks and cost
  // params to get id ???
  console.log(event);
  event.preventDefault();

  axios.get(singleTripUrl + $(this).data("id"))
  .then((response) => {
    $('#details').empty().append(`<h2>${response.data.name}</h2><h3>${response.data.continent}</h3><p>${response.data.about}</p><p>Category of trip: ${response.data.category}</p><p>Duration of trip: ${response.data.weeks}</p><p>$${response.data.cost}</p>`);
    reportStatus('Trips Loaded!');
  });
}

const FORM_FIELDS = ['name'];
// below has the name attribute given to the input tag in the html form
const inputField = name => $(`#trip-form input[name="${name}"]`);

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };
  const formData = {};
  // There is currently only one form field
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

const reserveTrip = (event) => {

  event.preventDefault();

  const reserveData = readFormData()
  console.log(reserveData);

  axios.post(reserveUrl, reserveData)
    .then((response) => {
      reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
      clearForm();
    })
//     .catch(() => {
//
    // })
};

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('.trips').on('click', '.trip', getTrip);
  $('#trip-form').submit(reserveTrip);

});
