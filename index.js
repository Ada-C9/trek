const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`;
  content += '<ul>';

  for (const field in errors ){
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += '</ul>';
  reportStatus(content);
};

const baseURL = 'https://ada-backtrek-api.herokuapp.com/trips';

const getTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips...')

  axios.get(baseURL)
    .then((response) => {
      $('#trip-list').append('<thead> <tr> <th> All Trips </th> </tr> </thead>');
      $('#trip-list').append('<tbody>')

      response.data.forEach( (trip) => {
        let content = '<tr>';
        content += `<td id=${trip.id}>${trip.name}</td>`;
        content += `</tr>`;
        $('#trip-list').append(content);
      });

      $('#trip-list').append('</tbody>');
      reportStatus(`${response.data.length} trips loaded`);
    })
    .catch((error) => {
      // this might not be right
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Error: ${error.message}`);
      }
    });
};

const buildForm = function buildForm(id) {
  let formContent = '';
  formContent += '<h3>Reserve Trip</h3>';
  formContent += `<form action=${baseURL}>`;
  formContent += '<div><label for="name">Name</label><input type="text" name="name" /></div>';
  formContent += '<div><label for="email">Email</label><input type="text" name="email" /></div>';
  formContent += `<input type='hidden' name='id' value=${id}>`;
  formContent += '<input type="submit" value="Submit">';

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
        let content = '<table>'
        content += `<tr> <td>ID</td> <td> ${trip.id} </td></tr>`;
        content += `<tr> <td>NAME</td> <td> ${trip.name} </td></tr>`;
        content += `<tr> <td>CONTINENT</td> <td> ${trip.continent} </td></tr>`;
        content += `<tr> <td>CATEGORY</td> <td> ${trip.category} </td></tr>`;
        content += `<tr> <td>ABOUT</td> <td> ${trip.about} </td></tr>`;
        content += '</table>'
        $('#trip-info').append('<h3>Trip Info</h3>');
        $('#trip-info').append(content);
        buildForm(trip.id);
    })
    .catch( (error) => {

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

      reportStatus('Successfully booked trip!');
    })
    .catch((error) => {

    });
};



$(document).ready( () => {
  $('#load').click(getTrips);
  $('#trip-list').on('click', 'td', getTripInfo);
  $('#trip-form').submit(reserveTrip);
});
