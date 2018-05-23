const URL = 'https://ada-backtrek-api.herokuapp.com/trips';


const loadTrips = () => {

  const tripList = $('#trip-list');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        let tripID = trip.id;
          tripList.append(`<li id="${tripID}">${trip.name}</li>`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};


const loadDetails = (id) => {
  let idURL = `${URL}/${id}`;

  axios.get(idURL)

    .then((response) => {

      if(response.data) {
        // log info to console
        console.log(response.data);

        let name = response.data.name;
        let continent = response.data.continent;
        let about = response.data.about;
        let weeks = response.data.weeks;
        let cost = response.data.cost;
        let category = response.data.category;

        ($('#name')).html(`Name: ${name}`);
        ($('#continent')).html(`Continent: ${continent}`);
        ($('#about')).html(`About: ${about}`);
        ($('#weeks')).html(`Weeks: ${weeks}`);
        ($('#cost')).html(`Cost: ${cost}`);
        ($('#category')).html(`Category: ${category}`);

      reportStatus(`Loaded more information about ${name}`);
      }
    })
      .catch((error) => {
        reportStatus(`Received an error from Trek API: ${error.message}`);
      });
};





const loadForm = (id) => {
  $("#reserve-form").show();
  document.getElementById("tripToRes").value = id;
}


const reserveTrip = (event) => {
  event.preventDefault();

  const reservationData = {
    tripID: $('input[name="tripID"]').val(),
    name: $('input[name="name"]').val(),
    age: parseInt( $('input[name="age"]').val()),
    email: $('input[name="email"]').val(),
  };

  let tripID = reservationData.tripID;
  let reserveURL = `${URL}/${tripID}/reservations`

  axios.post(reserveURL, reservationData)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully reserved trip for ${reservationData.name}`);
    })
    .catch((error) => {
      if (error.response.data && error.response.data.errors ) {
       console.log(error.response);
       reportError(error.message, error.response.data.errors);
     } else {
       reportStatus(`Encountered an Error: ${error.message}`)
     }
    });
};





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



$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#logo').click(loadTrips);
  $("#reserve-form").hide();

  $('#trip-list').on('click', 'li', function() {
    loadDetails(this.id);
    loadForm(this.id);

    // log info to console
    console.log(this.id);
  });

  $('#reserve-form').submit(reserveTrip);

});
