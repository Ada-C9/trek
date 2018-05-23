
const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

// GET TRIPS LIST
const loadTrips = () => {
  // const tripList = ;
  // tripList.empty()

  reportStatus('Loading Trips! Please Wait...');

  axios.get(URL)
  .then((response) => {
    response.data.forEach((adventure) => {
      $('#trips-list').append(`<li id="${adventure.id}">${adventure.name}</li>`);
      reportStatus('Trips Loaded!')
    })
  })
  .catch((error) => {
    console.log(error);
      reportStatus(`Error: ${error.message}`)
  })
}

// SELECT/SEE TRIP INFO
const getTrip = (id) => {
  let url = URL + '/' + id
  const chosenTrip = $('#chosen-trip');
  chosenTrip.empty()
  const reservedTrip = $('#trip-id');
  reservedTrip.empty()

  axios.get(url)
  .then((response) => {
    console.log(response)
    chosenTrip.append(`<h1>${response.data.name}</h1><p>Continent: ${response.data.continent}</p><p>About: ${response.data.about}</p><p>Weeks: ${response.data.weeks}</p><p>Cost: $${response.data.cost}</p>`);

    reservedTrip.append(`<input type="hidden" name="trip_id" value="${response.data.id}" />`)

    reportStatus('Trip Loaded!')
    $('#additionals').removeClass(['hidden'])
  })
  .catch((error) => {
    console.log(error);
      reportStatus(`Error: ${error.message}`)
  })
}

// RESERVE TRIP
const FORM_FIELDS = ['name', 'email', 'trip_id'];
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

const reserveTrip = (event) => {
  event.preventDefault();
  console.log(event);
  const tripData = readFormData()
  console.log(tripData);
  let url = URL + '/' + tripData.trip_id + '/reservations'


  axios.post(url, tripData)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully reserved trip for ${response.data.name}!`);
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

}



// ENACT
$(document).ready(() => {
  $('#load').click(loadTrips);
  $('body').delegate( 'li', 'click', function() {
    console.log(this.id)
    getTrip(this.id)
  });
  $('#trip-form').submit(reserveTrip)
})
