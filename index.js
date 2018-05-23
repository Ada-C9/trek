const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

// add status in order to add colors??
// const reportStatus = (message, status) => {}..
const reportStatus = (message) => {
  $('#status-message').html(message);
};

const getTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading Trips...');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) =>{
        tripList.append(`<li><button id="${trip.id}" class="button trip">${trip.name}</button></li>`)
      });
      reportStatus('Trips Loaded!');
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus(`Error: ${error.message}`);
    });
};

const showTrip = (event) => {
  reportStatus('Loading Trip...');
  console.log(event.target.id);
  const tripId = event.target.id;
  const tripSection = $('#show-trip').empty();

  // console.log('Trip clicked');
  axios.get(URL + `/${tripId}`)
    .then((response) => {
      console.log(response.data);
      // $('#trip-name').text(response.data.name); //CALL NEW FUNCTION TO BUILD HTML
      // tripSection.append(buildTrip(response.data));
      let html = buildTrip(response.data);
      tripSection.append(html);
      reportStatus(`Trip #${tripId} Loaded!`);
    })
    .catch((error) => {
      console.log(error.message);
      reportStatus(`Error: ${error.message}`);
    });
};

const buildTrip = (tripData) => {
  return (`<div>
            <h3>Name: ${tripData.name} </h3>
            <p>Continent: ${tripData.continent} </p>
            <p>Category: ${tripData.category} </p>
            <p>Weeks: ${tripData.weeks} </p>
            <p>Cost: $${tripData.cost} </p>
            <p>About: ${tripData.about} </p>
          </div>`);
};

$(document).ready(() => {
  $('#all-trips').click(getTrips);
  $('#trip-list').on('click', 'li', showTrip);
});
