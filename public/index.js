const URL = "https://ada-backtrek-api.herokuapp.com/trips"

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

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    $('.box-header').remove();
    tripList.before(`<h2 class="box-header">All Trips</h2>`);
    response.data.forEach((trip) => {
      tripList.append(`<li class="trip" id="${trip.id}" tabindex="0">${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportError(`There was a problem while loading trips: ${error.message}`);
    console.log(error);
  });
};

const loadTrip = function loadTrip() {
  reportStatus('Loading trips...');
  const showTrip = $('#show-trip');
  showTrip.empty();
  const reserveTrip = $('#reserve-trip');
  reserveTrip.empty();

  let trip_id = this.id;

  axios.get(URL + `/${trip_id}`)
  .then((response) => {
    reportStatus(`Successfully loaded trip with id: ${response.data.id}`);
    $('#trip-details').remove();
    showTrip.before(`<h2 class="box-header" id="trip-details">Trip Details</h2>`);

    let trip = response.data
    let cost = parseInt(trip.cost).toLocaleString('en-US', {style: 'currency', currency: 'USD' });
    showTrip.html(`
      <li><strong>Name:</strong> ${trip.name}</li>
      <li><strong>Continent:</strong> ${trip.continent}</li>
      <li><strong>Category:</strong> ${trip.category}</li>
      <li><strong>Weeks:</strong> ${trip.weeks}</li>
      <li><strong>Cost:</strong> ${cost}</li>
      <li class='about'><strong>About:</strong> ${trip.about}</li>
      `
    );

    reserveTrip.html(`
      <h2 class="box-header">Reserve Trip: </h2>
      <form id="reservation-form">
      <div>
      <label for="name">Name</label>
      <input type="text" name="name" />
      </div>

      <div>
      <label for="email">Email</label>
      <input type="text" name="email" />
      </div>

      <div id="trip-name">
      <strong>Trip Name:</strong> ${trip.name}
      </div>

      <input type="submit" name="reserve-trip" value="make reservation" />
      </form>
      `
    );

    const createReservation = (event) => {
      event.preventDefault();
      // const reservationData = readFormData();
      // console.log(reservationData);

      const reservationData = {
        name: $('input[name="name"]').val(),
        email: $('input[name="name"]').val(),
      };

      reportStatus(`Attempting to Add ${reservationData.name}`);
      console.log(this);

      axios.post(URL + `/${this.id}/reservations`, reservationData)
      .then((response) => {
        $('input[name="name"]').val('');
        $('input[name="email"]').val('');

        console.log(response);
        reportStatus(`Successfully added ${reservationData.name}
          with ID:  ${response.data.trip_id}`);
        }
      )
      .catch((error) => {
        console.log('There was a problem');
        if (error.response.data && error.response.data.errors ) {
          console.log(error.response);
          reportError(error.message, error.response.data.errors);
        } else {
          reportStatus(`Encountered an Error: ${error.message}`);
        }
      });
    };
    $('#reservation-form').submit(createReservation);

  })
  .catch((error) => {
    reportError(`There was a problem while loading trips: ${error.message}`);
    console.log(error);
  });

};

// adding a trip, didn't finish

// const FORM_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost' ];
// const inputField = name => $(`#trip-form input[name="${name}"]`);
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
//
// const createTrip = (event) => {
//   event.preventDefault();
//
//   const tripData = readFormData();
//   console.log(tripData);
//
//   reportStatus('Sending trip data...');
//
//   axios.post(URL, tripData)
//   .then((response) => {
//     reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
//     clearForm();
//   })
//   .catch((error) => {
//     console.log(error.response);
//     if (error.response.data && error.response.data.errors) {
//       reportError(
//         `There was a problem: ${error.message}`,
//         error.response.data.errors
//       );
//     } else {
//       reportStatus(`There was a problem: ${error.message}`);
//     }
//   });
// };


$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-list').on('click', 'li', loadTrip);
});
