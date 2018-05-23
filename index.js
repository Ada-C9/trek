let URL = 'https://ada-backtrek-api.herokuapp.com/trips';

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
  reportStatus('Loading Trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)

  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      let link = `${URL}/${trip.id}`;
      tripList.append(`<li><a href=${link}>${trip.name}</li>`);
      // tripList.click(() => {
      //   loadDetails(trip);
      // })
    });
    // .click function and pass
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

const loadDetails = (link) => {
  reportStatus('Loading Details...');
  console.log(link);

  // const details = $('#trip-list li');
  // details.empty();

  axios.get(link)

  .then((response) => {
    reportStatus(`Successfully loaded ${this.name} details!`);
    console.log('pressed');

    $('#trip-detail').empty();
    let tripDetails = "";
    for (let detail in response.data) {
      console.log(detail);

      tripDetails += `<li>${detail}</li>`;
    }
    $('#trip-details').append(tripDetails);
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

$(document).ready(() => {
  $('#search-all').click(loadTrips);
  $( '#trip-list' ).on("click", "a",  function(event) {
    console.log($(event));
    event.preventDefault();
    loadDetails(this.href);
  });

  // $('#trip-list').on('click', 'li', loadDetails);
  // $('#pet-form').submit(createPet);
// });
});
