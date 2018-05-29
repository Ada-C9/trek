

let targetTripId = null
let targetTripName = null

const BASE_URL = 'https://ada-backtrek-api.herokuapp.com/trips';

//
// Status Management
//
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


const loadTrips = () => {
  reportStatus('Loading trips...');

  const allTrips = $('#every-trip');
  allTrips.empty();

  let allTripsUrl = BASE_URL

  axios.get(allTripsUrl)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        allTrips.append(`<li id="${trip.id}">${trip.name}</li>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

const getTripDetail = function getTripDetail(tripID) {

  reportStatus('Getting trip details.');

  targetTripId = tripID

  const singleTripDetail = $('#trip-deets');
  singleTripDetail.empty();

  let tripDetailUrl = BASE_URL.concat("/").concat(tripID)

  const reserveButton = $('#reserve-button');
  reserveButton.empty();

  console.log(`${tripDetailUrl}`);

  axios.get(tripDetailUrl)
    .then((response) => {
      reportStatus(`Trip details loaded!`);
      targetTripName = response.data.name;
      singleTripDetail.append(
        `<h1>HERE'S ONE GOOD WAY TO GET TREKKED UP:</h1>
        <section class="details_box" >
          <h3>Name: ${targetTripName}</h3>
          <h4>Continent: ${response.data.continent}</h4>
          <h4>Category:  ${response.data.category}</h4>
          <h5>Weeks: ${response.data.weeks}</h5>
          <h5>Cost: ${response.data.cost}</h5>
          <h5>About: </h5>
          <p>${response.data.about}</p>
          <h6>Trip ID: ${targetTripId}</h6>
        </section>`);
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trip details: ${error.message}`);
      console.log(error);
    });
    if (singleTripDetail.length > 0 ) {
      reserveButton.append(`<button id="reservation">I Would Like To Trek Up in This Manner</button>` )
    }
};


const callReservationScreen = function callReservationScreen() {

    reportStatus('Pulling up reservation screen');

    const reservationScreen = $('#reservation-box');
    reservationScreen.empty();

    reservationScreen.append(
      ` <h1> SECURE YOUR OPPORTUNITY TO TREK UP ROYALLY: </h1>
        <h3 class="details_box"> The Trip You Want To Go On Is: ${targetTripName}</h3>
        <form class="details_box" id='reservation-form' name='reservation-form'>
          <label for='name'>Name:</label>
          <input type='text' id='name' name='name'><br>
          <label for='email'>Email:</label>
          <input type='email' id='email' name='email'><br>
          <label>&nbsp;</label>
          <input type='submit' id='submit-reservation-info'
          value='I hereby commit to unapologetically trekking up my life'><br>
        </form>`
    )
  };

const createReservation = (e) => {

  e.preventDefault()

  console.log('in the Create Reservation method!')

  console.log(`Here is the targetTripId: ${targetTripId}`)
  console.log(`Here is the targetTripName: ${targetTripName}`)

  const reserveTripUrl = BASE_URL.concat("/").concat(targetTripId).concat("/reservations")

  console.log(`Here is the reservation-posting URL: ${reserveTripUrl}`)

  const reservationResult = $('#result-box');
  reservationResult.empty();

  const reservationData = {
    // name: 'Mona VanDerWaal',
    // email: 'scarysmart@happycrazy.ru'
    name: $('#name').val(),
    email: $('#email').val()
  }

  console.log(`Here is the name for the reservation ${reservationData.name}`)
  console.log(`Here is the email for the reservation ${reservationData.email}`)

  reportStatus(`Submitting a request to reserve a slot in ${targetTripName}.`);

  axios.post(reserveTripUrl, reservationData)
    .then((response) => {
      console.log(response);
      reservationScreen.empty();
      reservationResult.append(`<section class="success_message"><h2>YOUR RESERVATION HAS BEEN CREATED!</h2><h3>Now nothing can stop you from trekking up everything!</h3></section>`)
      reportStatus(`Successfully reservered a slot in Trip Number
         ${response.data.trip_id} for
         ${response.data.name}!`
       );
      // clearForm();
    })
      .catch((error) => {
        console.log(error.response);
        if (error.response.data && error.response.data.errors) {
          reportError(
            `Encountered an error: ${error.message}`,
            error.response.data.errors
          );
        } else {
          reportStatus(`Encountered an error: ${error.message}`);
        }
      });
};


$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#every-trip').on('click', 'li', function(event) {
     getTripDetail(this.id)
   });
 $('#reserve-button').on('click', 'button', function(event) {
    callReservationScreen()
  });
  $('#reservation-box').on('submit', 'form', function(event) {
    createReservation(event)
  });
})
