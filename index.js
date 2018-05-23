const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const statusColors = {
  'success': 'lightgreen',
  'fail': 'indianred',
  'loading': 'sandybrown'
}

const reportStatus = (message, status) => {
  let color = statusColors[status];
  return $('#status-message').fadeIn(1000).html(message).css('background-color', color);
  // $('#status-message').fadeOut(2000);
};

const clearContent = (id) => {
  return $(`#${id}`);
};

const clearForm = () => {
  $('input[name="name"]').val('');
  $('input[name="email"]').val('');
};

const getTrips = () => {
  clearContent('trip-list').empty();
  clearContent('show-trip').empty();
  $('#reserve-trip').css('display', 'none');

  reportStatus('Loading Trips...', 'loading');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) =>{
        $('#trip-list').append(`<li><button id="${trip.id}" class="button trip">${trip.name}</button></li>`)
      });
      reportStatus('Trips Loaded!', 'success').fadeOut(2000);
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus(`Error: ${error.message}`, 'fail');
    });
};

const showTrip = (event) => {
  clearContent('show-trip').empty();
  reportStatus('Loading Trip...', 'loading');

  const tripId = event.target.id;

  axios.get(URL + `/${tripId}`)
    .then((response) => {
      $('#show-trip').append( buildTrip(response.data) );

      $('#reserve-trip').css('display', 'block');
      $('#reserve-trip-id').text(response.data.name);

      reportStatus(`Trip #${tripId} Loaded!`, 'success').fadeOut(2000);
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`, 'fail');
    });
};

const buildTrip = (tripData) => {
  return (`<div id='${tripData.id}'>
    <h3>${tripData.name} </h3>
    <p>Continent: ${tripData.continent} </p>
    <p>Category: ${tripData.category} </p>
    <p>Weeks: ${tripData.weeks} </p>
    <p>Cost: $${tripData.cost} </p>
    <p>About: ${tripData.about} </p>
    </div>`);
};

const getFormData = () => {
  let data = {};
  data['name'] = $('input[name="name"]').val();
  data['email'] = $('input[name="email"]').val();
  return data;
};

const reserveTrip = (event) => {
  event.preventDefault();
  let tripId = parseInt( $('#show-trip div')[0].id );
  reportStatus('Reserving trip...', 'loading');

  axios.post(URL + `/${tripId}/reservations`, getFormData())
    .then((response) => {
      reportStatus(`Trip #${tripId} Reserved!`, 'success').fadeOut(2000);
      console.log(response);
      clearForm();
    })
    .catch((error) => {
      reportStatus('Error: trip reservation failed', 'fail');
      console.log(error.message);
    });
};

$(document).ready(() => {
  $('#all-trips').click(getTrips);
  $('#trip-list').on('click', 'li', showTrip);
  $('#reserve-form').submit(reserveTrip)
});
