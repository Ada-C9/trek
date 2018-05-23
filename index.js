const URL = 'https://ada-backtrek-api.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message)
}

const loadTrips = (event) => {
  $('.all-trips').removeClass('display-none');

  const tripList = $('#trip-list');
  tripList.empty(); // empty out the list each time so there aren't duplilcates

  reportStatus('Loading trips! Please wait...')

  // get info
  axios.get(URL) // returns a promise
    .then((response) => {
      response.data.forEach((trip) => {
        // console.log(response.data);
        tripList.append(`<p>${trip.name}<span>${trip.id}</span></p>`);
      });
      reportStatus('Trips loaded!')
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`${error.message}`)
    });
}

const loadDetails = function(event) {
  const tripDetails = $('#details');
  tripDetails.empty();

  let trip = $(this).find('span').html()

  $('.trip-details').removeClass('display-none');

  reportStatus('Loading trip details! Please wait...')

  // get details
  axios.get(`${URL}\\${trip}`) // returns a promise
    .then((response) => {
      console.log(response.data);
      let tripData = response.data
      tripDetails.append(
        `<h2>Trip Details</h2>
        <h3>Name: ${tripData.name}</h3>
        <p>Continent: ${tripData.continent}</p>
        <p>Category: ${tripData.category}</p>
        <p>Weeks: ${tripData.weeks}</p>
        <p>Cost: ${tripData.cost}</p>
        <p>About: <br/> ${tripData.about}</p>`);

      reportStatus('Trip details loaded!')
    })

    .catch((error) => {
      console.log(error);
      reportStatus(`${error.message}`)
    });

}




$(document).ready(() => {
  $('#trips-button').click(loadTrips);
  $('#trip-list').on('click', 'p', loadDetails);
});
