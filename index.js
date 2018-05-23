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
  $('#trip-list').on('click', '.trip-link', function(event) {
    // event.preventDefault();
    console.log('lkasjdfl');
    let id = $(this).attr('id');
    alert(id);
  });
});
