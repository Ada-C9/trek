
const reportStatus = (content) => {
  $('status-message').html(content);
};

const reportErrors = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const name in errors) {
    for (const description of errors[name]) {
      content += `<li>${name}: ${description}</li>`
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const loadTrips = () => {
  const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
  reportStatus('Loading trips . . .')

  let tripList = $('#all-trips');
  tripList.empty();

  axios.get(URL)

    .then((response) => {
      response.data.forEach((response) => {
        let id = response.id;
        let tripName = response.name;
        // tripList.append(`<li><a href="https://ada-backtrek-api.herokuapp.com/trips/${id}">${tripName}</li>`);
        tripList.append(`<li class="trip-link" id="${id}">${tripName}</li>`);
        $(`#${id}`).click(() => {
          displayTrip(id);
        })
      });
    })

    .catch((error) => {
      reportStatus(`Had trouble loading trips: ${error.message}`);
      console.log(error);
    })
};

const displayTrip = (tripID) => {
  const URL = 'https://ada-backtrek-api.herokuapp.com/trips/' + `${tripID}`;
  let tripDetails = $('#trip-details');

  axios.get(URL)
    .then ((response) => {
      let tripName = response.data.name;
      tripDetails.html(tripName);
    })
    .catch((error) => {
      reportStatus(`Had trouble loading trips: ${error.message}`);
      console.log(error);
    })
};

$(document).ready(() => {
  $('#load-trips').click(loadTrips);
  // $('body').on('click', '.trip-link', function(event){
  //   let trip = event.target.id;
  //   (displayTrip(trip));
  // });
});
