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
        if (this.innerText === trip.name){
          showTrip(trip.id);
        }
      })
    })
    reportStatus('Trips loaded!');
  })
  .catch((error) => {
    reportStatus(`Error: ${error.message}`);
  })
};

const showTrip = (id) => {
  const tripInfo = $('#details');
  tripInfo.empty();
  tripInfo.append(`<h2>Trip Details</h2>`)
  reportStatus('Retrieving trip...')

  axios.get(URL + id)
  .then((response) => {
    let tripData = ["name", "continent", "category", "weeks", "cost", "about"];

    tripData.forEach((item) => {
      let info = response.data[item];
      tripInfo.append(`<p> <strong>${item}:</strong> ${info} </p>`);
    })
    reportStatus('Trip retrieved!')
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
  $(`form`).append(`<p><strong>Trip:</strong> ${trip.name}</p>`);
  $(`form`).append(`<input type="submit" class="btn btn-success" name="reserve" value="Reserve"></input>`);

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
  reportStatus('Making reservation...');

  axios.post(postURL, formData)
  .then((response) => {
    console.log(response.data);
    reportStatus(`Trip to ${trip.name} for ${formData.name} reserved!`);
  })
  .catch((error) => {
    reportStatus(`Error: ${error.message}`);
  })
};

$(document).ready(() => {
  $('#get-trips').click(loadTrips);
})
