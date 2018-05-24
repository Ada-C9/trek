const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const statusColors = {
  'success': 'lightgreen',
  'fail': 'indianred',
  'loading': 'sandybrown'
}

const reportStatus = (message, status) => {
  let color = statusColors[status];
  return $('#status-message').show(1000).html(message).css('background-color', color);
};

const clearContent = (idArr) => {
  idArr.forEach((id) => {
    $(`#${id}`).empty();
  });
};

const reservationForm = ['reservation-name', 'email'];
const tripForm = ['name', 'continent', 'category', 'weeks', 'cost', 'about'];

const clearForm = (form) => {
  // let array = `${form}Form`;
  // console.log(`array in clearForm fn: ${typeof array}`);
  // array.forEach((formField) => {
  //   $(`input[name="${formField}"]`).val('');
  // });

  if (form === 'reservation'){
    reservationForm.forEach((formField) => {
      $(`input[name="${formField}"]`).val('');
    });
  } else if (form === 'trip') {
    tripForm.forEach((formField) => {
      $(`input[name="${formField}"]`).val('');
    });
  }
};

const getFormData = (form) => {
  let data = {};
  if (form === 'reservation') {
    data['name'] = $('input[name="reservation-name"]').val();
    data['email'] = $('input[name="email"]').val();
  } else if (form === 'trip'){
    tripForm.forEach((formField) => {
      data[formField] = $(`input[name="${formField}"]`).val();
    });
  }
  return data;
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

// EVENT LISTENER FUNCTIONS

const getTrips = () => {
  clearContent(['trip-list', 'show-trip']);
  $('#reserve-trip').css('display', 'none');

  reportStatus('Loading Trips...', 'loading');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) =>{
        $('#trip-list').append(`<li><button id="${trip.id}" class="button trip">${trip.name}</button></li>`)
      });
      reportStatus('Trips Loaded!', 'success').hide(1000);
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus(`Error: ${error.message}`, 'fail');
    });
};

const showTrip = (event) => {
  clearContent(['show-trip']);

  $('#show-trip').css('display', 'block');
  $('#reserve-trip').css('display', 'block');
  $('#new-trip').css('display', 'none');

  reportStatus('Loading Trip...', 'loading');

  const tripId = event.target.id;

  axios.get(URL + `/${tripId}`)
    .then((response) => {
      $('#show-trip').append( buildTrip(response.data) );
      $('#reserve-trip-id').text(response.data.name);

      reportStatus(`Trip #${tripId} Loaded!`, 'success').delay(2000).hide(1000);
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus(`Error: ${error.message}`, 'fail');
    });
};

const reserveTrip = (event) => {
  event.preventDefault();
  let tripId = parseInt( $('#show-trip div')[0].id );
  reportStatus('Reserving trip...', 'loading');

  axios.post(URL + `/${tripId}/reservations`, getFormData('reservation'))
    .then((response) => {
      console.log(response.data);
      reportStatus(`Trip #${tripId} Reserved!`, 'success').delay(2000).hide(1000);
      clearForm('reservation');
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus('Error: trip reservation failed', 'fail');
    });
};

const showTripForm = () => {
  getTrips();
  $('#reserve-trip').css('display', 'none');
  $('#show-trip').css('display', 'none');
  $('#new-trip').css('display', 'block');
};

const addTrip = () => {
  event.preventDefault();
  reportStatus('Adding Trip...', 'loading');

  axios.post(URL, getFormData('trip'))
    .then((response) => {
      console.log(response.data);
      reportStatus('Trip Added', 'success').delay(2000).hide(1000);
      clearForm('trip');
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus('Error: Trip not added', 'fail');
    });
};

$(document).ready(() => {
  $('#all-trips').click(getTrips);
  $('#trip-list').on('click', 'li', showTrip);
  $('#reserve-form').submit(reserveTrip);
  $('#add-trip').click(showTripForm);
  $('#add-trip-form').submit(addTrip);
});
