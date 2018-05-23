
const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
  const Trips = $('#trip-list');
  Trips.empty();

  reportStatus('Trips Loading...')

  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      Trips.append(`<li id='${trip.id}'>${trip.name}</li>`);
    });
    reportStatus('')
  })

  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`)
  });
};

const loadOneTrip = (id) => {
  const TripURL = 'https://ada-backtrek-api.herokuapp.com/trips/'
  axios.get(`${TripURL}${id}`)
  .then((response) => {

    $('#trip').addClass(id)
    $('#trip').append(`<h1>Trip Details</h1>`);
    $('#trip').append(`<h3>Name: <span>${response.data.name}</span></h3>`);
    $('#trip').append(`<p>Category: ${response.data.category}</p>`);
    $('#trip').append(`<p>Weeks: ${response.data.weeks}</p>`);
    $('#trip').append(`<p>Cost: $${response.data.cost}</p>`);
    $('#trip').append(`<p>About: ${response.data.about}</p>`);
    LoadReservationForm(id)
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`)
  });
};

const LoadReservationForm = (id) => {
  $('#reservations').prepend(`<h1>Reserve This Trip</h1>`);
  $('.name label').html('Name');
  $('.name label').append('<input type="text" name="name" />');
  $('.email label').html('Email');
  $('.email label').append('<input type="text" name="email" />');
  $('.trip-name label').html(`Trip: ${$('#trip span').html()}`);
  $('#reserve').append('<input type="submit" name="reserve-trip" value="Reserve Trip" />')

}

const FORM_FIELDS = ['name', 'email'];
const inputField = name => $('#reserve.name input[for="${name}"]');

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


const reserveTrip = (event) => {
  console.log(event);
  event.preventDefault();

  const ReserveURL = 'https://ada-backtrek-api.herokuapp.com/trips/'

  const reservationData = {'name': `${$('#reserve .name input').val()}`, 'email': `${$('#reserve .email input').val()}` }
  let id = $('#trip').attr("class")

  axios.post(`${ReserveURL}${id}/reservations`, reservationData)
  .then((response) => {
    reportStatus(`Created New Reservation`)
  })
  .catch((error) => {
    reportStatus(`Error: ${error.message}`)
  });

  clearForm();
}


$(document).ready(() => {
  $('#load').click(loadTrips);

  $('ul').on('click', 'li', function(event) {
    $('#trip').removeClass()
    loadOneTrip($(this).attr('id'));
    $('#reserve').submit(reserveTrip);
  });

});
