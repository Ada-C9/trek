const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

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
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips, please wait...');

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        let item = $(`<li>${trip.name}</li>`).attr('id', `${trip.id}`);
        tripList.append(item);
      });
      reportStatus(`Successfully loaded ${response.data.length} trips`)
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
};

const getTripDetails = function getTripDetails(id) {

  let tripDetail = $('#trip-detail-section');
  tripDetail.empty();

  axios.get(URL + id)
    .then((response) => {
      let data = response.data;
      let name = $(`<h4><strong>Name:</strong> ${data.name}</h4>`).addClass(`${id}`);
      let about = $(`<p><strong>Description:</strong> ${data.about}</p>`)
      let continent = $(`<p><strong>Continent:</strong> ${data.continent}</p>`)
      let category = $(`<p><strong>Category:</strong> ${data.category}</p>`)
      let weeks = $(`<p><strong>Weeks:</strong> ${data.weeks}</p>`)
      let cost = $(`<p><strong>Cost:</strong> $${data.cost}</p>`)

      tripDetail.append(name, about, continent, category, weeks, cost);

      reportStatus(`Successfully loaded details for ${response.data.name} trip`)
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
}

const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#trip-form input[name="${name}"]`);

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };

  const formData = {};
  FORM_FIELDS.forEach((field) => {
    formData[field] = getInput(field);
  });

  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}

const reserveTrip = (event) => {
  event.preventDefault();

  // let id = Number($('#trip-detail-section h4')[0].classList[0]);
  let id = $('.trip-detail-section h4').attr("class");

  const tripData = readFormData();

  reportStatus('Sending trip reservation data...');

  axios.post((`${URL}${id}/reservations`), tripData)
    .then((response) => {
      clearForm();
      reportStatus(`Successfully created trip reservation with ID ${response.data.trip_id}!`);
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
}

$(document).ready(() => {
  $('#load').click(loadTrips);

  $('#trip-list').on('click', 'li', function(event) {
    let id = Number(event.target.id);
    $("section").removeClass("hidden");
    getTripDetails(id);
  });

  $('#trip-form').submit(reserveTrip);
});
