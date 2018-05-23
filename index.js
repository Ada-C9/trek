const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips, please wait...');

  axios.get(URL)
    .then((response) => {
      console.log(response);
      response.data.forEach((trip) => {
        let item = $(`<li>${trip.name}</li>`).attr('id', `${trip.id}`);
        // item.click(function() {
        //   getTripData(trip.id);
        // });
        tripList.append(item);
      });
      reportStatus(`Successfully loaded ${response.data.length} trips`)
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
    console.log(tripList);
};

const getTripDetails = function getTripDetails(id) {

  let tripDetail = $('#trip-detail-section');
  tripDetail.empty();

  axios.get(URL + id)
    .then((response) => {
      let data = response.data;
      let name = $(`<p><strong>Name:</strong> ${data.name}</h4>`);
      let continent = $(`<p><strong>Continent:</strong> ${data.continent}</p>`)
      let category = $(`<p><strong>Category:</strong> ${data.category}</p>`)
      let weeks = $(`<p><strong>Weeks:</strong> ${data.weeks}</p>`)
      let cost = $(`<p><strong>Cost:</strong> ${data.cost}</p>`)

      tripDetail.append(name, continent, category, weeks, cost);
      // $('#trip-detail-section').append(`<h4>Name: ${data.name}</h4>`);
      reportStatus(`Successfully loaded details for ${response.data.name} trip`)
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
}

$(document).ready(() => {
  $('#load').click(loadTrips);

  $('#trip-list').on('click', 'li', function(event) {
    let id = Number(event.target.id);
    $("section").removeClass("hidden");
    getTripDetails(id);
  });

});
