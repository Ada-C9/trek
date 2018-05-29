const reportStatus = (message, type) => {
  if (type) {
    $('#status-message').html(message).attr('class', type);
  } else {
    $('#status-message').html(message).attr('class', '');
  }
};

const reportError = (message, errors) => {
  let content = `<span>${message}</span>`;
  content += '<div>';

  for (const field in errors ){
    for (const problem of errors[field]) {
      content += `<span>${field}: ${problem}&emsp;</span>`;
    }
  }
  content += '</div>';
  reportStatus(content);
};

const baseURL = 'https://ada-backtrek-api.herokuapp.com/trips';

const buildTripTable = function buildTripTable(input) {

  $('#trip-list').append('<tbody>');

  input.data.forEach( (trip) => {
    let content = '<tr>';
    content += `<td id=${trip.id}>${trip.name}</td>`;
    content += `</tr>`;
    $('#trip-list').append(content);
  });

  $('#trip-list').append('</tbody>');
  reportStatus(`${input.data.length} trips loaded`, 'success');
}

const getTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips...')

  axios.get(baseURL)
    .then((response) => {
      $('#trip-list').empty();
      $('#trip-list').append('<h3>All Trips<h3>');
      buildTripTable(response);
    })
    .catch((error) => {
      // this might not be right
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Error: ${error.message}`, 'failure');
      }
    });
};

const buildForm = function buildForm(id, name) {
  let formContent = '';
  formContent += `<h3>Reserve Trip: ${name}</h3>`;
  formContent += `<form action=${baseURL}>`;
  formContent += '<div><label for="name">Name&emsp;</label> <input type="text" name="name" /></div>';
  formContent += '<div><label for="email">Email&emsp;</label> <input type="text" name="email" /></div>';
  formContent += `<input type='hidden' name='id' value=${id}>`;
  formContent += '<button type="submit" class="button">Reseve Trip!</button>';

  $('#trip-form').html(formContent);
};

const getTripInfo = function getTripInfo(event) {
  let tripInfo = $('#trip-info');
  tripInfo.empty();

  let target = event.target;
  let tripLink = baseURL + '/' + target.id.toString();

  axios.get(tripLink)
    .then( (response) => {
        let trip = response.data;
        let content = '<table>';
        content += `<tr> <td>ID</td> <td> ${trip.id} </td></tr>`;
        content += `<tr> <td>NAME</td> <td> ${trip.name} </td></tr>`;
        content += `<tr> <td>COST</td> <td> $${trip.cost} </td></tr>`;
        content += `<tr> <td>WEEKS</td> <td>${trip.weeks}</td> </tr>`
        content += `<tr> <td>CATEGORY</td> <td> ${trip.category} </td></tr>`;
        content += `<tr> <td id='about-trip'>ABOUT</td> <td> ${trip.about} </td></tr>`;
        content += '</table>';
        $('#trip-info').append('<h3>Trip Info</h3>');
        $('#trip-info').append(content);
        buildForm(trip.id, trip.name);
    })
    .catch( (error) => {
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Error: ${error.message}`, 'failure');
      }
    });

};

const reserveTrip = function reserveTrip (event) {

  event.preventDefault();

  const reservationURL = baseURL + '/' + $('input[name="id"]').val() + '/reservations'

  const tripData = {
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val(),
  }

  reportStatus('Attempting to book trip...');

  axios.post(reservationURL, tripData)
    .then((response) => {
      $('input[name="name"]').val(''); // clearing text field
      $('input[name="email"]').val('');

      reportStatus('Successfully booked trip!', 'success');
    })
    .catch((error) => {
      console.log(error);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error:`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Error: ${error.message}`, 'failure');
      }
    });

  $('#trip-info').empty();
  $('#trip-form').empty();
};


// QUERY SEARCHES
const searchBySection = function searchBy (event) {
  let target = event.target;
  let searchCat = target.id;

  switch(searchCat) {
    case 'continent':
      $('#search-filters').html(
        `<div class='dropdown'>
          <button type='button' class='dropbtn button'> ${searchCat} <i class="arrow down"></i> </button>

          <div class='dropdown-content filter-content' id='continent-search'>
            <p>Asia</p>
            <p>North America</p>
            <p>South America</p>
            <p>Australasia</p>
            <p>Europe</p>
            <p>Africa</p>
            <p>Antarctica</p>
          </div>
        </div>`
      );
      break;
    case 'budget':
      $('#search-filters').html(
        `<div class='dropdown'>
          <button type='button' class='dropbtn button'> ${searchCat} <i class="arrow down"></i> </button>

          <div class='dropdown-content filter-content' id='budget-form'>
            <form>
              <label for='budget'>Set your budget (USD)</label>
              <input type='text' name='budget' />
              <input type="submit" value="Submit">
            </form>
          </div>

        </div>`
      );
      break;
    case 'weeks':
      $('#search-filters').html(
        `<div class='dropdown'>
          <button type='button' class='dropbtn button'> ${searchCat} <i class="arrow down"></i> </button>

          <div class='dropdown-content filter-content' id='weeks-form'>
            <form>
              <label for='weeks'>Number of weeks</label>
              <input type='number' name='weeks' min="1"/>
              <input type="submit" value="Submit">
            </form>
          </div>
        </div>`
      );
      break;
  }

}

const getSearch = function getSearch(event) {
  event.preventDefault();
  let selector = event.currentTarget;
  let target = event.target;

  console.log(event);

  if (selector.id === 'continent-search') {

    searchContinent(target);

  } else if (target.defaultValue === 'Submit') {
    let input = '';
    let type = '';
    if (selector.id === 'budget-form') {
      input = $('input[name="budget"]').val();
      type = 'budget';
    } else if (selector.id === 'weeks-form') {
      input = $('input[name="weeks"]').val();
      type = 'weeks';
    }

    searchWeeksOrBudget(input, type);
  }
};

// INDIVIDUAL API QUERY SEARCH TYPES
const searchContinent = function searchContinent(input) {
  let cont = input.innerHTML;

  // I tried separating this into params and couldn't get anywhere
  let contURL = baseURL + '/continent' + `?query=${cont}`;

  axios.get(contURL)
    .then((response) => {
      $('#trip-list').empty();
      $('#trip-list').append(`<h3>${cont} Trips<h3>`);
      if (response.data === undefined || response.data.length < 1) {
        $('#trip-list').append('No trips at this time');
      } else {
        buildTripTable(response);
      }
    })
    .catch((error) =>{
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error:`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Error: ${error.message}`, 'failure');
      }
    });
};

const searchWeeksOrBudget = function searchWeeksOrBudget(input, type) {
  let contURL = baseURL + `/${type}` + `?query=${input.toString()}`;
  let header = '';
  if (type === 'budget') {
    header = `<h3>Trips under $ ${input.toString()}<h3>`;
  } else {
    header = `<h3>Trips under ${input.toString()} Weeks <h3>`;
  }
  axios.get(contURL)
    .then((response) => {
      $('#trip-list').empty();
      $('#trip-list').append(header);
      if (response.data === undefined || response.data.length < 1) {
        $('#trip-list').append('No trips at this time');
      } else {
        buildTripTable(response);
      }
    })
    .catch((error) =>{
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error:`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Error: ${error.message}`, 'failure');
      }
    });
}


$(document).ready( () => {
  $('#load').click(getTrips);
  $('#trip-list').on('click', 'td', getTripInfo);
  $('#trip-form').submit(reserveTrip);
  $('#search-by').on('click', 'p', searchBySection);
  $('#search-filters').on('click', '.filter-content', getSearch);

});
