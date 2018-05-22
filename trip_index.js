const loadTrips = () => {
  const URL = "https://ada-backtrek-api.herokuapp.com/trips"
  //TODO: Reporting status needed here eventually

  // Setting up trip table that will correspond to the table with the given id in HTML
  // And we are making sure that it empties out at the beginning
  const tripsList = $('#trip-table');
  tripsList.empty();

  // GET request time
  axios.get(URL)
  // if the request is successful do the below bit
  // this should build in our table body and headers
  // FIXME: THIS
  .then((response) => {
    // from the response, i want the data
    response.data.forEach((trip) => {
      tripsList.append(`<li>${trip.name}</li>`);
    });
  })
  // do this if the response is not successful
  // TODO: Need to put in reportStatus for errors as well
  .catch((error) => {
    console.log(error);
  });
};

$(document).ready(() => {
  // on button click display all trips
  // TODO: eventually will put in a portion that will select for different buttons "View by Continent" etc........
  $('button').click(loadTrips);
  // let buttonClicked = this.innerHTML;
  // console.log(buttonClicked);
});
