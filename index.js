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
      $('#reserve h2').append("Reserve a Trip")
      $('#reserve p').append(`<strong>Trip:</strong> ${data.name}`);

      // $('#res-form').show();
      console.log('about to do reservation');

      $('#res-form').submit(function(event){
        console.log(event);
        event.preventDefault();
        reserveSpot(data.id);
        console.log('reservation completed');
      });


    })
    .catch((error) => {
      status(`Something went wrong while loading a trip: ${error.message}`);
    });

  const details = $("#details");
  const reserve = $("#reserve");
  // details.empty();
  // $('#reserve p').empty();
  // $('#reserve h2').empty();
  // reserve.empty();

};


const reserveSpot = function(id) {
  // const target = $(this).children();
  const URL = BASEURL +`/${id}/reservations`;
  const resData = {
    name: $('input[name="name"]').val(),
    age: parseInt($('input[age="age"]').val()),
    email: $('input[email="email"]').val()
  }

  axios.post(URL,resData)
    .then((response) => {
      $('input[name="name"]').val('');
      $('input[age="age"]').val('');
      $('input[email="email"]').val('');
      console.log(response)
      let data = response.data;
      status(`Successfully reserved a spot on ${data.name}`)
    })
    .catch((error) => {
      console.log('Something went wrong!')
      if(error.response.data && error.response.data.errors){
        console.log(error.response);
        error(error.message, error.response.data.errors);
      } else {
        status(`Something went wrong: ${error.message}`)
      }
    });
    // $('#res-form input').empty();
};


$(document).ready(() => {
  console.log('YOUR IN!');
  // $('#res-form').hide()
  $('#all-trips').click(loadAllTrips);
  $('#trips-body').on('click','td',(loadTrip));

});
