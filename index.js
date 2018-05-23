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
// Loading All Trips
//
const loadTrips = () => {
  reportStatus('One sec! Loading trips...');

  const tripList = $('#trip-table');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      tripList.append(`<h3>All Trips</h3>`);
      response.data.forEach((trip) => {
        let id = trip.id
        tripList.append(`<tr><td data-id=${id} data-name='${trip.name}'>${trip.name}</tr></td>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
 };

//
// Loading Single Trip
//
// const loadTrip = () => {
//   reportStatus('Finding that trip...');
//
//   const singleTrip = $('#single-trip');
//   singleTrip.empty();
//
//   let tripId = $(this).attr('data-id');
//   let tripName = $(this).attr('data-name');
//
//   axios.get(URL + '${tripID}')
//     .then((response) => {
//       reportStatus(`Successfully loaded trip data`);
//       let trip = response.data;
//       singleTrip.append(`<li>Name: ${trip.name}</li>`);
//       singleTrip.append(`<li>Continent: ${trip.continent}</li>`);
//       singleTrip.append(`<li>About: ${trip.about}</li>`);
//       singleTrip.append(`<li>Category: ${trip.category}</li>`);
//       singleTrip.append(`<li>Weeks: ${trip.weeks}</li>`);
//       singleTrip.append(`<li>Cost: ${trip.cost}</li>`);
//       console.log('Getting a single trip');
//     })
//     .catch((error) => {
//       reportStatus(`Encountered an error while loading trips: ${error.message}`);
//       console.log(error);
//     });
//  };

//
// Reserving Trips
//

const FORM_FIELDS = ['name', 'email', 'trip_id'];
const inputField = name => $(`#reserve-trip input[name="${name}"]`);

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
    //added trigger reset to clear the disabled field
    $('#reserve-trip').trigger('reset');
  });
}

 const reserveTrip = (event) => {
   event.preventDefault();

   const tripData = readFormData();
   console.log(tripData);

   reportStatus('Reserving trip...');

   axios.post(URL + tripData.trip_id + '\/reservations', tripData)
     .then((response) => {
       reportStatus(`Successfully reserved a trip with ID ${response.data.trip_id}!`);

       clearForm();
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

  $('#load-all-trips').click(loadTrips);

  $('.specific-trip').hide();
  $('.reserve-trip').hide();
  $('#reserve-trip').submit(reserveTrip);

  // $('#trip-table').on('click', "td", loadTrip); //no idea why this didn't work
  //loadTrip function
  $('#trip-table').on('click', 'td', function() {

    reportStatus('Finding that trip...');

    const singleTrip = $('#single-trip');
    singleTrip.empty();

    $('.specific-trip').show();
    $('.reserve-trip').show();

    let tripId = $(this).attr('data-id');
    let tripName = $(this).attr('data-name');

    //set hidden form trip_id for reserve trip
    $('#trip_id').val(tripId);
    //set Trip name field for reserve trip
    $('#trip_name').val(tripName);

    axios.get(URL + tripId)
      .then((response) => {
        reportStatus(`Successfully loaded trip data`);
        let trip = response.data;
        singleTrip.append(`<li>Name: ${trip.name}</li>`);
        singleTrip.append(`<li>Continent: ${trip.continent}</li>`);
        singleTrip.append(`<li>About: ${trip.about}</li>`);
        singleTrip.append(`<li>Category: ${trip.category}</li>`);
        singleTrip.append(`<li>Weeks: ${trip.weeks}</li>`);
        singleTrip.append(`<li>Cost: ${trip.cost}</li>`);
        console.log('Getting a single trip');
      })
      .catch((error) => {
        reportStatus(`Encountered an error while loading trips: ${error.message}`);
        console.log(error);
      });
  })

});
