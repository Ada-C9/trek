const reportStatus = (message) => {
  $('#status-message').html(message);
};

const tableHeaders = (trip) => {
  let headers = '';
  headers += '<thead> <tr>';
  Object.keys(trip).forEach( (header) => {
    headers += `<th>${header}</th>`;
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
    .then( (response) => {
      response.data.forEach( (trip) => {
        let content = '';
        content += `<li>${trip.id}: ${trip.name}</li>`
        content += `<li>${trip.continent}`


        $('#trip-list').append()
      });
    });

};



$(document).ready( () => {
  $('#load').click()

});
