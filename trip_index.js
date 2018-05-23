let numTrips = 0;
const URL = "https://ada-backtrek-api.herokuapp.com/trips"

// Show me all of the trips Available
const loadTrips = () => {
  reportStatus('Loading trip...');

  // Setting up trip table that will correspond to the table with the given id in HTML and it empties out at the beginning
  const tripsList = $('#trips-table');
  tripsList.empty();

  // GET request time
  axios.get(URL)
  // if the request is successful do the below bit
  // this should build in our table body and headers
  .then((response) => {
    // tracking the number of trips loaded and reporting loading
    numTrips += response.data.length;
    reportStatus(`Successfully loaded ${numTrips} trips.`);
    // from the response, I want the data. From Data I want trip name
    response.data.forEach((trip) => {
      tripsList.append(`<li class="${trip.id}">${trip.id}: ${trip.name}</li>`);
    });
  })
  // do this if the response is not successful
  .catch((error) => {
    console.log(error.response);
    if (error.response && error.response.data.errors) {
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}. You know what you did....`);
    }
  });
};

const tripURL = 'https://ada-backtrek-api.herokuapp.com/trips/';

// Show me one trip's details
const displayTrip = (event) => {
  // console.log(event);
  // retrieving the id based on the id assigned in the all trips list, parsing data till I got the value I wanted after viewing in the above console.log()
  const id = event.target.className;
  // making sure we clear out all trip deets
  const tripDetails = $('#trip-deets');
  tripDetails.empty();

  // GET request, need to include the id of the
  axios.get(tripURL + id)
  .then((response) => {
    reportStatus('Successfully loaded trip details');
    // FIXME: Want to display the detail name before it by accessing the name of the keys
    for (let detail1 in response.data) {
      tripDetails.append(`<li> ${response.data[detail1]} </li>`);
    }
    // need to set the hidden value on the form with the corresponding trip ID
    $('#tripID').val(id)
  })
  .catch((error) => {
    console.log(error.response);
    if (error.response && error.response.data.errors) {
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}.You know what you did....`);
    }
  });
};


// read traveler's info from a form
// $('#spot-form').serializeArray()
const FORM_FIELDS = ['name', 'age', 'email'];
const inputField = name => $(`#spot-form input[name="${name}"]`);

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

// clear out a form to restock with new user info
const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}


//reserve a spot on a trip
const holdSpot = (event) => {
  event.preventDefault();
  let spotId = $(`#tripID`).val();
  const holdURL = `${tripURL}` + `${spotId}` + `/reservations`
  // just for now, making sure that a spot hold can be created
  // will replace with form input
  const spotData = readFormData();
  console.log(spotData);

  reportStatus('Making sure we hold your spot...');

  // POST request processing
  axios.post(holdURL, spotData)

  .then((response) => {
    reportStatus(`Successfully reserved spot, enjoy your trip!`);
    clearForm();
  })
  .catch((error) => {
    console.log(error.response);
    if (error.response && error.response.data.errors) {
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}. You know what you did....`);
    }
  });
};

const reportStatus = (message) => {
  $('#status-messages').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += '<ul';
  for (const field in errors) {
    for (const problem in errors[field]) {
      content += `<li>${field}: ${problem}</li>`
    }
  }
  content += '</ul>';
  reportStatus(content);
};

$(document).ready(() => {
  // on button click display all trips
  // TODO: eventually will put in a portion that will select for different buttons "View by Continent" etc........
  // let buttonClicked = this.innerHTML;
  // console.log(buttonClicked);
  $('button').click(loadTrips);
  // event for clicking on a trip in trips list gets us a trips id. Had to use event delegation cause <li>'s I wanted had not been made yet
  $('#trips-table').on('click', 'li', displayTrip)
  $('#spot-form').submit(holdSpot);
});
