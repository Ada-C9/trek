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
      const tripItem = $(`<li>${trip.name}</li>`);
      tripList.append(tripItem);
      tripItem.click(() => {
        loadTrip(trip);
      })
      $('#hidden').show();
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

const loadTrip = (trip) => {
  reportStatus('Loading trip...');
  const tripDetails = $('#trip-details');

  axios.get(URL + trip.id)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded ${response.data.name} trip`);

    const tripItem = $(
      `<h2> Name: ${response.data.name}</h2>
      <p><strong> Continent:</strong> ${response.data.continent}</p>
      <p><strong> About:</strong> ${response.data.about}</p>
      <p><strong> Category:</strong> ${response.data.category}</p>
      <p><strong> Cost:</strong> ${response.data.weeks}</p>`);
      tripDetails.html(tripItem);

      $('#selected-name').text(response.data.name)
      $('#new-trip').show();
      $('#trip-details').show();
      $('#trip-form').submit (function (event) {
        event.preventDefault();
        reserveTrip(trip);
      })
    })

    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
  }

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

  const reserveTrip = (trip) => {

    const tripData = readFormData();
    reportStatus('Sending trip data...');

    axios.post(URL + trip.id + "/reservations", tripData)
    .then((response) => {
      reportStatus(`Successfully reserved a trip with ID ${response.data.trip_id}!`);
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
    $('#trip-details').click(loadTrip);
  });
