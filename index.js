const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const loadTrips = () => {
  const tripList = $('#tbody');
  tripList.empty();
  axios.get(URL)
  .then((response) => {
    $("#table").show();
    response.data.forEach((trip) => {
      tripList.append(`<tr><td>${trip.name}</td></tr>`);
      console.log(trip);
    })
  })
  .catch((error) => {
    console.log(error);
  });
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#tbody').on('click', 'td', function(event) {
    alert(`You clicked on a td containing ${$(this).data.id}!`);
  });
})
