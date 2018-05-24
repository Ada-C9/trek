// use closure with li

const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#reservation-form input[name="${name}"]`);
const getInput = name => { return inputField(name).val() || undefined };

const reservationFormData = () => {
  const formData = {};
  FORM_FIELDS.forEach((field) => { formData[field] = getInput(field); });
  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => { inputField(field).val(''); });
};

const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const getTripURL = (tripId) => { return `${URL}/${tripId}` };
const getReservationURL = (tripId) => { return `${URL}/${tripId}/reservations` };

const reportStatus = (message) => { $('#status-message').html(message); };

const reportError = (message, errors) => {
  let content = '';
  for (const field in errors) {
    for (const problem of errors[field]) { content += `<li>${field}: ${problem}</li>`; }
  }
  reportStatus(`<p>${message}</p><ul>${content}</ul>`);
};

const loadTrips = () => {
  const tripsList = $('#trips-list');
  tripsList.empty();
  axios.get(URL)
    .then((response) => {
      // console.log(response['data']);
      response['data'].forEach((trip) => {
        // include message about successfully loading n number of trips
        tripsList.append(`<li class="trip ${trip.id}">${trip.name}</li>`)
      })
    })
    .catch((error) => {
      console.log(error)
    });
};

const getTrip = (tripID) => {
  const tripInfo = $('#trip-info');
  tripInfo.empty();
  axios.get(getTripURL(tripID))
    .then((response) => {
      console.log(response['data']);
      tripInfo.append(`<h3 class='${tripID}'>${response['data']['name']}</h3><p>${response['data']['about']}</p><p>${response['data']['category']}</p>`);
      loadForm(`${response['data']['name']}`);
    })
    .catch((error) => {
      console.log(error)
    });

};

const loadForm =(tripName) => {
  const formBullshit = $('#trip-name-for-form');
  formBullshit.empty();
  $(formBullshit).append(tripName);
};

const createReservation = (event) => {
  event.preventDefault();
  let reservationData = reservationFormData();
  const reservationURL = getReservationURL($('#trip-info h3')['0'].classList[0]);

  axios.post(reservationURL, reservationData)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully added a reservation with ID ${response.data.trip_id}!`);
      // clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        console.log(error.response.data.errors);
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
  // clearForm();
};

$(document).ready(() => {
  $('.hidden-at-start').hide();
  $('#load-trips-button').on('click', function(event) {
    $('#list').slideDown('slow')
    .promise().done(function() {

      loadTrips(event);
  });
  });
  // $('#trips-list').on('mousedown', function(event) {
  //   $('.side-info').slideUp('slow');
  // });

  $('#trips-list').on('click', function(event) {
    $('.side-info').slideUp('slow')
      .promise().done(function() {
      getTrip(event.target.classList[1]);
      // $('.side-info').promise().done(function() {
      //   $('.side-info').slideToggle('slow');
      // });
      $('.side-info').slideDown('slow');
      // $( "p" ).append( " Finished! " );
    });
    // $('.side-info').slideUp('slow');
    // $(this).is(':visible')? toggle_switch.text('Hide') : toggle_switch.text('Show');

      // $('#book').slideToggle();
      // getTrip(event.target.classList[1]);
      // // $('.side-info').promise().done(function() {
      // //   $('.side-info').slideToggle('slow');
      // // });
      // $('.side-info').slideDown('slow');

  });



  $('#trip-info').on('scroll', function() {
    // $().css( "display", "inline" ).fadeOut( "slow" );
  });
  $('#reservation-form').on('submit', function(event) { createReservation(event); });
});




// $('#fuck-yeah-ampers-button').click(ampers);
