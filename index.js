let URL = 'https://ada-backtrek-api.herokuapp.com/trips';

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
  reportStatus('Loading Trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)

  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      let link = `${URL}/${trip.id}`;

      tripList.append(`<li><a href=${link}>${trip.name}</li>`);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
}; //end loadTrips

const loadDetails = (link) => {
  reportStatus('Loading Details...');
  console.log(link);

  axios.get(link)

  .then((response) => {
    reportStatus(`Successfully loaded ${this.name} details!`);
    console.log('pressed');

    // tripDetails.empty();
    let tripDetails = "";
    for (let detail in response.data) {
      console.log(detail);

      tripDetails += `<p>${detail}: ${response.data[detail]} </p>`;
    }
    $('#trip-details').html(tripDetails);
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
}; //end loadDetails

// form helpers
const FORM_FIELDS = ['name', 'age', 'email'];
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
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}

const reserveTrip = (event) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  const petData = readFormData();
  console.log(petData);

  reportStatus('Sending pet data...');

  axios.post(URL, petData)

    .then((response) => {
      reportStatus(`Successfully added a pet with ID ${response.data.id}!`);
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
  $('#search-all').click(loadTrips);

  $('#trip-list').on("click", "a",  function(event) {
    console.log($(event));
    event.preventDefault();
    loadDetails(this.href);
  });

  // $('#reserve-form').submit(reserveTrip);

});
