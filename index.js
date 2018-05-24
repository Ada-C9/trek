const allTripsURL = 'https://ada-backtrek-api.herokuapp.com/trips';

//______________________________________________________
// STATUS MANAGEMENT:
const reportStatus = (message) => {
  $('#status-message').addClass('callout primary');
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul> <button class='button' data-open='reserveModal' data-close aria-label='Close modal'>Try again!</button>";
  console.log(`Contend---> ${content}`);
  $(`#reservation-message`).html(content);
  // reportStatus(content);
};

//______________________________________________________
// LOAD TRIPS:
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(allTripsURL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li class="trip" id="${trip.id}" >${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

//______________________________________________________
// LOAD DETAILS OF A TRIP:
const tripURL = 'https://ada-backtrek-api.herokuapp.com/trips/';

const loadATrip = (tripID) => {
  reportStatus('Loading trip details...');

  const tripDetails = $('#single-trip');
  tripDetails.empty();

  axios.get(tripURL + tripID)
  .then((response) => {
    reportStatus(`Successfully loaded <strong>${response.data.name}</strong> trip details`);
    // response.data.forEach((trip) => {
    tripDetails.append(`<h3>${response.data.name}</h3>
      <div><h5>Continent</h5><p>${response.data.continent}</p></div>
      <div><h5>Category</h5><p>${response.data.category}</p></div>
      <div><h5>Weeks</h5><p>${response.data.weeks}</p></div>
      <div><h5>Cost</h5><p>$ ${response.data.cost.toFixed(2)}</p></div>
      <div><h5>About</h5><p>${response.data.about}</p></div>`);
      // });

      // Trip name on the 'reserve trip' section:
      // $('#trip-name').html(response.data.name);
      $('#trip-id').html(response.data.id);
      $('#makeReservation-button').val(`Reserve ${response.data.name} Trip!`)
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
  };


  // ______________________________________________________
  // MAKE A RESERVATION:

  const FORM_FIELDS = ['name', 'age', 'email'];
  const inputField = name => $(`#reserve-block input[name="${name}"]`);

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

  const reserve = (event) => {
    // to avoid the page to reload:
    event.preventDefault();

    const reservationData = readFormData();
    console.log(reservationData);

    const reserveURL = `${allTripsURL}/${$('#trip-id').html()}/reservations`;
    // console.log(reserveURL);

    // reportStatus('Making reservation...');

    axios.post(reserveURL, reservationData)
    .then((response) => {
      // reportStatus(`Successfully created a reservation with id ${response.data.trip_id}!`);
      // console.log(response);
      clearForm();
      $(`#reservation-message`).html(`Successfully created a reservation with id <span id="trip-id-confirm">${response.data.trip_id}</span>!`)
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(`Encountered an error: ${error.message}`,
          error.response.data.errors);
          // $(`#reservation-message`).html(`put error....!`)
        } else {
          // reportStatus(`Encountered an error: ${error.message}`);
          $(`#reservation-message`).html(`Encountered an error: ${error.message}`)
        }
      });
    };



    // ______________________________________________________
    // EVENTS:
    $(document).ready(() => {

      // Load Trips:
      $('#load').click(loadTrips);

      // Load details of a specific trip:
      $('#trip-list').on('click', 'li', function(event) {
        console.log($(this)[0].id);
        loadATrip($(this)[0].id);
      });

      // Reserve a Trip:
      $('#reserve-block').submit(reserve);

      // Load foundation on entire document
      // this is where I was getting that Modal error.
      $(document).foundation();

      // Display rest of body only after the load trips button is clicked on:
      $('#load').on('click', function(event) {
        $(".cell.medium-auto.medium-cell-block-container").css("display", "contents");
      });

      // $('li.trip').on('click', function(event) {
      //   $(".trip-details").css("display", "contents");
      // });


    });

    // ______________________________________________________
