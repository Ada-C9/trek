const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading Trips! Please Wait...');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
      });
      reportStatus('Trips Loaded!');
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`);
    })
}

const loadTrip = (id) => {
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  const reservationForm = $('#reservation-form');
  reservationForm.empty();

  reportStatus('Loading Trip Details! Please Wait...')

  axios.get(URL + `/${id}`)
    .then((response) => {
      let data = response.data;
      console.log(data.name);
      tripDetails.append(`<h2>Trip Details</h2>`);
      tripDetails.append(`<h3><strong>ID:</strong> ${data.id}</h3>`);
      tripDetails.append(`<h3><strong>Name:</strong> ${data.name}</h3>`);
      tripDetails.append(`<h3><strong>Continent:</strong> ${data.continent}</h3>`);
      tripDetails.append(`<h3><strong>Category:</strong> ${data.category}</h3>`);
      tripDetails.append(`<h3><strong>Weeks:</strong> ${data.weeks}</h3>`);
      tripDetails.append(`<h3><strong>Cost:</strong> $${data.cost}</h3>`);
      tripDetails.append(`<h3><strong>About:</strong></h3> <p>${data.about}</p>`);

      reservationForm.append(`<h2>Reserve Trip</h2>`);
      reservationForm.append(
        `<label class="user-name">Your Name:</label>
        <input type="text" name="name" class="user-name" />`
      );
      reservationForm.append(`<label>Trip: ${data.name}</label>`);
      reservationForm.append(
        `<input type="submit" name="reserve-trip" value="Reserve" class="button reserve" />`
      );

      reportStatus('Trip Details Loaded!');
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`);
    })
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-list').on('click', 'li', function() {
    let id = $(this).attr('id');
    loadTrip(id);
  });
})
