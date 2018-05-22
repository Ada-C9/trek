const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

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
// Loading Pets
//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trips-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<li>${trip.name}</li>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

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
// OK GO!!!!!
//
$(document).ready(() => {
  $('#load').click(loadTrips);
  // $('#pet-form').submit(createPet);
});
