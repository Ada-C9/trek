const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
const dataField = ['Name', 'Continent', 'Category', 'Weeks', 'Cost', 'About'];

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


// Load ALL Trips
const loadTrips = () => {
  reportStatus('Loading trips...');

  const trekList = $('#trek-list');
  trekList.empty();

  axios.get(URL)

  .then((response) => {
    console.log(response)

    reportStatus(`Successfully loaded ${response.data.length} trips!`);
    trekList.html('<h4>All Trips</h4>')
    response.data.forEach((trip) => {
      let listTrip = $(`<li><a href=#>${trip.name}</a></li>`);

      trekList.append(listTrip);

      listTrip.click(() => {
        displayTrip(trip);
      });
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};


// Show one trip's detail
const displayTrip = (trip) => {

  const trekDetail = $('#trek-detail');

  axios.get(URL + '/' + trip.id)

  .then((response) => {
    console.log(response.data);

    if (response.data) {
      listForm(response.data.id);

      trekDetail.html('<h4>Trip Details</h4>')

      for (let data of dataField) {
        let html = `<li><strong>${data}:</strong> ${response.data[data.toLowerCase()]}</li>`;
        trekDetail.append(html);
      }
    }

  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trip's details: ${error.message}`);
    console.log(error);
  })

  $('#reserv-form').submit((event) => {
    event.preventDefault();
    reserveTrip(trip.id)
  });

};

const listForm = (id) => {
  let formTag = "<h4>Reserve Trip</h4>";
  formTag += `<form>`,
  formTag += `<div><label for="name">Name</label>
    <input type="text" name="name" /></div>`,
  formTag += `<div><label for="email">Email</label>
    <input type="text" name="email" /></div>`,
  formTag += `<div>
    <h5>Trip ID: ${id}</h5></div>`
  formTag += `<input type="submit" name="add-reserv" value="Reserve" />
    </form>`

  $('#reserv-form').html(formTag);
}

const FORM_FIELDS = ['name', 'email'];
const inputField = (name) => $(`#reserv-form input[name="${name}"]`);

const readFormData = () => {
  console.log(name)

  const getInput = (name) => {
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

// A reservation form for trip
const reserveTrip = (id) => {

  // event.preventDefault();

  const tripData = readFormData();
  console.log(tripData);

  let reservURL = URL + `/${id}/reservations`

  axios.post(reservURL, tripData)

  .then((response) => {
    console.log(response);
    reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
    clearForm();
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

};

$(document).ready(() => {
  $('#load').click(loadTrips);
});
