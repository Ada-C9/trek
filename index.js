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

const loadTrips = () => {
  reportStatus('Loading trips . . .')

  const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

  let tripList = $('#all-trips');
  let tripTable = $('#table-body')
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    tripList.append('<h3>Available Trips - Click for Details</h3>');
    response.data.forEach((response) => {
      let id = response.id;
      let tripName = response.name;
      tripList.append(`<li class="trip-link" id="${id}">#${id} ${tripName}</li>`);
    });

    reportStatus(`You have ${response.data.length} trips to choose from!`)
  })
  .catch((error) => {
    reportStatus(`Had trouble loading trips: ${error.message}`);
    console.log(error);
  });
};

const displayTripInfo = (tripID) => {
  const URL = 'https://ada-backtrek-api.herokuapp.com/trips/' + `${tripID}`;
  axios.get(URL)
  .then ((response) => {
    let tripData = response.data;
    // let tripName = response.data.name;
    // tripDetails.html(tripName);
    // id, name, continent, about, category, weeks and cost
    buildDetails(tripData);
    buildReservationBox(tripData);
  })
  .catch((error) => {
    reportStatus(`Had trouble loading trips: ${error.message}`);
    console.log(error);
  });
};

const readFormData = () => {
  const formData = {};
  formData['name']= $('form input[name="name"]').val();
  formData['email']= $('form input[name="email"]').val();
  return formData;
};

const reserveTrip = (event) => {
  const tripID = $('form input[type="submit"]').data('trip-id');
  const URL = 'https://ada-backtrek-api.herokuapp.com/trips/' + `${tripID}` + '/reservations';
  event.preventDefault();

  const tripData = readFormData();
  $('form')[0].reset();

  axios.post(URL, tripData)
  .then((response) => {
    console.log(response.data);
    reportStatus(`Successfully reserved trip #${response.data.trip_id}! `);
  })
  .catch((error) => {
      if (error.response.data && error.response.data.errors) {
        console.log(error.response);
        reportError(`Encountered an error: ${error.message}`, error.response.data.errors);
      } else {
        reportStatus(`There was an error: ${error.message}`);
      }
    });
};

const buildReservationBox = (tripData) => {
  let tripID = tripData.id;
  let tripName = tripData.name;
  let reservationBox = $('#reserve-trip-form');
  let details = '<h3>Reserve Trip</h3>';

  details += '<div>Name: <input type="text" name="name" placeholder="First Last"></div>';
  details += '<div>Age: <input type="text" name="age" placeholder="Age"></div>';
  details += '<div>Email: <input type="text" name="email" placeholder="Email"></div>';
  details += `<input type="submit" data-trip-id="${tripID}" name="reserve-trip" value="Reserve Trip">`;

  reservationBox.html(details);
};



const buildDetails = (tripData) => {
  let tripDetails = $('#trip-details');

  let details = '<h3>' + `Trip #${tripData.id} ` + tripData.name + '</h3>';
  details += '<p>' + tripData.about + '<p>';
  details += '<p>' + '<strong>Continent: </strong>' + tripData.continent + '</p>';
  details += '<p>' + '<strong>Category: </strong>' + tripData.category + '</p>';
  details += '<p>' + '<strong>Weeks: </strong>' + tripData.weeks + '</p>';
  details += '<p>' + '<strong>Price: $</strong>' + tripData.cost + '</p>';

  tripDetails.html(details);
};

$(document).ready(() => {
  // Use Foundation CDN!!
  $('#load-trips').click(loadTrips);
  $('#all-trips').on('click', '.trip-link', function(event){
    let trip = event.target.id;
    (displayTripInfo(trip));
  });
  $('#load-trips').on('click', function(event){
    $('header').css("height", "50vh");
  });
  $('#reserve-trip-form').submit(reserveTrip);
});
