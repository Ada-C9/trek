$(document).ready( () => {
  const URL = "https://ada-backtrek-api.herokuapp.com/trips"
  $('#trips-button').click(() => {
    $('main').append('<table id="trips-container"><tr><th>All Trips</th></tr></table>');
    axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        $('#trips-container').append(`<tr><td class="trip" id="${trip.id}">Trip ${trip.id}: ${trip.name}</td></tr>`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  });
  $('main').on('click', '.trip', function() {
    const id = $( this ).attr('id');
    axios.get(`${URL}/${id}`)
    .then((response) => {
        const trip = response.data;
        $('#details-container').html('<h3>Trip Details</h3>')
        $('#details-container').append(
          `<p><strong>Name:</strong> ${trip.name}</p>
          <p><strong>Continent:</strong> ${trip.continent}</p>
          <p><strong>Category:</strong> ${trip.category}</p>
          <p><strong>Weeks:</strong> ${trip.weeks}</p>
          <p><strong>Cost:</strong> ${trip.cost}</p>
          <p><strong>About:</strong></p><p>${trip.about}</p>`
        );
    })
    .catch((error) => {
      console.log(error);
    });
  });
});
