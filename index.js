const allTrips = 'https://ada-backtrek-api.herokuapp.com/trips/'

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
      let html = `<li id="${result.id}">`;
      html += `<strong>Distination: ${result.name}</strong></li>`;
      html += `<br></br>`;
      tripList.append(html)
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  })

  $('#trip-list').on ('click', 'li', function() {
    reportStatus('Loading trip..');
    const tripDetail = $('#trip-detail');
    tripDetail.empty();

    let tripId = this.id
    axios.get(allTrips + tripId)
    .then((response) => {
      reportStatus(`Successfully loaded trip`);
      tripDetail.append('<h3>Trip Detail:</h3>')
      let detail = response.data;
      let html = `<li><ID: ${detail.id}</li>`;
      html += `<li>Trip: ${detail.name}</li>`;
      html += `<li>Continent: ${detail.continent}</li>`;
      html += `<li>About: ${detail.about}</li>`;
      html += `<li>Weeks: ${detail.weeks}</li>`;
      html += `<li>Price: ${detail.cost}</li>`;
      tripDetail.append(html)
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
      console.log(error);
    })
  });
};

$(document).ready(() => {
  $('#load').click(loadTrips);
});
