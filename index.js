// API base url
const allTrips = 'https://ada-backtrek-api.herokuapp.com/trips/'

// Error Handling
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

// List All Trips
const loadTrips = () => {
  reportStatus('Loading trips...');
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(allTrips)
  .then((response) => {
    reportStatus(`Successfully loaded trips`);
    let results = response.data

    tripList.append('<h3>All Trips</h3>')
    results.forEach((result) => {
      tripList.append(`<li id="${result.id}"><strong>${result.name}</strong></li>`)
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  })
};

// List a single Trip
const singleTrip = (id) => {

  reportStatus('Loading trip..');
  const tripDetail = $('#trip-detail');
  tripDetail.empty();
  $('#form-page').show();

  axios.get(allTrips + id)
  .then((response) => {

    reportStatus(`Successfully loaded trip`);
    tripDetail.append('<h3>Trip Detail:</h3>')
    let detail = response.data;
    tripDetail.append(`<li><ID: ${detail.id}</li>
      <li>Trip: ${detail.name}</li>
      <li>Continent: ${detail.continent}</li>
      <li>Category: ${detail.category}</li>
      <li>Weeks: ${detail.weeks}</li>
      <li>Price:$ ${detail.cost}</li>
      <li>About: ${detail.about}</li><br></br>`);
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
      console.log(error);
    })

    $('#form-page').submit(function(event) {
      event.preventDefault();
      reserveTrip(id);
    });
  };

  // Reserve a Trip
  const reserveTrip = (id) => {
    const reserveData = {
      name: $('input[name="name"]').val(),
      email: $('input[email="email"]').val(),
    };

    reportStatus(`Attempting to Add Reservation for ${reserveData.name}`);
    let reserveUrl = allTrips + id + '/reservations'

    axios.post(reserveUrl, reserveData)
    .then((response) => {
      reportStatus(`Successfully added reservation for ${reserveData.name}, Trip Number: ${response.data.trip_id}`);
      console.log(response)
    })
    .catch((error) => {
      console.log(error.response);
      reportError(error.message, error.response.data.errors);
    });
    $('#form-page')[0].reset();
  };

  // Display
  $(document).ready(() => {
    $('#load').click(loadTrips);
    $('#form-page').hide()
    $('#trip-list').on('click', 'li', function() {
      singleTrip(this.id);
    });
  });
