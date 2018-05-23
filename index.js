const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading Trips! Please Wait...');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
      });
      reportStatus('Trips Loaded!');
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`);
    })
}
const loadTrip = (id) => {
  const tripInfo = $('#trip');
  tripInfo.empty();

  reportStatus('Loading Trip Details! Please Wait...')

  axios.get(URL + `/${id}`)
    .then((response) => {
      let data = response.data;
      console.log(data.name);
      tripInfo.append(`<h2>Trip Details</h2>`);
      tripInfo.append(`<h3><strong>Name:</strong> ${data.name}</h3>`);
      tripInfo.append(`<h3><strong>Continent:</strong> ${data.continent}</h3>`);
      tripInfo.append(`<h3><strong>Category:</strong> ${data.category}</h3>`);
      tripInfo.append(`<h3><strong>Weeks:</strong> ${data.weeks}</h3>`);
      tripInfo.append(`<h3><strong>Cost:</strong> $${data.cost}</h3>`);
      tripInfo.append(`<h3><strong>About:</strong></h3> <p>${data.about}</p>`);
      console.log(tripInfo);
      reportStatus('Trip Details Loaded!');
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`);
    })
}
$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-list').on('click', 'li', function() {
    let id = $(this).attr('id');
    loadTrip(id);
  });
  });
