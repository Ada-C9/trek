
const TRIPS_URL = "https://ada-backtrek-api.herokuapp.com/trips"
const TRIP_URL = "https://ada-backtrek-api.herokuapp.com/trips/"

const reportStatus = message => {
  $("#status-message").html(message);
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

// TODO implement this when the 'create trip' is implemented
// const clearForm = () => {
//   FORM_FIELDS.forEach(field => {
//     inputField(field).val("");
//   });
// };

// To call more than one trip
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trips-list');
  tripList.empty();

  axios.get(TRIPS_URL)
  // success (think of it as an "if")
  .then(response => {

    let location = response.data.results

    console.log(location);

    reportStatus(`Yay we successfully added ${response.data.length} trip(s)!`);

    response.data.forEach(trip => {
      console.log(trip);
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
    }); //ends forEach loop
  }) // ends .then

  // failure ("else this other thing")
  .catch(error => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  }); // ends .catch
}; // ends const loadTrips

// To call only one trip
const loadTrip = function loadTrip(selectedTripID) {
  reportStatus('Loading one trip...');
  console.log(selectedTripID);
  axios.get(TRIP_URL + `${selectedTripID}`)
  .then(response => {
    // reportStatus(`Successfully added trip with ID ${response.data.id}!`);
    // clearForm(); // TODO <-- do we need this???
    console.log(response);
    const tripDetails = $('#trip-details');

    tripDetails.empty();

    tripDetails.append(`<li><strong>ID: </strong>${response.data.id}</li><br>`);
    tripDetails.append(`<li><strong>Trip Name: </strong>${response.data.name}</li><br>`);
    tripDetails.append(`<li><strong>Continent: </strong>${response.data.continent}</li><br>`);
    tripDetails.append(`<li><strong>About: </strong>${response.data.about}</li><br>`);
    tripDetails.append(`<li><strong>Category: </strong>${response.data.category}</li><br>`);
    tripDetails.append(`<li><strong>Weeks: </strong>${response.data.weeks}</li><br>`);
    tripDetails.append(`<li><strong>Cost: </strong>${response.data.cost}</li><br>`);
  })

  .catch(error => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
}; // ends const loadTrip

const FORM_FIELDS = ["name", "email", "trip name"];
const inputField = name => $(`trip-form-input[name="${name}"]`);

// const readFormData = () => {
//   const getInput = name => {
//     const input = inputField(name).val();
//     return input ? input : undefined;
//   };
//
//   const formData = {};
//   FORM_FIELDS.forEach(field => {
//     formData[field] = getInput(field);
//   });
//
//   return formData;
// };
//
// const clearForm = () => {
//   FORM_FIELDS.forEach(field => {
//     inputField(field).val("");
//   });
// };

const loadResForm = function loadResForm() {
  console.log('HEEEEEEEYYYYYYYY');
  const reserveTripForm = $(`.reserve-trip-form`);
  const tripForm =
    `<form>
      <div>
          <label for="name">Name</label>
          <input type="text" name="name" />
      </div>
      <div>
          <label for="email">Email</label>
          <input type="text" name="email" />
      </div>
    </form>`
  reserveTripForm.html(tripForm);

};

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trips-list').on( "click", "li", function() {
    let selectedTripID = (this.id)
    // console.log(selectedTripID);
    loadTrip(selectedTripID);
    loadResForm();
  });

}); // ends (document).ready

// When we add li to the page we can include the id attribute or class or data attribute that you can put in the DOM using "data-name" or "data-owner"
