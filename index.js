const reportStatus = (message) => {
  $('#status-message').html(message);
};
const reportErrors = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const name in errors) {
    for (const description of errors[name]) {
      content += `<li>${name}: ${description}</li>`
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const loadTrips = () => {
  reportStatus('Loading trips . . .')

  const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

  let tripList = $('#all-trips');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    response.data.forEach((response) => {
      let id = response.id;
      let tripName = response.name;
      tripList.append(`<li class="trip-link" id="${id}">${tripName}</li>`);
    });
    reportStatus(`Loaded ${response.data.length} trips!`)
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
    reportStatus(`Had trouble loading trips: ${error.message}`);
    console.log(error);
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

  let details = '<h3>Trip Details</h3><ul>';
  details += '<li>' + tripData.name + '<li>';
  details += '<li>' + tripData.continent + '<li>';
  details += '<li>' + tripData.category + '<li>';
  details += '<li>' + tripData.weeks + '<li>';
  details += '<li>' + tripData.cost + '<li>';
  details += '<li>About: <li>';
  details += '<p>' + tripData.about + '<p>';
  details += '<ul>';

  tripDetails.html(details);
};


$(document).ready(() => {
  // Use Foundation CDN!!
  $('#load-trips').click(loadTrips);
  $('#all-trips').on('click', '.trip-link', function(event){
    let trip = event.target.id;
    (displayTripInfo(trip));
  });
  $('#reserve-trip-form').submit(reserveTrip);
});
