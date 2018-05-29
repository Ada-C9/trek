const TRIPSURL = "https://ada-backtrek-api.herokuapp.com/trips/";

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<ul>`;
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
      tripList.append(`<h2>Trips</h2>`)
      response.data.forEach((trip) => {
        tripList.append(`<li class="trip-link" id="${trip.id}"><img src="https://de.orlandoairports.net/site/uploads/2015/07/baggage_icon.svg" height=20px width=20px> ${trip.name}</li>`);
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

  $('.trip-form')[0].reset();
};

const showTripDetails = (id) => {
  // empty sections so you can add new content with click
    const tripName = $('#name');
    tripName.empty();
    const tripPlace = $('#place');
    tripPlace.empty();
    const tripDescription = $('#description');
    tripDescription.empty();
    const tripCategory = $('#category');
    tripName.empty();
    const tripWeeks = $('#weeks');
    tripWeeks.empty();
    const tripPrice = $('#price');
    tripName.empty();
    const reserveTrip = $('#reserve-trip');
    reserveTrip.empty();

    let pageURL = TRIPSURL + `/${id}`
    axios.get(pageURL)
      .then((response) => {
        tripName.text(response.data.name)
        tripPlace.text(response.data.continent)
        tripDescription.text(response.data.about)
        tripCategory.text('Category: ' + response.data.category)
        tripWeeks.text('Weeks: ' + response.data.weeks)
        tripPrice.text('Cost: $' + response.data.cost)

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
