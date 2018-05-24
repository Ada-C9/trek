// CONSTANTS
const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
const reportStatus = (message) => {
  $('#status-message').html(message);
}
const reportTripStatus = (message) => {
  $('#status-message-two').html(message);
}

// ERROR HELPER
const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += "<ul>";
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportTripStatus(content);
};

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
    console.log(response);
    response.data.forEach((adventure) => {
      tripList.append(`<li id="${adventure.id}">🏝 ${adventure.name} </li>`);
      if (response.config.url === URL) {
        reportStatus('All Trips Loaded!')
      } else {
        reportStatus(`${adventure.continent} Trips Loaded`)
      }

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

const clearResForm = () => {
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
    clearResForm();
  })
  .catch((error) => {
    console.log(error.response);
    if (error.response.data && error.response.data.errors) {
      reportStatus(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    }
  });
}


// MAKE TRIP HELPERS
const tripFIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const givenField = name => $(`#new-form input[name="${name}"]`);

const readTripData = () => {
  const myInput = name => {
    const tInput = givenField(name).val();
    return tInput ? tInput : undefined;
  };

  const newTripData = {};
  tripFIELDS.forEach((field) => {
    newTripData[field] = myInput(field);
  });

  return newTripData;
};

const clearTripForm = () => {
  tripFIELDS.forEach((field) => {
    inputField(field).val('');
  });
}


// MAKE TRIP
const createTrip = (event) => {
  event.preventDefault();
  console.log(event);
  const nTripData = readTripData()
  console.log(nTripData);

  axios.post(URL, nTripData)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully created new trip: ${response.data.name}!`);
    clearTripForm();
    $('#tripModal').css('display','none');
  })
  .catch((error) => {
    console.log(error.response);
    if (error.response.data && error.response.data.errors) {
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    }
  });
}


// ACTION PLAN
$(document).ready(() => {
  // load trips
  $('#load').click(loadTrips);
  $('#asia').click(asiaTrips);
  $('#africa').click(africaTrips);
  $('#antartica').click(antarticaTrips);
  $('#australasia').click(australasiaTrips);
  $('#europe').click(europeTrips);
  $('#n-amer').click(nAmericaTrips);
  $('#s-amer').click(sAmericaTrips);

  //get details for a trip
  $('body').delegate( 'li', 'click', function() {
    console.log(this)
    getTrip(this.id)
  });

  // submit forms
  $('#trip-form').submit(reserveTrip)
  $('#new-form').submit(createTrip)

  // open the modal
  $('#create-trip').click(function() {
      $('#tripModal').css('display','block');
  })

  // close the modal
  $('#close').click(function() {
      $('#tripModal').css('display','none');
  })

  // doesn't currently close modal
  $(document).click(function(event) {
    if (!$(event.target).closest('#tripModal,#create-trip')) {
          $("#tripModal").css('display','none');
      }
    // console.log(event);
  })
});
