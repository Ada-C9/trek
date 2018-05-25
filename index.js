const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

// helper methods
const reportStatus = (message) => {
  $('#status-message').html(message);
}

const setupTripsView = (title, action) => {
  $('#trips').show();
  const trips = $('#trips');
  trips.empty();
  trips.append(`<h2>${title}</h2>`);
  trips.append('<ul id="trip-list"></ul>');
  reportStatus(`${action} Trips! Please Wait...`);
}

const filterAndShowData = (data, tripList) => {
  let continent = '';
  let weeks = Infinity;

  if ($('#search-continent').val()) {
    continent = $('#search-continent').val();
    data = data.filter(trip => trip.continent === continent);
  }
  if ($('#max-weeks').val()) {
    weeks = $('#max-weeks').val();
    data = data.filter(trip => trip.weeks <= weeks);
  }

  data.forEach((trip) => {
    tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
  });

  if (data.length > 0) {
    reportStatus('Trips Loaded!');
  } else {
    reportStatus('No Record Found!');
  }
}

const appendTripDetails = (data, tripDetails) => {
  tripDetails.append(`<h2>Trip Details</h2>`);
  tripDetails.append(`<h3><strong>ID:</strong> ${data.id}</h3>`);
  tripDetails.append(`<h3><strong>Name:</strong> ${data.name}</h3>`);
  tripDetails.append(`<h3><strong>Continent:</strong> ${data.continent}</h3>`);
  tripDetails.append(`<h3><strong>Category:</strong> ${data.category}</h3>`);
  tripDetails.append(`<h3><strong>Weeks:</strong> ${data.weeks}</h3>`);
  tripDetails.append(`<h3><strong>Cost:</strong> $${data.cost}</h3>`);
  tripDetails.append(`<h3><strong>About:</strong></h3> <p>${data.about}</p>`);
}

const appendReservationForm = (data, reservationForm) => {
  reservationForm.append(
    `<h2>Reserve This Trip</h2>`
  );
  reservationForm.append(
    `<div>
      <label class="user-form">Your Name:</label>
      <input type="text" name="user-name" class="user-form" />
    </div>`
  );
  reservationForm.append(
    `<div>
      <label class="user-form">Your Email:</label>
      <input type="text" name="email" class="user-form" />
    </div>`
  );
  reservationForm.append(
    `<label>Trip: ${data.name}</label>`
  );
  reservationForm.append(
    `<input type="submit" name="reserve-trip" value="Reserve" class="button reserve" id="res${data.id}" />`
  );
}

// handler methods
const loadTrips = () => {
  reportStatus('');
  setupTripsView('All Trips', 'Loading');
  const tripList = $('#trip-list');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
      });
      reportStatus('Trips Loaded!');
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`);
    });
}

const loadTrip = (id) => {
  reportStatus('');
  $('.trip-container').show();
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  const reservationForm = $('#reservation-form');
  reservationForm.empty();
  reportStatus('Loading Trip Details! Please Wait...')

  axios.get(URL + `/${id}`)
    .then((response) => {
      let data = response.data;
      appendTripDetails(data, tripDetails);
      appendReservationForm(data, reservationForm);
      reportStatus('Trip Details Loaded!');
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`);
    });
}

const reserveTrip = (id) => {
  reportStatus('');
  reportStatus('Reserving The Trip...');

  let userData = {
    'name': $('input[name="user-name"]').val(),
    'email': $('input[name="email"]').val()
  }
  axios.post(URL + `/${id}/reservations`, userData)
    .then((response) => {
      reportStatus(`Successfully reserved this trip with the name ${response.data.name}`);
      })
    .catch((error) => {
      reportStatus(`Encountered an error: ${error.message}`);
      });

  $('input[name="user-name"]').val('');
  $('input[name="email"]').val('');
}

