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

const tableHeaders = (trip) => {
  let headers = '';
  headers += '<thead> <tr>';
  console.log(Object.keys(trip));
  Object.keys(trip).forEach( (header) => {
    headers += `<th>${header.toUpperCase()}</th>`;
  });
  headers += '</tr> </th>';

  return headers;
};

const baseURL = 'https://ada-backtrek-api.herokuapp.com/trips';

const getTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips...')

  axios.get(baseURL)
    .then((response) => {
      $('#trip-list').append(tableHeaders(response.data[0]));
      $('#trip-list').append('<tbody>');

      response.data.forEach( (trip) => {
        let content = '<tr>';
        content += `<td>${trip.id}`;
        content += `<td>${trip.name}</td>`;
        content += `<td>${trip.continent}</td>`;
        content += `<td>${trip.category}</td>`;
        content += `<td>${trip.weeks}</td>`;
        content += `<td>${trip.cost}</td>`;
        content += `</tr>`;
        $('#trip-list').append(content);

      });

      $('#trip-list').append('</tbody>');
      reportStatus(`${response.data.length} trips loaded`);
    })
    .catch((error) => {
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Error: ${error.message }`);
      }
    });

};



$(document).ready( () => {
  $('#load').click(getTrips);

});
