const BASEURL = "https://ada-backtrek-api.herokuapp.com/trips";

const status = (message) => {
  $('#status-message').html(message);
};

const errors = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for(const field in errors){
    for(const problem of errors[field]) {
      content += `<li> ${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  status(content);
};

const loadAllTrips = () => {
  status('Loading trips...');
  // const trips = $("#trip-table");
  axios.get(BASEURL)
  .then((response) => {
    status('Successfully loaded trips');
    // console.log(response);
    let data = response.data;
    $('#trip-table thead').append('<h3>All Trips</h3>')
    data.forEach((trip) => {
      let row = `<tr class="deeds">`;
      row += `<td><a id="${trip.id}" href ='#'>` + trip.name + '</a></td>';
      row += '</tr>'

      $('#trip-table tbody').append(row);
    });
    // trips.empty();
  })
  .catch((error) => {
    status(`Something went wrong while loading trips: ${error.message}`);
  });
};



const loadTrip = function(event) {
  status('Loading trip...');

  event.preventDefault();
  const target = $(this).children();

  axios.get(BASEURL + `/${target[0].id}`)
    .then((response) => {
      status('Successfully loaded trip');
      let data = response.data;
      console.log('this is the response of clicking on an individual trip');
      console.log(data);
      $('#details').append('<h2>Trip Details<h2>');

    })
    .catch((error) => {
      status(`Something went wrong while loading a trip: ${error.message}`);
    });

  // const details = $("#details");
  // details.empty();

};


$(document).ready(() => {
  console.log('YOUR IN!');
  $('#all-trips').click(loadAllTrips);
  $('#trips-body').on('click','td',(loadTrip));
});
