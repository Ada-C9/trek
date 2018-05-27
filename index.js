const URL = 'https://ada-backtrek-api.herokuapp.com/trips';


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

const loadtrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    tripList.append(`<h3>All Trips</h3>`)
    response.data.forEach((trip) => {
      tripList.append(`<li trip-id="${trip.id}"><a>${trip.name}</a></li>`);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

};

const viewTrip = (id) => {
  reportStatus('Loading trip...');

  const tripDetail = $('#trip-details');
  tripDetail.empty();

  axios.get(URL + '/' + id)
  .then((response) => {
    if (response.status == 200) {
      console.log();
      reportStatus(`Successfully loaded trip #${id}`);
      let trip = response.data;
      let tripID_res = trip.id
      // console.log(`res id`);
      // console.log(tripID_res);
      let tripDetails = `
      <h3> ${trip.name} - Trip Details (ID <span>${trip.id}</span>) </h3>
      <p> Continent: ${trip.continent} </p>
      <p> Category: ${trip.category} </p>
      <p> Duration: ${trip.weeks} weeks</p>
      <p> Cost: $${trip.cost.toFixed(2)} </p>
      <p> ${trip.about} </p>

      `;
      // $('span').hide()
      $('#trip-details').append(tripDetails);
    } else {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
    }
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trip: ${error.message}`);
    console.log(error);
  });
};

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

const reserveTrip = (event) => {
  event.preventDefault();

  const tripId = $('#trip-details span').text();
  // const tripId = $('#trip-id');
  const reservationURL = URL + '/' + tripId + '/reservations';
  const reservationData = readFormData();
  console.log();

  reportStatus('Reserving trip...');

  axios.post(reservationURL, reservationData)
  .then((response) => {
    reportStatus(`Successfully added a reservation with ID ${tripId}!`);
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
  $("#trip-location").hide();

  $('#load').click(loadtrips)

  $('ul').on('click', 'li', function() {
    let tripID = $(this).attr('trip-id');
    viewTrip(tripID);
    $('#trip-location').show();
    $("#reserve-trip").show();
    $("#new-reservation").hide();
  });
  $('#reserve-trip').click(function(){
    $("#reserve-trip").hide();
    $("#new-reservation").show();
    let tripID = $(this).attr('trip-id');
  });
  $('#reservation-form').submit(reserveTrip);
});
