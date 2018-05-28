const URL = 'https://ada-backtrek-api.herokuapp.com/trips/'

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  $('#trips-table').empty();

  reportStatus("Loading trips...")

  axios.get(URL)
  .then((response) => {
    $('#trips-table').append("<tr><th>All Trips</th></tr>")

    response.data.forEach((trip) => {
      $('#trips-table').append(`<tr><td>${trip.name}</td></tr>`);

      $('td').click(function() {
        if (event.target.innerHTML === trip.name){
          showTrip(trip.id);
        }
      })
    })
    reportStatus('Trips loaded :)');
  })
  .catch((error) => {
    reportStatus(`Error: ${error.message}`);
  })
};

const showTrip = (id) => {
  const tripInfo = $('#details');
  tripInfo.empty();
  tripInfo.append(`<h2>Trip Details</h2>`)

  axios.get(URL + id)
  .then((response) => {
    let tripData = ["name", "continent", "category", "weeks", "cost", "about"];

    tripData.forEach((item) => {
      let info = response.data[item];

      tripInfo.append(`<p> <strong>${item}:</strong> ${info} </p>`);
    })
    showReservation(response.data);
  })
  .catch((error) => {
    reportStatus(`Error: ${error.message}`);
  })
};

const showReservation = (trip) => {
  $('.reservation-container').empty();

  $('.reservation-container').append(`<form></form>`);
  $(`form`).append(`<h2>Reserve Trip</h2>`);
  $(`form`).append(`<label for="name">Your Name:</label>`);
  $(`form`).append(`<input type="text" name="name"></input><br/>`);
  $(`form`).append(`<label for="email">Email:</label>`);
  $(`form`).append(`<input type="text" name="email"></input>`);
  $(`form`).append(`<p>Trip: ${trip.name}</p>`);
  $(`form`).append(`<input type="submit" name="reserve" value="Reserve"></input>`);


  $('form').submit(function() {
    const formData = {
      name: $('input[name="name"]').val(),
      email: $('input[name="email"]').val()
    }
    reserveTrip(event, trip, formData);
  })
};


const reserveTrip = function reserveTrip(event, trip, formData) {
  event.preventDefault();
  const postURL =  URL + trip.id + '/' + 'reservations';

  axios.post(postURL, formData)
  .then((response) => {
    console.log(response.data);
    reportStatus('Trip reserved!');
  })
  .catch((error) => {
    console.log(error.response);
    reportStatus(`Error: ${error.message}`);
  })
};

$(document).ready(() => {
  $('#get-trips').click(loadTrips);
})
