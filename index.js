
const allTripsURL = 'https://ada-backtrek-api.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};


const listallTrips = () => {
  const tripsList = $('#tripList')
  tripsList.empty();

  axios.get(allTripsURL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} Wonders`);
    console.log(response);
    const result = response.data
    result.forEach((place) => {
      tripsList.append(`<li id='${place.id}'>${place.name}</li>`);
    })
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

}; //end of listallTrips

const tripDetails = (trip) => {
  singleTripUrl = 'https://ada-backtrek-api.herokuapp.com/trips/'
  console.log(trip);

  axios.get(singleTripUrl + trip.id)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} Wonders`);
    console.log(response);
    const result = response.data
    for (attr in result) {
    }
    }((place) => {
      tripsList.append(`<li id='${place.id}'>${place.name}</li>`);
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

});

}; //end of Trip details



$(document).ready(() => {
  $('#load').click(listallTrips);

  $('ul').on('click', 'li', function(){

    const trip = this

    tripDetails(trip);



  });

});
