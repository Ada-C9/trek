const TRIPSURL = "https://ada-backtrek-api.herokuapp.com/trips/";

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


const loadTrips = (event) => {
  event.preventDefault();

  $("#welcome").addClass("hidden")
  // Prep work
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips! Please wait....');

  // Actually load the trips
  // axios is linked at the bottom of index.html
  axios.get(TRIPSURL)
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<li class="trip-link" id="${trip.id}">${trip.name}</li>`);
      });

      reportStatus('Trips loaded :)');
    })
      // axios is giving us this error object to use
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


const createReservation = (event) => {
  event.preventDefault();
  console.log(event);
  let tripID = $(".trip-form").attr('id');

  let tripData = {
    name: $(`input[name="name"]`).val(),
    age: $(`input[name="age"]`).val(),
    email: $(`input[name="email"]`).val()
  };

  let postURL = TRIPSURL + tripID + '/reservations'
  console.log(postURL);
  console.log(tripData)

  axios.post(postURL, tripData)
    .then((response) => {
      console.log('we successed it!')
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

const showTripDetails = (id) => {
  // empty sections so you can add new content with click
    const tripDetails = $('#trip-details');
    tripDetails.empty();
    const reserveTrip = $('#reserve-trip');
    reserveTrip.empty();

    let pageURL = TRIPSURL + `/${id}`
    axios.get(pageURL)
      .then((response) => {
        tripDetails.append(`<h2>Trip Details</h2><p><h1>${response.data.name}</h1></p><p>${response.data.continent}</p><p><h3>About:</h3>${response.data.about}</p><p><h3>Category:</h3>${response.data.category}</p><p><h3>Weeks:</h3>${response.data.weeks}</p><p><h3>Cost:</h3>${response.data.cost}`);

        reportStatus('Trip details loaded :)');
      })
      // axios is giving us this error object to use
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

const buildReservationForm = (id) => {
  const reserveTrip = $('#reserve-trip');
  reserveTrip.empty();

  $(".reserve-trip").removeClass("hidden").addClass("trip-form-container")
  $(".trip-form").removeAttr( "id" ).attr("id", id);
}


$(document).ready(() => {
  $('.load-all').click(loadTrips);

  // clicking on individual trip to load details into trip-details section
  $('#trip-list').on('click', '.trip-link', function(event) {
    event.preventDefault();
    let id = $(this).attr('id');

    showTripDetails(id);
    buildReservationForm(id);

  });

  $('.trip-form').submit(createReservation);
});
