let URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<span>${message}</span>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `${field}: ${problem}, `;
    }
  }
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

      tripList.append(`<li><a id=${trip.id} href=${link}>${trip.name}</li>`);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
}; //end loadTrips

const loadDetails = (link, tripID) => {
  reportStatus('Loading Details...');
  console.log(link);


  axios.get(link)

  .then((response) => {
    reportStatus(`Successfully loaded ${this.name} details!`);

    // tripDetails.empty();
    let tripDetails = "";
    for (let detail in response.data) {

      tripDetails += `<p>${detail}: ${response.data[detail]} </p>`;
    }

    $('#trip-details').html(tripDetails);
    $('#reserve-form').removeClass();
    $('#reserve-form').addClass(tripID);
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

  const tripData = readFormData();
  console.log(tripData);

  reportStatus('Sending trip data...');

  let link = `${URL}/${$('#reserve-form').attr('class')}/reservations`;

  axios.post(link, tripData)

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
    event.preventDefault();
    let tripID = event.target.id;
    loadDetails(this.href, tripID);
  });

    $('#reserve-form').submit(reserveTrip);

});
