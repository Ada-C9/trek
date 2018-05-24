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
    response.data.forEach((trip) => {
      tripList.append(`<li class="trip" id="${trip.id}" tabindex="0">${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportError(`Encountered an error while loading trips: ${error.message}`);
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
    let trip = response.data
    let cost = parseInt(trip.cost).toLocaleString('en-US', {style: 'currency', currency: 'USD' });
    showTrip.append(`
      <ul class='trip-details'>
      <li class='name'>Name: ${trip.name}</li>
      <li class='continent'>Continent: ${trip.continent}</li>
      <li class='category'>Category: ${trip.category}</li>
      <li class='weeks'>Weeks: ${trip.weeks}</li>
      <li class='cost'>Cost: ${cost}</li>
      <li class='about'>About: ${trip.about}</li>
      </ul>
      `);

      reserveTrip.append(`
        <h1>Reserve Trip:</h1>
        <h2>${trip.name}</h2>
        <form id="reservation-form">
        <div>
        <label for="name">Name</label>
        <input type="text" name="name" />
        </div>

        <div>
        <label for="email">Email</label>
        <input type="text" name="email" />
        </div>

        <input type="submit" name="reserve-trip" value="make reservation" />
        </form>
        `);

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
          axios.post(URL + `/${this['id']}/reservations`, reservationData)
          .then((response) => {
            $('input[name="name"]').val('');
            $('input[name="email"]').val('');

            console.log(response);
            reportStatus(`Successfully added ${reservationData.name}
              with ID:  ${response.data.trip_id}`);
            })
            .catch((error) => {
              console.log('There was a problem');
              if (error.response.data && error.response.data.errors ) {
                console.log(error.response);
                reportError(error.message, error.response.data.errors);
              } else {
                reportStatus(`Encountered an Error: ${error.message}`)
              }
            });
          };
          $('#reservation-form').submit(createReservation);

        })
        .catch((error) => {
          reportError(`Encountered an error while loading trips: ${error.message}`);
          console.log(error);
        });

      };


      $(document).ready(() => {
        $('#load').click(loadTrips);
        $('#trip-list').on('click', 'li', loadTrip);

      });
