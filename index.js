const allTripsURL = 'https://ada-backtrek-api.herokuapp.com/trips';

//__________________
// Status Management:
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

//__________________
// Load Trips:
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




//__________________
// Load Details of a Trip:
const tripURL = 'https://ada-backtrek-api.herokuapp.com/trips/';

const loadATrip = (tripID) => {
  reportStatus('Loading trip details...');

  const tripDetails = $('#single-trip');
  tripDetails.empty();

  axios.get(tripURL + tripID)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.name} trip details`);
    // response.data.forEach((trip) => {
    tripDetails.append(`<h3>${response.data.name}</h3>
      <h5>Continent</h5><p>${response.data.continent}</p>
      <h5>Category</h5><p>${response.data.category}</p>
      <h5>Weeks</h5><p>${response.data.weeks}</p>
      <h5>Cost</h5><p>${response.data.cost}</p>
      <h5>About</h5><p>${response.data.about}</p>`);
      // });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
  };



  // __________________
  // Actions:
  $(document).ready(() => {
    $('#load').click(loadTrips);
    // $('#trip-list').click(loadATrip($('.trip')));

    //
    //
    $('#trip-list').on('click', 'li', function(event) {
      // console.log($(this));
      // console.log($(this.id));
      console.log($(this)[0].id);
      loadATrip($(this)[0].id);
      // console.log('clicked');
      // loadATrip($(this.id));
    });


    // same as:
    // $(`li[class="trip"]`).click(console.log('clicked'));
  });
