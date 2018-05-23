const URL = "https://ada-backtrek-api.herokuapp.com/trips";

const loadTrips = function loadTrips() {
  //reportStatus("Loading trips... be patient");
  const tripList = $("#trip-list");
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      tripList.append("<h2>All Trips</h2>");

      response.data.forEach((trip) => {
        tripList.append(`<li id=${trip.id}>${trip.name}</li>`);
      });
      //reportStatus(`Successfully loaded ${response.data.length} trips`);
      //
    })
    .catch((error) => {
      //reportStatus(`Encountered an error while loading pets: ${error.message}`);
      console.log(error);
    });
};

const loadTripDetails = function loadTripDetails() {

  const tripDetails = $("#trip-details");
  tripDetails.empty();

  axios.get(URL + "/" + this.id)
    .then((response) => {
      let html = "";
      html += "<h2>Trip Details</h2>";
      html += `<h3>Name: ${this.innerHTML}<h3>`;
      html += `<h4>Continent: ${response.data.continent}</h4>`;
      html += `<h4>Category: ${response.data.category}</h4>`;
      html += `<h4>Weeks: ${response.data.weeks}</h4>`;
      html += `<h4>Cost: $${response.data.cost}</h4>`;
      html += `<h4>About:<h4><p>${response.data.about}</p>`;

      tripDetails.append(html);
    })
    .catch((error) => {
      console.log(error);
    });
};

const loadReserveTrip = function loadReserveTrip() {
  const reserveTrip = $("#reserve-trip");
  reserveTrip.empty();

  let html = "";
  html += "<h2>Reserve Trip</h2>";
  html += `<form id=${this.id}>`;
  html += "<div>";
  html += "<label for='name'>Your Name</label>";
  html += "<input type='text' id='name' />";
  html += "</div>";
  html += "<div>";
  html += "<label for='email'>Email</label>";
  html += "<input type='text' id='email' />";
  html += "</div>";
  html += `<input type='submit' value='Reserve' />`;
  html += "</form>";

  reserveTrip.append(html);
};

const makeReservation = (event) => {
  event.preventDefault();

  const entryData = {
    name: $("#name").val(),
    email: $("#email").val()
  };

  const tripID = $("form")[0].id;

  axios.post(URL + `/${tripID}/reservations`, entryData)
    .then((response) => {
      console.log("Success")
      console.log(response);

      $("#name").val(''),
      $("#email").val('')
      //reportStatus("Successfully reserved a trip");
    })
    .catch((error) => {
      console.log(error.response);
      //reportStatus(`Encountered an error: ${error.message}`);
    });
};

$(document).ready(() => {
  $("#load-trips").click(loadTrips);
  $("#trip-list").on("click", "li", loadTripDetails);
  $("#trip-list").on("click", "li", loadReserveTrip);
  $("#reserve-trip").submit(makeReservation);
});
