// CONSTANTS
const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
const reportStatus = (message) => {
  $('#status-message').html(message);
}

// GET LIST HELPER
const apiGET = (url) => {
  const chosenTrip = $('#chosen-trip');
  chosenTrip.empty()
  const reservedTrip = $('#trip-id');
  reservedTrip.empty()
  const tripList = $('#trips-list');
  tripList.empty()
  $('#additionals').addClass(['hidden'])

  reportStatus('Loading Trips! Please Wait...');

  axios.get(url)
  .then((response) => {
    response.data.forEach((adventure) => {
      tripList.append(`<li id="${adventure.id}">🏝 ${adventure.name} </li>`);
      reportStatus(`${adventure.continent} Trips Loaded!`)
    })
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`)
  })
}

// ALL TRIPS
const loadTrips = () => {
  apiGET(URL)
}

// GET ASIA
const asiaTrips = () => {
  let url = (URL + '/continent?query=Asia')
  apiGET(url)
}

// GET AFRICA
const africaTrips = () => {
  let url = (URL + '/continent?query=Africa')
  apiGET(url)
}

// GET Antartica
const antarticaTrips = () => {
  let url = (URL + '/continent?query=Antartica')
  apiGET(url)
}
// GET Australasia
const australasiaTrips = () => {
  let url = (URL + '/continent?query=Australasia')
  apiGET(url)
}
// GET EUROPE
const europeTrips = () => {
  let url = (URL + '/continent?query=Europe')
  apiGET(url)
}
// GET North America
const nAmericaTrips = () => {
  let url = (URL + '/continent?query=North%20America')
  apiGET(url)
}

// GET South America
const sAmericaTrips = () => {
  let url = (URL + '/continent?query=South%20America')
  apiGET(url)
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
    chosenTrip.append(`<h1>🏜 ${response.data.name} 🏜</h1><p>Continent: ${response.data.continent}</p><p>Weeks: ${response.data.weeks}</p><p>Cost: $${response.data.cost}</p><p>About: ${response.data.about}</p>`);

    reservedTrip.append(`<input type="hidden" name="trip_id" value="${response.data.id}" />`)

    reportStatus('Trip Loaded!')
    $('#additionals').removeClass(['hidden'])
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`)
  })
}

// RESERVE TRIP HELPERS
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


// RESERVE TRIP
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
      reportStatus(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}`);
    }
  });
}

// ACTION PLAN
$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#asia').click(asiaTrips);
  $('#africa').click(africaTrips);
  $('#antartica').click(antarticaTrips);
  $('#australasia').click(australasiaTrips);
  $('#europe').click(europeTrips);
  $('#n-amer').click(nAmericaTrips);
  $('#s-amer').click(sAmericaTrips);

  $('body').delegate( 'li', 'click', function() {
    console.log(this)
    getTrip(this.id)
  });
  $('#trip-form').submit(reserveTrip)
})
