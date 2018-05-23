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


$(document).ready(() => {
  $('#load').click(loadTrips);

  // clicking on individual trip to load details into trip-details section
  $('#trip-list').on('click', '.trip-link', function(event) {
    event.preventDefault();
    let id = $(this).attr('id');

    const tripDetails = $('#trip-details');
    tripDetails.empty();
    console.log('asdfalksj')

    let pageURL = TRIPSURL + `/${id}`
    axios.get(pageURL)
      .then((response) => {
        console.log(response.data)
          tripDetails.append(`<p><h1>${response.data.name}</h1></p> <p>${response.data.continent}</p><p><h3>About: </h3>${response.data.about}</p><p> <h3>Category:</h3>${response.data.category}</p>`);

        reportStatus('Trip details loaded :)');
      })
        // axios is giving us this error object to use
      .catch((error) => {
        console.log(error);
        reportStatus(`Error: ${error.message}`)
      });

  });
});
