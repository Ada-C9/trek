const URL = 'https://ada-backtrek-api.herokuapp.com/trips/'


const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors){
    for (const problem of errors[field]){
      content += `<li>${field}: ${problem}</li>;`
    }
  }

  content += "</ul>";
  reportStatus(content);
};

const loadTrips = () => {
  reportStatus('Loading trips ...');


  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded`);
    response.data.forEach((trip) => {

      let id = trip.id

      tripList.append(`<li class="trip" id="${id}">${trip.name}</li>`);


    });
    //only returns one element

  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    reportError(error.message, error.response.data.errors)
    console.log(error);

  });

};

const clickTrip = (trip) => {
  console.log(trip)

  axios.get(URL+trip)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded`);

    console.log('appending to table body');

    $('#tablebody').append(`<p>Name: ${response.data.name}</p>`);
    $('#tablebody').append(`<p>Id: ${response.data.id}</p>`); $('#tablebody').append(`<p>Continent: ${response.data.continent}</p>`);  $('#tablebody').append(`<p>About: ${response.data.about}</p>`);
    $('#tablebody').append(`<p>Category: ${response.data.category}</p>`);
    $('#tablebody').append(`<p>Week: ${response.data.weeks}</p>`);
    $('#tablebody').append(`<p>Cost: ${response.data.cost}</p>`);



  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    reportError(error.message, error.response.data.errors)
    console.log(error);

  });

};

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
    console.log('formData')
  });

  console.log(formData)
  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}

const createReservation = (id) => {

  const tripData = readFormData();
  console.log(tripData);

  reportStatus('Sending trip data...');

  let url = URL + id + '/reservations'

  axios.post(url, tripData)
  .then((response) => {
    console.log('success')
    reportStatus(`Successfully made a reservation for ${response.data.name}!`);
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
  $('ul').on('click', 'li', function() {
    console.log(this.id)
    clickTrip(this.id)
    $('#reserve-form').submit((event) => {
      event.preventDefault();
      createReservation(this.id);
    })
  });
});
