const TRIPSURL = "https://ada-backtrek-api.herokuapp.com/trips";

const reportStatus = (message) => {
  $('#status-message').html(message);
}


const loadTrips = () => {
  // Prep work
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips! Please wait....');

  // Actually load the trips
  // axios is linked at the bottom of index.html
  axios.get(TRIPSURL)
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<li><a href="" class="trip-link" id="${trip.id}">${trip.name}</a></li>`);
      });

      reportStatus('Trips loaded :)');
    })
      // axios is giving us this error object to use
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`)
    });
};


const createReservation = (event) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  let tripData = {
    name: $(`input[name="name"]`).val(),
    age: $(`input[name="age"]`).val(),
    email: $(`input[name="email"]`).val()
  };

  axios.post(URL, petData)
    .then((response) => {
      console.log('we successed it!')
    })
    .catch((error) => {
      console.log('dangit');
    });

};

const reservationForm = '<form id="trip-form"><div><label for="name">Name</label><input type="text" name="name"/></div><div><labelfor="age">Age</label><input type="number" name="age" /></div><div><label for="email">Email</label><input type="text" name="owner" /></div><input type="submit" name="add-reservation" value="Reserve"/></form>'



$(document).ready(() => {
  $('#load').click(loadTrips);

  // clicking on individual trip to load details into trip-details section
  $('#trip-list').on('click', '.trip-link', function(event) {
    event.preventDefault();
    let id = $(this).attr('id');

  // empty sections so you can add new content with click
    const tripDetails = $('#trip-details');
    tripDetails.empty();
    const reserveTrip = $('#reserve-trip')
    reserveTrip.empty();

    console.log('asdfalksj')

    let pageURL = TRIPSURL + `/${id}`
    axios.get(pageURL)
      .then((response) => {
        console.log(response.data)
          tripDetails.append(`<p><h1>${response.data.name}</h1></p> <p>${response.data.continent}</p><p><h3>About: </h3>${response.data.about}</p><p> <h3>Category:</h3>${response.data.category}</p> <p><h3>Weeks: </h3>${response.data.weeks}</p><p><h3>Cost: </h3>${response.data.cost}`);

        reserveTrip.append(`<p>${response.data.name}</p>` + reservationForm)

        reportStatus('Trip details loaded :)');
      })
        // axios is giving us this error object to use
      .catch((error) => {
        console.log(error);
        reportStatus(`Error: ${error.message}`)
      });

    $('#trip-form').submit(createReservation);
  });
});
