const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

// add status in order to add colors??
// const reportStatus = (message, status) => {}..
const reportStatus = (message) => {
  $('#status-message').html(message);
};

const clearContent = (id) => {
  return $(`#${id}`);
};

const getTrips = () => {
  clearContent('trip-list').empty();
  clearContent('show-trip').empty();

  reportStatus('Loading Trips...');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) =>{
        $('#trip-list').append(`<li><button id="${trip.id}" class="button trip">${trip.name}</button></li>`)
      });
      reportStatus('Trips Loaded!');
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus(`Error: ${error.message}`);
    });
};

const showTrip = (event) => {
  reportStatus('Loading Trip...');
  // console.log(event.target.id);
  const tripId = event.target.id;
  clearContent('show-trip').empty();

  axios.get(URL + `/${tripId}`)
    .then((response) => {
      // console.log(response.data);
      $('#show-trip').append( buildTrip(response.data) );
      $('#reserve-trip').css('display', 'block');
      reportStatus(`Trip #${tripId} Loaded!`);
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus(`Error: ${error.message}`);
    });
};

const buildTrip = (tripData) => {
  return (`<div id='${tripData.id}'>
    <h3>Name: ${tripData.name} </h3>
    <p>Continent: ${tripData.continent} </p>
    <p>Category: ${tripData.category} </p>
    <p>Weeks: ${tripData.weeks} </p>
    <p>Cost: $${tripData.cost} </p>
    <p>About: ${tripData.about} </p>
    </div>`);
};

const reserveTrip = (event) => {
  event.preventDefault();
  let tripId = parseInt( $('#show-trip div')[0].id );
  console.log(tripId);
  // let reservationData = getFormData();

  axios.post(URL + `/${tripId}/reservations`, getFormData())
    .then((response) => {
      reportStatus('Trip Reserved!');
      console.log(response);
    })
    .catch((error) => {
      reportStatus('Error: trip reservation failed');
      console.log(error.message);
    });
};

const getFormData = () => {
  let data = {};
  data['name'] = $('input[name="name"]').val();
  data['email'] = $('input[name="email"]').val();
  return data;
};

$(document).ready(() => {
  $('#all-trips').click(getTrips);
  $('#trip-list').on('click', 'li', showTrip);
  $('#reserve-form').submit(reserveTrip)
});
