$(document).ready( () => {
  const URL = "https://ada-backtrek-api.herokuapp.com/trips"
  $('#trips-button').click(() => {
    $('main').append('<ul id="trips-container"></ul>');
    axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        $('#trips-container').append(`<li>Trip ${trip.id}: ${trip.name}</li>`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  });
});
