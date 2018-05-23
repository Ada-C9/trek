const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const loadTrips = () => {
  const tripList = $('#tbody');
  tripList.empty();
  axios.get(URL)
  .then((response) => {
    $("#table").show();
    response.data.forEach((trip) => {
      tripList.append(`<tr><td id='${trip.id}'>${trip.name}</td></tr>`);
    })
  })
  .catch((error) => {
    console.log(error);
  });
}

const loadTrip = function loadTrip(tripID) {
  const tripInfo = $('#detailBody')
  tripInfo.empty();
  axios.get(`${URL}/${tripID}`)
  .then((response) => {
    $("#trip-info").show();
    tripInfo.append(`<tr><td>Name: ${response.data.name}</td></tr>
      <tr><td>Trip ID: ${response.data.id}</td></tr>
      <tr><td>Continent: ${response.data.continent}</td></tr>
      <tr><td>Category: ${response.data.category}</td></tr>
      <tr><td>Weeks: ${response.data.weeks}</td></tr>
      <tr><td>Cost: ${response.data.cost}</td></tr>
      <tr><td>About:</br> ${response.data.about}</td></tr>`);
  })
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#tbody').on('click', 'td', function(event) {
    loadTrip(event.target.id)
  });
})
