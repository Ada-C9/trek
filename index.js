const BASEURL = "https://ada-backtrek-api.herokuapp.com/trips";

const status = (message) => {
  $('#status-message').html(message);
};

const errors = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for(const field in errors){
    for(const problem of errors[field]) {
      content += `<li> ${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  status(content);
};

const loadAllTrips = () => {
  status('Loading trips...');
  // const trips = $("#trip-table");
  axios.get(BASEURL)
  .then((response) => {
    status('Successfully loaded trips');
    // console.log(response);
    let data = response.data;
    $('#trip-table thead').append('<h2>All Trips</h2>')
    data.forEach((trip) => {
      let row = `<tr class="deeds">`;
      row += `<td><a id="${trip.id}" href ='#'>` + trip.name + '</a></td>';
      row += '</tr>'

      $('#trip-table tbody').append(row);
    });
    // trips.empty();
  })
  .catch((error) => {
    status(`Something went wrong while loading trips: ${error.message}`);
  });
};



const loadTrip = function(event) {
  status('Loading trip...');

  event.preventDefault();
  const target = $(this).children();

  axios.get(BASEURL + `/${target[0].id}`)
    .then((response) => {
      status('Successfully loaded trip');
      let data = response.data;
      console.log('this is the response of clicking on an individual trip');
      console.log(data);
      $('#details').append('<h2>Trip Details<h2>');
      $('#details').append(`<p><strong>Name:</strong> ${data.name}</p>`);
      $('#details').append(`<p><strong>Continent:</strong> ${data.continent}</p>`);
      $('#details').append(`<p><strong>Category:</strong> ${data.category}</p>`);
      $('#details').append(`<p><strong>Weeks:</strong> ${data.weeks}</p>`);
      $('#details').append(`<p><strong>Cost:</strong> ${data.cost}</p>`);
      $('#details').append(`<p><strong>About:</strong> ${data.about}</p>`);

      // reserve trip data
      $('#reserve').append("<h2>Reserve a Trip</h2>")
      $('#reserve').append(`<p><strong>Trip:</strong> ${data.name}</p>`);

    })
    .catch((error) => {
      status(`Something went wrong while loading a trip: ${error.message}`);
    });

  const details = $("#details");
  const reserve = $("#reserve");
  details.empty();
  reserve.empty();

};

const reserveSpot = function() {
  const target = $(this).children();
  const URL = BASEURL +`/${target[0].id}/reservations`
  // name(string)
  // age(integer)
  // email(string)

};


$(document).ready(() => {
  console.log('YOUR IN!');
  $('#all-trips').click(loadAllTrips);
  $('#trips-body').on('click','td',(loadTrip));
  // $('#reserve')
});
