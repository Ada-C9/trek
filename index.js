const URL = "https://ada-backtrek-api.herokuapp.com/trips"

const userMessage = (message) => {
  $('#user-message').html(message)
}

const loadTrips = () => {
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

function loadClickedTrip(trip) {
   // id, name, continent, about, category, weeks and cost
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

    })
    .catch((error) => {
      userMessage(`Hrmm.. something has gone wrong loading this trip! ${error.message}`)
      console.log(error);
    });

}

$(document).ready (() => {
  $('#trips-button').click(loadTrips);
  $('#trips-list').on("click", "li", function(){
    let trip = this;
    console.log(trip);
    loadClickedTrip(trip);
  });

});
//   $(".note").click(function(){
//       let note = $(this).html();
//       playNote (note);
//   })
