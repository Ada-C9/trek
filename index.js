const reportStatus = (message) => {
  $('#status-message').html(message);
};

// const reportError = (message, errors) => {
//   let content = `<p>${message}</p><ul>`;
//   for (const field in errors) {
//     for (const problem of errors[field]) {
//       content += `<li>${field}: ${problem}</li>`;
//     }
//   }
//   content += "</ul>";
//   reportStatus(content);
// };

const allTrips = 'https://ada-backtrek-api.herokuapp.com/trips/'

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
        let html = `<li>`;
        html += `<strong>ID: ${result.id}</strong></li>`;
        html += `<li><a class="link" href="${result.id}">${result.name}</a></li>`;

        html += `<br></br>`;
        tripList.append(html)
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    })
};

const loadTrip = () => {
  reportStatus('Loading trip..');
  const tripDetail = $('#trip-detail');
  tripDetail.empty();

  let tripId = $('.link')[0].getAttribute('href')
  let tripUrl = (allTrips + `${tripId}`)

  axios.get(tripUrl)
    .then((response) => {
      reportStatus(`Successfully loaded trip`);
      tripDetail.append('<h3>Trip Detail:</h3>')

        let html = `<li><strong>ID:
        ${response.id}</strong></li>`;
        html += `<li>Trip: ${response.name}</li>`;
        html += `<li>Continent: ${response.continent}`;
        html += `<li>About: ${response.about}`;
        html += `<li>Weeks: ${response.weeks}`;
        html += `<li>Price: ${response.cost}`;
        html += `<br></br>`;
        tripDetail.append(html)
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
      console.log(error);
    })
};


$(document).ready(() => {
  $('#load').click(loadTrips);
  $('a').on('click', loadTrip);
});