const showCreateTripForm = () => {
  reportStatus('');
  $('#create-trip-form').show();
  const createTripForm = $('#create-trip-form');
  createTripForm.empty();

  createTripForm.append(
    `<h2>Create A Trip</h2>`
  );
  createTripForm.append(
    `<div>
      <label class="trip-form">Name:</label>
      <input type="text" name="name" class="trip-form" />
    </div>`
  );
  createTripForm.append(
    `<div>
      <label class="trip-form">Continent:</label>
      <select id="continent" class="trip-form">
        <option value="" selected disabled>Please select an option...</option>
        <option value="Africa">Africa</option>
        <option value="Asia">Asia</option>
        <option value="Australasia">Australasia</option>
        <option value="Europe">Europe</option>
        <option value="North America">North America</option>
        <option value="South America">South America</option>
      </select>
    </div>`
  );
  createTripForm.append(
    `<div>
      <label class="trip-form">Category:</label>
      <input type="text" name="category" class="trip-form" />
    </div>`
  );
  createTripForm.append(
    `<div>
      <label class="trip-form">Weeks:</label>
      <input type="number" name="weeks" class="trip-form" />
    </div>`
  );
  createTripForm.append(
    `<div>
      <label class="trip-form">Cost($):</label>
      <input type="number" name="cost" class="trip-form" />
    </div>`
  );
  createTripForm.append(
    `<div>
      <label class="trip-form">About:</label>
      <textarea id="about" name="about" rows="10" cols="20" class="trip-form"></textarea>
    </div>`
  );
  createTripForm.append(
    `<input type="submit" name="create-trip" value="Create" class="button" id="create-trip"/>`
  );
}

const createTrip = () => {
  reportStatus('');
  $('#create-trip-form').show();
  reportStatus('Creating The Trip...');

  let tripData = {
    'name': $('input[name="name"]').val(),
    'continent': $('#continent option:selected').val(),
    'category': $('input[name="category"]').val(),
    'weeks': $('input[name="weeks"]').val(),
    'cost': $('input[name="cost"]').val(),
    'about': $('#about').val()
  }
  axios.post(URL, tripData)
    .then((response) => {
      reportStatus(
        `Successfully created a trip with the name ${response.data.name}`
      );
    })
    .catch((error) => {
      reportStatus(`Encountered an error: ${error.message}`);
    });

  $('input[name="name"]').val('');
  $('#continent option:selected').val('');
  $('input[name="category"]').val('');
  $('input[name="weeks"]').val('');
  $('input[name="cost"]').val('');
  $('#about').val('');
}

const showSearchTripsForm = () => {
  reportStatus('');
  $('#search-trips-form').show();
  const searchTripsForm = $('#search-trips-form');
  searchTripsForm.empty();

  searchTripsForm.append(
    `<h2>Search Trips</h2>`
  );
  searchTripsForm.append(
    `<div>
      <label class="search-form">Continent:</label>
      <select id="search-continent" class="search-form">
        <option></option>
        <option value="Africa">Africa</option>
        <option value="Asia">Asia</option>
        <option value="Australasia">Australasia</option>
        <option value="Europe">Europe</option>
        <option value="North America">North America</option>
        <option value="South America">South America</option>
      </select>
    </div>`
  );
  searchTripsForm.append(
    `<div>
      <label class="search-form">Max Amount of Weeks:</label>
      <input id="max-weeks" type="number" name="max-weeks" class="search-form" />
    </div>`
  );
  searchTripsForm.append(
    `<div>
      <label class="search-form">Max Budget($):</label>
      <input id="budget" type="number" name="budget" class="search-form" />
    </div>`
  );
  searchTripsForm.append(
    `<input type="submit" name="search" value="Search" class="button" id="search-by-budget"/>`
  );
}

const searchByBudget = () => {
  reportStatus('');
  setupTripsView('Search Results', 'Searching');
  const tripList = $('#trip-list');

  if ($('#budget').val()) {
    let queryString = '/budget?query=' + $('#budget').val();
    axios.get(URL + queryString)
      .then((response) => {
        if (response.data) {
          filterAndShowData(response.data, tripList);
        } else {
          reportStatus('No Record Found!');
        }
      })
      .catch((error) => {
        reportStatus(`Error: ${error.message}`);
      });
  } else {
    axios.get(URL)
      .then((response) => {
        if (response.data) {
          filterAndShowData(response.data, tripList);
        } else {
          reportStatus('No Record Found!');
        }
      })
      .catch((error) => {
        reportStatus(`Error: ${error.message}`);
      });
  }
}

// listeners
$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trips').on('click', 'li', function() {
    let id = $(this).attr('id');
    loadTrip(id);
  });
  $('#reservation-form').on('click', '.reserve', function(){
    let id = $(this).attr('id').substr(3);
    reserveTrip(id);
  });

  $('#create').click(showCreateTripForm);
  $('#create-trip-form').on('click', '#create-trip', function(){
    createTrip();
  });

  $('#search').click(showSearchTripsForm);
  $('#search-trips-form').on('click', '#search-by-budget', function(){
    searchByBudget();
  });
})
