const URL = "https://ada-backtrek-api.herokuapp.com/trips"

const userMessage = (message) => {
  $('#user-message').html(message)
}

const loadTrips = function loadTrips() {
  const tripList = $('#trips-list');
  tripList.empty();
  userMessage('Loading in trips..')
  axios.get(URL)
  .then((response) => {
    const tripCollection = response.data
    // console.log(response);
    tripCollection.forEach((trip) => {
      console.log(trip);
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`)
    });
    userMessage(`Showing ${tripCollection.length} amazing trips to choose from!`)
  })
  .catch((error) => {
    userMessage(`Hrmm.. something has gone wrong: ${error.message}`)
    console.log(error);
  });
};

const loadClickedTrip = function loadClickedTrip(trip) {
   // id, name, continent, about, category, weeks and cost
   $('#selected-trip').empty();
  console.log(trip);
  axios.get(URL + `/${trip.id}`)
    .then((response) => {
      console.log(response);
      const selectedTrip = response.data
      $('#selected-trip').append('<h4 id="trip-table">Trip Information</h4>');
      $('#trip-table').append(`<p>Trip Name: ${selectedTrip.name}</p>`)
      $('#trip-table').append(`<p>Trip ID: ${selectedTrip.id}</p>`)
      $('#trip-table').append(`<p>Continent: ${selectedTrip.continent}</p>`)
      $('#trip-table').append(`<p>Category: ${selectedTrip.category}</p>`)
      $('#trip-table').append(`<p>Duration: ${selectedTrip.weeks}</p>`)
      $('#trip-table').append(`<p>Cost: $${selectedTrip.cost}</p>`)
      $('#trip-table').append(`<p>Description: ${selectedTrip.about}</p>`)

      // Load form
      buildForm(selectedTrip)
    })
    .catch((error) => {
      userMessage(`Hrmm.. something has gone wrong loading this trip! ${error.message}`)
      console.log(error);
    });

}

const buildForm = (selectedTrip) => {
  $('#trip-booking').empty();
  $("#trip-booking").append('<h4>Book A Trip!</h4>')
  $("#trip-booking").append(
    `<form><p>Trip: ${selectedTrip.name}</p><p>Name:<input type= "text" name="name"></p><p>Email:<input type="text" name="email"></p><input type="hidden" name="id" value="${selectedTrip.id}"><input class="button" type="submit" value="Submit"></form>`
  )
}

const reserveTrip = (event) => {
  event.preventDefault();
  const tripID = $('form')[0][2].value
  const reservationData = $('form').serialize()
  console.log($('form'));
  console.log(tripID);
  console.log(reservationData);
  axios.post(URL + `/${tripID}/reservations?${reservationData}`)
    .then((response) => {
      console.log(response);
      userMessage("Hooray! You've booked an exciting adventure!")
    })
    .catch((error) => {
      userMessage(`Hrmm.. something has gone wrong booking this trip! ${error.message}`)
      console.log(error);
    })
    $('form')[0].reset();
}


$(document).ready (() => {
  $('#trips-button').click(loadTrips);
  $('#trips-list').on("click", "li", function(){
    let trip = this;
    console.log(trip);
    loadClickedTrip(trip);
  });
  $('#trip-booking').submit(reserveTrip);

});
