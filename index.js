const URL = 'https://ada-backtrek-api.herokuapp.com/trips/'


const reportStatus = (message) => {
  $('status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors){
    for (const problem of errors[field]){
      content += `<li>${field}: ${problem}</li>;`
    }
  }

  content += "</ul>";
  reportStatus(content);
};

const loadTrips = () => {
  reportStatus('Loading trips ...');


  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded`);
    response.data.forEach((trip) => {

      let id = trip.id

      tripList.append(`<li class="trip" id="${id}">${trip.name}</li>`);


    });
    //only returns one element

  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    reportError(error.message, error.response.data.errors)
    console.log(error);

  });

};

const clickTrip = (trip) => {
  console.log(trip)

  axios.get(URL+trip)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded`);

    console.log('appending to table body');

    $('tablebody').append(`<tr><th>Name</th><td>${response.data.name}</td></tr>`);

    $('tablebody').append(`<tr><th>Id</th><td>${response.data.id}</td></tr>`); $('tablebody').append(`<tr><th>Continent</th><td>${response.data.continent}</td></tr>`);  $('tablebody').append(`<tr><th>About</th><td>${response.data.about}</td></tr>`);
    $('tablebody').append(`<tr><th>Category</th><td>${response.data.category}</td></tr>`);
    $('tablebody').append(`<tr><th>Weeks</th><td>${response.data.weeks}</td></tr>`);
    $('tablebody').append(`<tr><th>Cost</th><td>${response.data.cost}</td></tr>`);



  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
    reportError(error.message, error.response.data.errors)
    console.log(error);

  });

};





$(document).ready(() => {
  $('#load').click(loadTrips);
  $('ul').on('click', 'li', function() {
    console.log(this)
    console.log(this.id)
    clickTrip(this.id)
  });



});
