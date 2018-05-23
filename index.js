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
      // console.log(trip);
      tripList.append(`<li>${trip.name}</li>`)
    });
    userMessage(`Showing ${tripCollection.length} amazing trips to choose from!`)
  })
  .catch((error) => {
    userMessage(`Hrmm.. something has gone wrong: ${error.message}`)
    console.log(error);
  });
};





$(document).ready (() => {
  $('#trips-button').click(loadTrips);
  // loadTrips()
});
