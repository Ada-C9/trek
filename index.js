const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
let queryString = "/";

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {
  $('.create-trip-form').hide();
  $('.search-results').hide();
  $('.trip-container').hide();
  $('.all-trips').show();
  const allTrips = $('.all-trips');
  allTrips.empty();
  allTrips.append('<h2>All Trips</h2>');
  allTrips.append('<ul id="trip-list"></ul>');
  const tripList = $('#trip-list');

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
  $('.trip-container').show();
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  const reservationForm = $('#reservation-form');
  reservationForm.empty();

  reportStatus('Loading Trip Details! Please Wait...')

  axios.get(URL + `/${id}`)
    .then((response) => {
      let data = response.data;
      tripDetails.append(`<h2>Trip Details</h2>`);
      tripDetails.append(`<h3><strong>ID:</strong> ${data.id}</h3>`);
      tripDetails.append(`<h3><strong>Name:</strong> ${data.name}</h3>`);
      tripDetails.append(`<h3><strong>Continent:</strong> ${data.continent}</h3>`);
      tripDetails.append(`<h3><strong>Category:</strong> ${data.category}</h3>`);
      tripDetails.append(`<h3><strong>Weeks:</strong> ${data.weeks}</h3>`);
      tripDetails.append(`<h3><strong>Cost:</strong> $${data.cost}</h3>`);
      tripDetails.append(`<h3><strong>About:</strong></h3> <p>${data.about}</p>`);

      reservationForm.append(`<h2>Reserve Trip</h2>`);
      reservationForm.append(
        `<div><label class="user">Your Name:</label>
        <input type="text" name="user-name" class="user" /></div>`
      );
      reservationForm.append(
        `<div><label class="user">Your Email:</label>
        <input type="text" name="email" class="user" /></div>`
      );
      reservationForm.append(`<label>Trip: ${data.name}</label>`);
      reservationForm.append(
        `<input type="submit" name="reserve-trip" value="Reserve" class="button reserve" id="res${data.id}" />`
      );

      reportStatus('Trip Details Loaded!');
    })
    .catch((error) => {
      reportStatus(`Error: ${error.message}`);
    })
}

