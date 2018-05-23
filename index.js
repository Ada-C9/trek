const URL = "https://ada-backtrek-api.herokuapp.com/trips"

const loadTrips = () => {
  const tripList = $('#trips-list');
  tripList.empty();
  axios.get(URL)
  .then((response) => {
    const tripCollection = response.data
    console.log(response);
    tripCollection.forEach((trip) => {
      console.log(trip);
      tripList.append(`<li>${trip.name}</li>`)
    });
  });
  // .catch((error) => {
  //
  // });
};





$(document).ready (() => {
  $('#trips-button').click(loadTrips);
  // loadTrips()
});
