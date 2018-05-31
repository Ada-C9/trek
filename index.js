const URL = "https://ada-backtrek-api.herokuapp.com/trips";

const reportStatus = function reportStatus(message) {
  $('#status').html(message);
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

const loadTrips = function loadTrips() {
  reportStatus("Loading trips... be patient");

  const allTrips = $("#all-trips");
  const tripList = $("#trip-list");

  allTrips.remove();
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      tripList.before("<h2 id='all-trips'>All Trips</h2>");
      response.data.forEach((trip) => {
        tripList.append(`<li id=${trip.id}>${trip.name}</li>`);
      });
      reportStatus(`Successfully loaded ${response.data.length} trips`);
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error while loading trips: ${error.message}`);
      }
    });
};

const loadTripDetails = function loadTripDetails() {

  const tripDetails = $("#trip-details");
  tripDetails.empty();

  axios.get(URL + `/${this.id}`)
    .then((response) => {
      const trip = response.data;
      let html = "";

      html += `<h2>Trip Details</h2>
               <div>
                 <h3>Name: ${this.innerHTML}<h3>
                 <h4>Continent: ${trip.continent}</h4>
                 <h4>Category: ${trip.category}</h4>
                 <h4>Weeks: ${trip.weeks}</h4>
                 <h4>Cost: $${trip.cost}</h4>
                 <h4>About:</h4>
                 <p>${trip.about}</p>
               </div>`;

      tripDetails.append(html);
      reportStatus(`Successfully loaded trip data for ${trip.name}`);
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error while loading trip: ${error.message}`);
      }
    });
};

const loadReserveTrip = function loadReserveTrip() {

  const reserveTrip = $("#reserve-trip");
  reserveTrip.empty();

  let html = "";
  html += `<h2>Reserve Trip</h2>
           <h3>${this.innerHTML}</h3>
           <form id=${this.id}>
             <div>
               <label for='name'>Name:</label>
               <input type='text' id='name' />
             </div>
             <div>
               <label for='email'>Email:</label>
               <input type='text' id='email' />
             </div>
             <input type='submit' value='Reserve' />
           </form>`;

  reserveTrip.append(html);
};

const makeReservation = function makeReservation(event) {
  event.preventDefault();

  const entryData = {
    name: $("#name").val(),
    email: $("#email").val()
  };

  const tripID = event.target.id;

  axios.post(URL + `/${tripID}/reservations`, entryData)
    .then((response) => {
      console.log(response);

      reportStatus(`Successfully reserved trip ${tripID} for ${$("#name").val()}`);

      $("#name").val(''),
      $("#email").val('')
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error reserving trip: ${error.message}`);
      }
    });
};

$(document).ready(() => {
  $("#load-trips").click(loadTrips);
  $("#trip-list").on("click", "li", loadTripDetails);
  $("#trip-list").on("click", "li", loadReserveTrip);
  $("#reserve-trip").submit(makeReservation);
});
