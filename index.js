const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';


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


// LOAD ALL TRIPS


const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripsList = $('#trips-list');
  tripsList.empty();

  axios.get(URL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded ${response.data.length} pets`);
    response.data.forEach((trip) => {
      tripsList.append(`<li id="${trip.id}">${trip.name.toUpperCase()}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
    console.log(error);
  });
};


//LOAD ONE TRIP



const loadOneTrip = (event) => {
  console.log(event.target.id);
  const tripid = event.target.id;
  reportStatus("Loading trip...");
  const trip = $('#trip');
  trip.empty();
  const reservation = $(`#reserve-form`);
  reservation.empty();
  const tripTitle = $(`#triptitle`);
  tripTitle.empty();

  axios.get(URL+tripid)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded trip to: ${response.data.name}`);

    trip.append(
      `<tr><th>Duration</th><td>${response.data.weeks}</td></tr>
      <tr><th>ID</th><td>${response.data.id}</td></tr>
      <tr><th>Category</th><td>${response.data.category}</td></tr>
      <tr><th>Continent</th><td>${response.data.continent}</td></tr>
      <tr><th>About</th><td><div id="about">${response.data.about}</div></td></tr>
      <tr><th>Cost</th><td id="cost">$${response.data.cost}</td></tr>
      `);
      tripTitle.text(`${response.data.name.toUpperCase()}`);
      reservation.addClass(tripid);
      reservation.html(
        `<div>
        <label for="name">Name</label>
        <input type="text" name="name" />
        </div>
        <div>
        <label for="email">Email</label>
        <input type="email" name="email" />
        </div>
        <div>
        <input type="submit" name="add-pet" value="Reserve!" />
        </div>`);
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
      })
    };


    // MAKE ONE RESERVATION POST

    const createReservation = (event) => {
      console.log(event.target.className);
      const tripid = event.target.className;

      event.preventDefault();


      const reservationData = $(`#reserve-form`).serialize()
      console.log(reservationData)

      reportStatus('Making reservation...');

      axios.post(URL+tripid+`/reservations?`+reservationData)
      .then((response) => {
        console.log(response);
        reportStatus(`Your reservation has been made!`);

        $(`#reserve-form`)[0].reset();

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
      $('#reserve-form').submit(createReservation);
      $(`#trips-list`).on(`click`, `li`,(loadOneTrip));
    });
