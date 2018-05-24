
const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const loadForm = (data) => {
  $('#trip-reservation').addClass('bordered');
  $('#trip-reservation').empty();


  $('#trip-reservation').html('<h2>Reserve Trip</h2>');
  $('#trip-reservation > h2').addClass('bordered-bottom');

  $('#trip-reservation').append(
    `<form>
    <input type="hidden" name="id" value="${data.id}">
    <p>Your Name: <input type="text" name="name"></p>
    <p>Your Email: <input type="text" name="email"></p>
    <p>Trip: ${data.name}<br>
    <input class="button" type="submit" value="Reserve"></p>
    </form>`
  );
};

const reportStatus = (message, applyClass = 'success') => {
  $('#status-message').html(message);
  $('#status-message').addClass(applyClass);
};

const reportError = (message, errors) => {
  let mess = `<p>${message}</p><ul>`
  for (const field in errors) {
    for (const problem of errors[field]) {
      mess +=  `<li>${field}: ${problem}<li>`;
    }
  }
  mess += '</ul>'
  reportStatus(mess, err)
};


const showTrips = () => {
  // style all trips section
  $('#all-trips').addClass('bordered');

  // style and fill #all-trips header
  $('#all-trips > h2').html('All Trips');
  $('#all-trips > h2').addClass('bordered-bottom')

  // style and fill #all-trips ul (#trip-list)
  $('#trip-list').empty();
  axios.get(URL)

  .then((response) => {
    let collection = response.data
    for (const trip of collection) {
      $('#trip-list').append(
        `<li class='bordered-bottom'>
          <a href="https://ada-backtrek-api.herokuapp.com/trips/${trip.id}">${trip.name}</a>
        </li>`
      );
    }
  })

  .catch((error) => {
    reportStatus(`Sorry could not load trips: ${error.message}`);
    console.log(error);
  });

};

const showDetails = (event) => {
  event.preventDefault();
  const detailsLink = event.currentTarget.getAttribute('href');

  $('#trip-details').addClass('bordered');
  $('#trip-details').empty();


  $('#trip-details').html('<h2>Trip Details</h2>');
  $('#trip-details > h2').addClass('bordered-bottom');

  axios.get(detailsLink)

    .then((response) => {

      // Add details to DOM using response data
      let trip = response.data;
      $('#trip-details').append(
        `<ul>
          <li><strong>Name: ${trip.name}</strong></li>
          <li><strong>Continent: </strong>${trip.continent}</li>
          <li><strong>Category: </strong>${trip.category}</li>
          <li><strong>Weeks: </strong>${trip.weeks}</li>
          <li><strong>Cost: </strong>$${trip.cost}</li>
          <li>
          <strong>About: </strong>
            <p>${trip.about}</p>
          </li>
        </ul>`
      );

      // load form using response data
      loadForm(trip);

    })
    .catch((error) => {
      console.log(error.response);
      console.log(error.message);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Sorry could not load trip: `, error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });

};

const reserveTrip = (event) => {
  event.preventDefault();
  const tripData = $('form').serialize();
  const id = parseInt(tripData.replace('id=',''));

  axios.post(`https://ada-backtrek-api.herokuapp.com/trips/${id}/reservations?${tripData}`)

  .then((response) => {
    reportStatus(`Successfully booked your trip with trip ID ${response.data.id}!  Have fun!`)
  })

  .catch((error) => {
    console.log(error.response);
    if (error.response.data && error.response.data.errors) {
      reportError(
        `Sorry could not load trip: ${error.message}`, error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}`);
    }
  });

  // reset the form
  $('form')[0].reset();

};



$(document).ready(()=>{
  $('#all').click(showTrips);
  $('#trip-list').on('click', 'a', showDetails);
  $('#trip-reservation').on('submit', 'form', reserveTrip);
});
