let numTrips = 0;

const loadTrips = () => {
  const URL = "https://ada-backtrek-api.herokuapp.com/trips"
  //FIXME: Reporting status supposed to be loading here. But currently not displaying trips that have loaded
  reportStatus('Loading trip...');

  // Setting up trip table that will correspond to the table with the given id in HTML and it empties out at the beginning
  const tripsList = $('#trip-table');
  tripsList.empty();

  // GET request time
  axios.get(URL)
  // if the request is successful do the below bit
  // this should build in our table body and headers
  .then((response) => {
    // tracking the number of trips loaded and reporting loading
    numTrips += response.data.length;
    reportStatus(`Successfully loaded ${numTrips} trips.`);
    // from the response, I want the data. From Data I want trip name
    response.data.forEach((trip) => {
      tripsList.append(`<li>${trip.name}</li>`);
    });
  })
  // do this if the response is not successful
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

const reportStatus = (message) => {
  $('#status-messages').html(message);
};

$(document).ready(() => {
  // on button click display all trips
  // TODO: eventually will put in a portion that will select for different buttons "View by Continent" etc........
  $('button').click(loadTrips);
  // let buttonClicked = this.innerHTML;
  // console.log(buttonClicked);
});