const reserveTrip = (id) => {
  let userData = {
    'name': $('input[name="user-name"]').val(),
    'email': $('input[name="email"]').val()
  }

  reportStatus('Reserving The Trip...');

  axios.post(URL + `/${id}/reservations`, userData)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully reserved this trip with the name ${response.data.name}`);
    })
  .catch((error) => {
    console.log(error.response);
    reportStatus(`Encountered an error: ${error.message}`);
    });

  $('input[name="user-name"]').val('');
  $('input[name="email"]').val('');
}

const showCreateTripForm = () => {
  $('.all-trips').hide();
  $('.trip-container').hide();
  $('.create-trip-form').show();
  const createTripForm = $('.create-trip-form');
  createTripForm.empty();

  createTripForm.append(`<h2>Create Trip</h2>`);
  createTripForm.append(`<div>
    <label class="trip">Name:</label>
    <input type="text" name="name" class="trip" />
    </div>`);
  createTripForm.append(`<div>
    <label class="trip">Continent:</label>
    <select id="continent" class="trip">
      <option value="" selected disabled>Please select an option...</option>
      <option value="Africa">Africa</option>
      <option value="Asia">Asia</option>
      <option value="Australasia">Australasia</option>
      <option value="Europe">Europe</option>
      <option value="North America">North America</option>
      <option value="South America">South America</option>
    </select>
    </div>`);
  createTripForm.append(`<div>
    <label class="trip">Category:</label>
    <input type="text" name="category" class="trip" />
    </div>`);
  createTripForm.append(`<div>
    <label class="trip">Weeks:</label>
    <input type="number" name="weeks" class="trip" />
    </div>`);
  createTripForm.append(`<div>
    <label class="trip">Cost: $</label>
    <input type="number" name="cost" class="trip" />
    </div>`);
  createTripForm.append(`<div>
    <label class="trip">About:</label>
    <textarea id="about" name="about" rows="10" cols="20" class="trip"></textarea>
    </div>`);
  createTripForm.append(
    `<input type="submit" name="create-trip" value="Create" class="button" id="create-trip"/>`
  );
}

const createTrip = () => {
  let tripData = {
    'name': $('input[name="name"]').val(),
    'continent': $('#continent option:selected').text(),
    'category': $('input[name="category"]').val(),
    'weeks': $('input[name="weeks"]').val(),
    'cost': $('input[name="cost"]').val(),
    'about': $('#about').val()
  }
  console.log(tripData);

  reportStatus('Creating The Trip...');

  axios.post(URL, tripData)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully created a trip with the name ${response.data.name}`);
      })
    .catch((error) => {
      console.log(error.response);
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
  $('.all-trips').hide();
  $('.trip-container').hide();
  $('.create-trip-form').hide();
  $('.search-trips-form').show();
  const searchTripsForm = $('.search-trips-form');
  searchTripsForm.empty();

  searchTripsForm.append(`<h2>Search Trips</h2>`);
  searchTripsForm.append(`<div>
    <label class="search">Continent:</label>
    <select id="search-continent" class="search">
      <option value=""></option>
      <option value="Africa">Africa</option>
      <option value="Asia">Asia</option>
      <option value="Australasia">Australasia</option>
      <option value="Europe">Europe</option>
      <option value="North America">North America</option>
      <option value="South America">South America</option>
    </select>
    </div>`);
  searchTripsForm.append(
    `<input type="submit" name="search" value="Search by Continent" class="button" id="search-by-continent"/>`
  );
  searchTripsForm.append(`<div>
    <label class="search">Max Amount of Weeks:</label>
    <input id="max-weeks" type="number" name="max-weeks" class="search" />
    </div>`);
  searchTripsForm.append(
    `<input type="submit" name="search" value="Search by Weeks" class="button" id="search-by-weeks"/>`
  );
  searchTripsForm.append(`<div>
    <label class="search">Max Budget: $</label>
    <input id="budget" type="number" name="budget" class="search" />
    </div>`);
  searchTripsForm.append(
    `<input type="submit" name="search" value="Search by Budget" class="button" id="search-by-budget"/>`
  );
}

const searchByContinent = () => {
  if ($('#search-continent').val()) {
    $('.search-trips-form').hide();
    $('.search-results').show();
    const searchResults = $('.search-results');
    searchResults.empty();
    searchResults.append(`<h2>Trips in ${$('#search-continent').val()}</h2>`);
    searchResults.append('<ul id="trip-by-continent"></ul>');
    const tripByContinent = $('#trip-by-continent');

    reportStatus('Searching Trips by Continent...');

    queryString += 'continent?query=' + $('#search-continent').val();
    axios.get(URL + queryString)
      .then((response) => {
        response.data.forEach((trip) => {
          tripByContinent.append(`<li id="${trip.id}">${trip.name}</li>`);
        });
        reportStatus('Trips Loaded!');
      })
      .catch((error) => {
        reportStatus(`Error: ${error.message}`);
      })
  } else {
    reportStatus('Invalid Query');
  }
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#create').click(showCreateTripForm);
  $('#search').click(showSearchTripsForm);

  $('.all-trips').on('click', 'li', function() {
    let id = $(this).attr('id');
    loadTrip(id);
  });
  $('#reservation-form').on('click', '.reserve', function(){
    let id = $(this).attr('id').substr(3);
    reserveTrip(id);
  });
  $('.create-trip-form').on('click', '#create-trip', function(){
    createTrip();
  });
  $('.search-trips-form').on('click', '#search-by-continent', function(){
    searchByContinent();
  });
  $('.search-results').on('click', 'li', function() {
    let id = $(this).attr('id');
    loadTrip(id);
  });
})
