const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

const reportStatus = (message) => {
  $('#status-message').html(message);
}

const loadTrips = () => {

  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading Trips! Please Wait...');

  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
    });
    reportStatus('Trips Loaded!');
  })
  .catch((error) => {
    reportStatus(`Error: ${error.message}`);
  })
}
const loadTrip = (id) => {

  const tripInfo = $('#trip');
  tripInfo.empty();
  const reservationInfo = $('#reservation');
  reservationInfo.empty();

  reportStatus('Loading Trip Details! Please Wait...')

  axios.get(URL + `${id}`)
  .then((response) => {

    let data = response.data;
    console.log(data.name);


    tripInfo.append(`<li><strong>Name: </strong>${data.name}</li>`);
    tripInfo.append(`<li>Continent: ${data.continent}</li>`);
    tripInfo.append(`<li>Category:${data.category}</li>`);
    tripInfo.append(`<li>Weeks: ${data.weeks}</li>`);
    tripInfo.append(`<li>Cost: ${data.cost}</li>`);
    tripInfo.append(`<li>About:${data.about}</li>`);
    console.log(tripInfo);

    reservationInfo.append(
      `<label class="user"> Name:</label>
      <input type="text" name="name" class="form"/><br>`

    );
    reservationInfo.append(
      `<label class="user">Email:</label>
      <input type="text" name="email" class="form"/><br>`
    );
    reservationInfo.append(`<label>Trip: ${data.name}</label><br>`);
    reservationInfo.append(
      `<input type="submit" name="reserve-trip" class="reserve" id="reserve${data.id}"/>`
    );
    reportStatus('Trip Details Loaded!');
  })
  .catch((error) => {
    reportStatus(`Error: ${error.message}`);
  })
}
const reservationData = (id) => {
  let tripData = {name: $(`input[name="name"]`).val(),
  email:$(`input[name="email"]`).val()
}
console.log(reservationData);

reportStatus('Reserving a trip...');

axios.post(URL + `${id}/reservations`, tripData)
.then((response) => {
  console.log('The post req was succesful')
  reportStatus(`Successfully reserved this trip ${response.data.name}!`);

})
.catch((error) => {
  console.log(error.response);

  reportStatus(`Encountered an error: ${error.message}`);
});

};
$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-list').on('click', 'li', function() {
    let id = $(this).attr('id');
    loadTrip(id);
  });
  $('#reservation').on('click', '.reserve', function(){
    let id = $(this).attr('id').substr(7);
    console.log(id);
    reservationData(id);
  });
})
