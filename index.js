const BASEURL = "https://ada-backtrek-api.herokuapp.com/trips";


const loadAllTrips = () => {
  const trips = $("#trip-table");
  trips.empty();

  axios.get(BASEURL)
    .then((response) => {
      console.log(response);
      let data = response.data;

      data.forEach((trip) => {
        console.log(trip.name);
        $('#trip-table').html(trip.name);
      });
      // trips.html(`<tbody>${data}</tbody>`);
    });
};


$(document).ready(() => {
  console.log('YOUR IN!');
  $('#all-trips').click(loadAllTrips);
})
