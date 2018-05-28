

let targetTrip = null

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

  targetTrip = tripID

  const singleTripDetail = $('#trip-deets');
  singleTripDetail.empty();

  let tripDetailUrl = BASE_URL.concat("/").concat(tripID)

  const reserveButton = $('#reserve-button');

  console.log(`${tripDetailUrl}`);

  axios.get(tripDetailUrl)
    .then((response) => {
      reportStatus(`Trip details loaded!`);
      singleTripDetail.append(
        `<h1>DO YOU WANT TO GO TO HERE? YOU CAN GO TO HERE.</h1>
        <h3>Name: ${response.data.name}</h3>
        <h4>Continent: ${response.data.continent}</h4>
        <h4>Category:  ${response.data.category}</h4>
        <h5>Weeks: ${response.data.weeks}</h5>
        <h5>Cost: ${response.data.cost}</h5>
        <h5>About: </h5>
        <p>${response.data.about}</p>
        <h6>Trip ID: ${targetTrip}</h6>`);
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trip details: ${error.message}`);
      console.log(error);
    });
    if (singleTripDetail.length > 0 ) {
      reserveButton.append(`<button id="reservation">YesPleaseIWantToGoHere</button>` )
    }
};


// const makeReservation = function makeReservation {
//
//   reportStatus('Pulling up reservation screen');
//
//   const singleTripDetail = $('#trip-deets');
//   singleTripDetail.empty();
//
//   let tripDetailUrl = BASE_URL.concat("/").concat(tripID)
//
//   console.log(`${tripDetailUrl}`);
//
//   axios.get(tripDetailUrl)
//     .then((response) => {
//       reportStatus(`Trip details loaded!`);
//       singleTripDetail.append(
//         `<h3>Name: ${response.data.name}</h3>
//         <h4>Continent: ${response.data.continent}</h4>
//         <h4>Continent: ${response.data.continent}</h4>
//         <h4>Category:  ${response.data.category}</h4>
//         <h5>Weeks: ${response.data.weeks}</h5>
//         <h5>Cost: ${response.data.cost}</h5>
//         <h5>About: </h5>
//         <p>${response.data.about}</p>
//         <h6>Trip ID: ${response.data.id}</h6>`
//     })
//     .catch((error) => {
//       reportStatus(`Encountered an error while loading trip details: ${error.message}`);
//       console.log(error);
//     });
// };








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
    makeReservation()
  });
   // $('#every-trip').on('click', 'li', function(event) {
   //    alert(`Got a click on an <li> containing "${$(this).html()}"`);
   //  });
   // $('#every-trip').on('click', 'li', getTripDetail(this.class));
   // $("ul#every-trip li").click(getTripDetail(this.class));
   // $('#pet-form').submit(createPet);
})




//
