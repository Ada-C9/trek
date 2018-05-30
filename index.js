const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

const reportStatus = (message) => {
  $('#status-message').html(message).removeClass("hidden");
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

// Loading Trips
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list').removeClass("hidden");
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);

    response.data.forEach((trip) => {
      let item = $(`<li>${trip.name}</li>`);
      item.click(function() {
        $("section").removeClass("hidden")
        getTripData(trip.id);
        // showReservationForm(trip.id);
        $('#submit-button').off('click');
        $('#submit-button').click(function(event) {
          createRes(event, trip.id);
        });
      });
      tripList.append(item);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading the trips: ${error.message}`);
    console.log(error);
  });

}; // end of load Trips



const getTripData = (trip_id) => {
  const tripDetails = $(`#trip-details`).removeClass("hidden");
  tripDetails.empty();
  let tripURL = URL + trip_id;

  axios.get(tripURL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded trip details for: ${response.data.name}`);
    tripDetails.append(
      `<li><strong>Trip Name: ${response.data.name}</strong></li>
      <li>Travel Category: ${response.data.category}</li>
      <li>Continent: ${response.data.continent}</li>
      <li>Cost: $${response.data.cost}</li>
      <li>Week(s) of Travel: ${response.data.weeks}</li>`);
    })
  .catch((error) => {
      reportStatus(`Encountered an error while trying to load the trip: ${error.message}`);
      console.log(error);
  });
  }

  // reservation form:
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

  //
  const createRes = (event, trip_id) => {
    event.preventDefault();

    const resData = readFormData();
    console.log(resData);
    reportStatus('Sending reservation data...');

    let resURL = URL + trip_id + '/reservations';
    console.log(resURL)
    axios.post(resURL, resData)
    .then((response) => {
      reportStatus(`Successfully added a new reservation for ${response.data.name}!`);
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
  });
