// url to retrieve all trips
const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('status-message').html(message);
}

const loadTrips = () => {
  reportStatus('Loading Trips! Thank you for waiting...');

  $('.main-display').removeClass('hidden');

  const tripList = $('#trip-list');
  tripList.empty();

  // get request to API
  axios.get(URL)
    // success vv
    .then((response) => {
      console.log(response);
      console.log('list item');
      response.data.forEach((trip) => {
        let item = $(`<li>${trip.name}</li>`);
        item.click(function() {
          getTripData(trip.id);
          $('#trip-details').removeClass('hidden');
          $('.reservations-form').removeClass('hidden');
        });
        tripList.append(item);
      });
    reportStatus('Trips Loaded');
    })
    // fail vv
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
}

const getTripData = (trip_id) => {
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  let tripURL =  'https://ada-backtrek-api.herokuapp.com/trips/' + trip_id;
  axios.get(tripURL)
  .then((response) => {
    console.log(response);
    reportStatus(`Trip ${response.data.name} Loaded`);

    tripDetails.append(`
      <li>Trip: ${response.data.name}</li>
      <li> Travel Category: ${response.data.category}</li>
      <li> Continent: ${response.data.continent}</li>
      <li> Cost: ${response.data.cost}</li>
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
  reservationFromFields.forEach((field) => {
    formData[field] = getInput(field);
  });

  return formData;
};

const clearForm = () => {
  reservationFromFields.forEach((field) => {
    inputField(field).val('');
  });
}



$(document).ready(() => {
  $('#load').click(loadTrips);
})
