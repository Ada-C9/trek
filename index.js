

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

  console.log(`${tripDetailUrl}`);

  axios.get(tripDetailUrl)
    .then((response) => {
      reportStatus(`Trip details loaded!`);
      targetTripName = response.data.name;
      singleTripDetail.append(
        `<h1>DO YOU WANT TO GO TO HERE? YOU CAN GO TO HERE.</h1>
        <h3>Name: ${targetTripName}</h3>
        <h4>Continent: ${response.data.continent}</h4>
        <h4>Category:  ${response.data.category}</h4>
        <h5>Weeks: ${response.data.weeks}</h5>
        <h5>Cost: ${response.data.cost}</h5>
        <h5>About: </h5>
        <p>${response.data.about}</p>
        <h6>Trip ID: ${targetTripId}</h6>`);
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trip details: ${error.message}`);
      console.log(error);
    });
    if (singleTripDetail.length > 0 ) {
      reserveButton.append(`<button id="reservation">YesPleaseIWantToGoHere</button>` )
    }
};


const FORM_FIELDS = ['name', 'age', 'owner'];
const inputField = name => $(`#pet-form input[name="${name}"]`);

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




const callReservationScreen = function callReservationScreen() {

    reportStatus('Pulling up reservation screen');

    const reservationScreen = $('#reservation-box');
    reservationScreen.empty();

    reservationScreen.append(
      ` <h1> MAKE A PLAN TO GO HERE </h1>
        <h3> The Trip You Want To Go On Is: ${targetTripName}</h3>
        <form id='reservation-form' name='reservation-form'>
          <label for='name'>Name:</label>
          <input type='text' id='name' name='name'><br>
          <label for='age'>Age:</label>
          <input type='number' id='age' name='age'><br>
          <label for='email'>Email:</label>
          <input type='email' id='email' name='email'><br>
          <label>&nbsp;</label>
          <input type='submit' id='submit-reservation-info' value='Make It So I Go Here.'><br>
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

  const reservationData = {
    name: 'Herkimer',
    email: 'herkimer@herkulator.ru'
  }

  axios.post(reserveTripUrl, reservationData)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
};

// .then(function (response) {
//   resultElement.innerHTML = generateSuccessHTMLOutput(response);
// })
// .catch(function (error) {
//   resultElement.innerHTML = generateErrorHTMLOutput(error);
// });
//
// e.preventDefault();

  // console.log('In the reservation-making method!')
  // console.log(`Here is the targetTripId: ${targetTripId}`)
  // console.log(`Here is the targetTripName: ${targetTripName}`)
  //
  // const reserveTripUrl = BASE_URL.concat("/").concat(targetTripId).concat("/reservations")
  //
  // console.log(`Here is the reservation-posting URL: ${reserveTripUrl}`)
  //
  // const reservationData = {
  //   name: 'Herkimer',
  //   email: 'herkimer@herkulator.ru'
  // }
  //
  // console.log(`Here is the reservation info: ${reservationData} ${reservationData.name}, ${reservationData.email}`)

  // axios.post('https://ada-backtrek-api.herokuapp.com/trips/1/reservations', {
  //   name: 'Black Philip',
  //   email: 'always@deliciouslyliving.com'
  //   })
  //     .then((response) => {
  //       console.log(response);
  //       reportStatus(`Successfully sending Black Philip someplace"!`);
  //       // clearForm();
  //     })
  //     .catch((error) => {
  //       console.log('Whoops!');
  //       console.log(error.response);
  //       reportStatus(`Encountered an error: ${error.message}`);
  //           });
        // if (error.response.data && error.response.data.errors) {
        //   reportError(
        //     `Encountered an error: ${error.message}`,
        //     error.response.data.errors
        //   );
        // } else {
        //   reportStatus(`Encountered an error: ${error.message}`);
        // }
  // reportStatus(`Attempting to reserve a spot in "${targetTripName}". `)

//   axios.post(reserveTripUrl, reservationData)
//     .then((response) => {
//       console.log(response);
//       reportStatus(`Successfully created a reservation with ID "${reservationData.name}"!`);
//       // clearForm();
//     })
//     .catch((error) => {
//       console.log('Whoops!');
//       console.log(error.response);
//       reportStatus(`Encountered an error: ${error.message}`);
//       // if (error.response.data && error.response.data.errors) {
//       //   reportError(
//       //     `Encountered an error: ${error.message}`,
//       //     error.response.data.errors
//       //   );
//       // } else {
//       //   reportStatus(`Encountered an error: ${error.message}`);
//       // }
//     });
//

// axios.post('https://ada-backtrek-api.herokuapp.com/trips/1/reservations', {
//   name: 'Black Philip',
//   email: 'always@deliciouslyliving.com',
// })

















//
// // Creating Pets
// //
// const FORM_FIELDS = ['name', 'age', 'owner'];
// const inputField = name => $(`#pet-form input[name="${name}"]`);
//
// const readFormData = () => {
//   const getInput = name => {
//     const input = inputField(name).val();
//     return input ? input : undefined;
//   };
//
//   const formData = {};
//   FORM_FIELDS.forEach((field) => {
//     formData[field] = getInput(field);
//   });
//
//   return formData;
// };
//
// const clearForm = () => {
//   FORM_FIELDS.forEach((field) => {
//     inputField(field).val('');
//   });
// }
//




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
  // $('#reservation-box').on('submit', 'form', function(event) {
  //   event.preventDefault;
  //   createReservation(event);
  //  });
})




//
