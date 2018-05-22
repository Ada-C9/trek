const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

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


//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripsList = $('#trips-list');
  tripsList.empty();

  axios.get(URL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded ${response.data.length} pets`);
    response.data.forEach((trip) => {
      tripsList.append(`<li id="${trip.id}">${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
    console.log(error);
  });
};

$(`#trips-list`).on(`click`, `li`, function(){
  console.log(this.id);
  const tripid = this.id
  reportStatus("Loading trip...");

  const trip = $('#trip');
  trip.empty();

  axios.get(URL+tripid)
  .then((response) => {
    console.log(response);
     reportStatus(`Successfully loaded trip to: ${response.data.name}`);

     trip.append(
       `<tr><th>${response.data.name}</th></tr>
       <tr><th>${response.data.weeks} weeks</th></tr>
       <tr><th>Category</th><td>${response.data.category}</td></tr>
       <tr><th>Continent</th><td>${response.data.continent}</td></tr>
       <tr><th>Cost</th><td>${response.data.cost}</td></tr>
       `);
  });
});

//
// Creating Pets
//
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
// };
//
// //
// OK GO!!!!!
//
$(document).ready(() => {
  $('#load').click(loadTrips);
  // $('#pet-form').submit(createPet);
});
