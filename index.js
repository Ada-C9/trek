const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const getTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) =>{
        tripList.append(`<li>${trip.name}</li>`)
        // console.log(trip.name);
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

$(document).ready(() => {
  $('#all-trips').click(getTrips);
});
