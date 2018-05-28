

let targetTripId = null
let targetTripName = null

const BASE_URL = 'https://ada-backtrek-api.herokuapp.com/trips';

//
// Status Management
//
const reportStatus = (message) => {
  $('#status-message').html(message);
};

// const reportError = (message, errors) => {
//   let content = `<p>${message}</p><ul>`;
//   for (const field in errors) {
//     for (const problem of errors[field]) {
//       content += `<li>${field}: ${problem}</li>`;
//     }
//   }
//   content += "</ul>";
//   reportStatus(content);
// };
//
// Loading Trips
//
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
      `<section id="reservation-interface">
        <h1> MAKE A PLAN TO GO HERE </h1>
        <h3> The Trip You Want To Go On Is: ${targetTripName}</h3>
        <form id='reservation-form' name='reservation-form'>
          <label for='traveller-name'>Name:</label>
          <input type='text' id='traveller-name' name='traveller-name'><br>
          <label for='traveller-age'>Age:</label>
          <input type='number' id='traveller-age' name='traveller-age'><br>
          <label for='traveller-email'>Email:</label>
          <input type='email' id='traveller-email' name='traveller-email'><br>
          <label>&nbsp;</label>
          <input type='submit' id='submit-reservation-info' value='Make It So I Go Here.'><br>
        </form>
      </section>`
    )
  };
    //
    // const RESERVATION_FORM_FIELDS = ['name', ];
    // const reservationInputField = name => $(`#reservation-form input[name="${name}"]`);
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
// const makeReservation = function makeReservation() {
//
//     let reserveTripUrl = BASE_URL.concat("/").concat(targetTrip).concat("/reservations")
//
//     axios.post(reserveTripUrl) =
//
// };


  // axios.get(tripDetailUrl)
  //   .then((response) => {
  //     reportStatus(`Trip details loaded!`);
  //     singleTripDetail.append(
  //       `<h3>Name: ${response.data.name}</h3>
  //       <h4>Continent: ${response.data.continent}</h4>
  //       <h4>Continent: ${response.data.continent}</h4>
  //       <h4>Category:  ${response.data.category}</h4>
  //       <h5>Weeks: ${response.data.weeks}</h5>
  //       <h5>Cost: ${response.data.cost}</h5>
  //       <h5>About: </h5>
  //       <p>${response.data.about}</p>
  //       <h6>Trip ID: ${response.data.id}</h6>`
  //   })
  //   .catch((error) => {
  //     reportStatus(`Encountered an error while loading trip details: ${error.message}`);
  //     console.log(error);
  //   });









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
// const createPet = (event) => {
//   // Note that createPet is a handler for a `submit`
//   // event, which means we need to call `preventDefault`
//   // to avoid a page reload
//   event.preventDefault();
//
//   const petData = readFormData();
//   console.log(petData);
//
//   reportStatus('Sending pet data...');
//
//   axios.post(URL, petData)
//     .then((response) => {
//       reportStatus(`Successfully added a pet with ID ${response.data.id}!`);
//       clearForm();
//     })
//     .catch((error) => {
//       console.log(error.response);
//       if (error.response.data && error.response.data.errors) {
//         reportError(
//           `Encountered an error: ${error.message}`,
//           error.response.data.errors
//         );
//       } else {
//         reportStatus(`Encountered an error: ${error.message}`);
//       }
//     });



$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#every-trip').on('click', 'li', function(event) {
     getTripDetail(this.id)
   });
 $('#reserve-button').on('click', 'button', function(event) {
    callReservationScreen()
  });
   // $('#every-trip').on('click', 'li', function(event) {
   //    alert(`Got a click on an <li> containing "${$(this).html()}"`);
   //  });
   // $('#every-trip').on('click', 'li', getTripDetail(this.class));
   // $("ul#every-trip li").click(getTripDetail(this.class));
   // $('#reservation-form').submit(createPet);
})




//
