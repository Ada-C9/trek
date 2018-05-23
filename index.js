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
  content += "</ul>";
  reportStatus(content);
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
      <h5>Continent</h5><p>${response.data.continent}</p>
      <h5>Category</h5><p>${response.data.category}</p>
      <h5>Weeks</h5><p>${response.data.weeks}</p>
      <h5>Cost</h5><p>${response.data.cost}</p>
      <h5>About</h5><p>${response.data.about}</p>`);
      // });

      // Trip name on the 'reserve trip' section:
      $('#trip-name').html(response.data.name);
      $('#trip-id').html(response.data.id);
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
    // to avoid a page reload:
    event.preventDefault();

    const reservationData = readFormData();
    console.log(reservationData);

    const reserveURL = `${allTripsURL}/${$('#trip-id').html()}/reservations`;
    // console.log(reserveURL);

    reportStatus('Making reservation...');

    axios.post(reserveURL, reservationData)
    .then((response) => {
      reportStatus(`Successfully created a reservation with id ${response.data.trip_id}!`);
      // console.log(response);
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
    // this is where I was getting the Modal error.
    $(document).foundation();

  });


  



  // PAGINATION .... ??

  // $('#trip-list').pagination({
  //     dataSource: [1, 2, 3, 4, 5, 6, 7, 50],
  //     pageSize: 5,
  //     showPageNumbers: false,
  //     showNavigator: true,
  //     callback: function(data, pagination) {
  //         // template method of yourself
  //         let html = template(data);
  //         dataContainer.html(html);
  //     }
  // })
