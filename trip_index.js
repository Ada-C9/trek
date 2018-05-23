let numTrips = 0;

const loadTrips = () => {
  const URL = "https://ada-backtrek-api.herokuapp.com/trips"
  reportStatus('Loading trip...');

  // Setting up trip table that will correspond to the table with the given id in HTML and it empties out at the beginning
  const tripsList = $('#trips-table');
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
      tripsList.append(`<li class="${trip.id}">${trip.id}: ${trip.name}</li>`);
    });
  })
  // do this if the response is not successful
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

// TODO: Figure out how to pass the id of the thing we clicked on as a parameter
const displayTrip = (event) => {
  console.log(event);

  let id = event.target.className;

  const tripURL = 'https://ada-backtrek-api.herokuapp.com/trips/';
  // making sure we clear out all trip deets

  const tripDetails = $('#trip-deets');
  tripDetails.empty();

  // GET request, need to include the id of the
  axios.get(tripURL + id)

  .then((response) => {
    reportStatus('Successfully loaded trip details');

    // from the response I want the data. from the data I want all of the current values
    // FIXME: Want to display the detail name before it by accessing the name of the keys
    
    // for (let key in response.data) {
    //   tripDetails.append(`<li> ${response.data('key')} </li>`);
    // }
    for (let detail1 in response.data) {
      tripDetails.append(`<li> ${response.data[detail1]} </li>`);
    }
  })
};


const reportStatus = (message) => {
  $('#status-messages').html(message);
};

$(document).ready(() => {
  // on button click display all trips
  // TODO: eventually will put in a portion that will select for different buttons "View by Continent" etc........
  // let buttonClicked = this.innerHTML;
  // console.log(buttonClicked);
  $('button').click(loadTrips);
  // event for clicking on a trip in trips list gets us a trips id
  $('#trips-table').on('click', 'li', displayTrip)
});
