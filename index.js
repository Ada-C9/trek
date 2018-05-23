

// TODO refine these URLs
const TRIPS_URL = "https://ada-backtrek-api.herokuapp.com/trips"
const TRIP_URL = "https://ada-backtrek-api.herokuapp.com/trips/1"

// TODO define reportStatus

// To call more than one trip
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trips-list');
  tripList.empty();

    axios.get(URL)
      // if this happens
      .then((response) => {
        console.log(response);
        let location = response.data.results[0].geometry.location
        reportStatus(`Yay we successfully added ${response.data.length} trip(s)!`)

        response.data.forEach(trip) => {
          const tripObject = $(`<li id="${trip.id}"></li>`);
          tripList.append(tripObject);
          tripObject.click(() => {
            const TRIPS_URL = "https://ada-backtrek-api.herokuapp.com/trips" + trip.id;
          })
        }); //ends forEach loop
      })

      // else this other thing
      .catch(error => {
        reportStatus(`Encountered an error while loading trips: ${error.message}`);
        console.log(error);
      });


)}; // ends const loadTrips

// To call only one trip
const loadTrip = () => {
  reportStatus('Loading one trip...');
  // TODO make sure this URL below is correct
  axios.get(TRIP_URL + trip.id)
}

$(document).ready(() => {
  loadTrips()
});


// When we add li to the page we can include the id attribute or class or data attribute that you can put in the DOM using "data-name" or "data-owner"

// make a click handler inside the .then in a forEach loop...
