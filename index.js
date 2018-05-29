const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message).removeClass('hidden');
}

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
  reportStatus('Loading Trips! Thank you for waiting...');

  $('.main-display').removeClass('hidden');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    // if api call is successful
    .then((response) => {
      // console.log(response);
      // console.log('list item');
      response.data.forEach((trip) => {
        let item = generateTrip(trip);
        tripList.append(item);
      });
    reportStatus('Trips Loaded');
    })
    // if api call fails
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
}

const generateTrip = (trip) => {
  let item = $(`<li>${trip.name}</li>`);
  item.click(function() {
    getTripData(trip.id);
    $('#trip-details').removeClass('hidden');
    $('.reservations-form').removeClass('hidden');

    // $('#submit-button').off('click');
    $('#submit-button').click(function(event) {
      createReservation(event, trip.id);
    });

  });
  return item;
}

const getTripData = (trip_id) => {
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  let tripURL = URL + '/' + trip_id;
  axios.get(tripURL)
  .then((response) => {
    console.log(response);
    reportStatus(`Trip ${response.data.name} Loaded`);

    tripDetails.append(`
      <li><h3>Trip: ${response.data.name}</h3></li>
      <li> Travel Category: ${response.data.category}</li>
      <li> Continent: ${response.data.continent}</li>
      <li> Cost: $${response.data.cost}</li>
      <li> Trip Length: ${response.data.weeks} weeks</li>
      `)
      // <li>${response.data.about}</li>
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
  })
}

// RESERVATION FORM
  const reservationFormFields = ['name', 'age', 'email']

  const inputField = name => $(`#reservation-form input[name="${name}"]`);

  const readFormData = () => {
    const getInput = name => {
      const input = inputField(name).val();
      return input ? input : undefined;
    };

    const formData = {};
    reservationFormFields.forEach((field) => {
      formData[field] = getInput(field);
    });

    return formData;
  };

  const clearForm = () => {
    reservationFormFields.forEach((field) => {
      inputField(field).val('');
    });
  }

  const createReservation = (event, trip_id) => {

    event.preventDefault();

    const reservationData = readFormData();
    console.log(reservationData);

    reportStatus('Sending reservation data...');

    let tripURL = URL + '/' + trip_id + '/' + 'reservations';
    console.log(tripURL)
    axios.post(tripURL, reservationData)
      .then((response) => {
        reportStatus(`Successfully added a reservation for: ${response.data.name}!`);
        clearForm();
      })

      .catch((error) => {
        console.log(error.response);
        if (error.response.data && error.response.data.errors) {
          reportStatus(
            `Encountered an error: ${error.message}`,
            error.response.data.errors
          );
        } else {
          reportStatus(`Encountered an error: ${error.message}`);
        }
      });
  };

//waits for HTLM to be fully loaded before executing javascript
$(document).ready(() => {
  //Looks for id load, when event handler click (see all trips button) is clicked loadTrips function is invoked
  $('#load').click(loadTrips);
})
