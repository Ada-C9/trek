
const allTripsURL = 'https://ada-backtrek-api.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};


const listallTrips = () => {
  const tripsList = $('#tripList')
  tripsList.empty();

  axios.get(allTripsURL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length}`);
    console.log(response);
    const result = response.data
    result.forEach((place) => {
      tripsList.append(`<li id='${place.id}'>${place.name}</li>`);
    })
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

}; //end of listallTrips

const tripDetails = (trip) => {

  const aboutTrip = $('#details')
  const singleTripUrl = 'https://ada-backtrek-api.herokuapp.com/trips/'
  console.log(trip);

  axios.get(singleTripUrl + trip.id)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length}`);
    console.log(response);
    const result = response.data
    for (attr in result) {
      aboutTrip.append(`<li>${result[attr]}</li>`);
    }

  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

}; //end of Trip details

const createReservation = (reservation, trip) => {
  // console.log(reservation);
  // console.log(trip);

  const reservationData = {
    name: $('input[name="name"]').val(),
    age: $('input[name="age"]').val(),
    email: $('input[name="email"]').val()
  }

  const reservationURL = `https://ada-backtrek-api.herokuapp.com/trips/${trip.id}/reservations`

  axios.post(reservationURL, reservationData  )
  .then((response) => {
    reportStatus(`Successfully created something`);
    console.log(response);
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

}; //end of createReservation



$(document).ready(() => {
  $('#load').click(listallTrips);

  $('ul').on('click', 'li', function(){

    const trip = this

    tripDetails(trip);

    $('form').submit( function(event) {
      event.preventDefault();
      const reservation = this
      console.log(trip);

      createReservation(reservation, trip);


    });
  });


});
