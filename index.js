
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
    Trips.append(`<h1>All Trips</h1>`);
    response.data.forEach((trip) => {
      Trips.append(`<li id='${trip.id}'>${trip.name}</li>`);
    });
    reportStatus('')
  })

  .catch((error) => {

    reportStatus(`Error: ${error.message}`)
  });
};

// const TripsbyBudget = () => {
//   const budgeturl = 'https://ada-backtrek-api.herokuapp.com/trips/budget?query=';
//
//   let budget = $('.budget input').val()
//
//   reportStatus('Trips Loading...')
//
//   axios.get(`${budgeturl}${budget}`)
//   .then((response) => {
//     $('#trip-list').append(`<h1>Trips</h1>`);
//     response.data.forEach((trip) => {
//       $('#trip-list').append(`<li id='${trip.id}'>${trip.name}</li>`);
//     });
//     reportStatus('')
//   })
//   .catch((error) => {
//
//     reportStatus(`Error: ${error.message}`)
//   });
// }

const loadOneTrip = (id) => {
  const TripURL = 'https://ada-backtrek-api.herokuapp.com/trips/'

    axios.get(`${TripURL}${id}`)
    .then((response) => {
      $('#trip').addClass(id)
      $('#trip').append(`<h1>Trip Details</h1>`);
      $('#trip').append(`<h3> <span>${response.data.name}</span></h3>`);
      $('#trip').append(`<p>Category: ${response.data.category}</p>`);
      $('#trip').append(`<p># of Weeks: ${response.data.weeks}</p>`);
      $('#trip').append(`<p>Cost: $${response.data.cost.toFixed(2)}</p>`);
      $('#trip').append(`<p>About: ${response.data.about}</p>`);
      LoadReservationForm(id)
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`)
    });
};

const LoadReservationForm = (id) => {
  $('#reservations').prepend(`<h1>Reserve This Trip</h1>`);
  $('.trip-name label').html(`${$('#trip span').html()}`);
  $('.name label').html('Name: ');
  $('.name label').append('<input type="text" name="name" />');
  $('.email label').html('Email: ');
  $('.email label').append('<input type="text" name="email" />');
  $('#reserve').append('<input type="submit" name="reserve-trip" value="Reserve Trip" />')

}

const FORM_FIELDS = ['name', 'email'];

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    $(`#reserve .${field} input`).val('')
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
  $('#budget').click(TripsbyBudget);

  $('ul').on('click', 'li', function(event) {
    $('#trip').empty();
    $('#reservations h1').remove();
    $('.name input').remove();
    $('.email input').remove();
    $('#reserve input').remove();
    loadOneTrip($(this).attr('id'));
    $('#reserve').submit(reserveTrip);
  });

});
