

const loadTrips = () => {
  const tripList = $('#tripa-list');
  tripList.empty();
  axios.get(URL)
    .then((response) => {

    })
    .catch((error) => {

    });
};




$(document).ready (() => {
  $('#trips-button').click(loadTrips);
});
