$(document).ready(()=>{

// get the trips list from api, turn it into a list
let viewTripsList = function viewTripsList() {
    $.get('https://ada-backtrek-api.herokuapp.com/trips',
    (response) => {
      response.forEach(function(trip) {
        let tripInfo =
        `<li data-id=${trip.id}><a>${trip.name}</a></li>`
        $('#trips ul').append(tripInfo);
        console.log('Trips list: success');
      });
    })
// If unable to load trips, give html response.
    .fail(function(response){
      $('fail').html('<p>Trips List: unsuccessful</p>')
      console.log(response);
    });
  };



// Get trip information from API, and show info
  let viewTrip = function viewTrip(id){
      $.get(`https://ada-backtrek-api.herokuapp.com/trips/${id}`,
        (response) => {
          let tripName =
          `Trip ${response.id}: ${response.name}`;
          let tripSummary = `<li>Continent: ${response.continent}</li>
          <li>Category: ${response.category}</li>
          <li>Weeks: ${response.weeks}</li>
          <li>Trip Cost: $${response.cost}</li>
          <li>About: ${response.about}</li>`;

          $('#trip-name').html(tripName);
          $('#trip-summary').html(tripSummary);
          console.log('single trip: success');

        })

        .fail(function(response){
          $('fail').html('<p>Single trip: error</p>')

          /// console.log(); ///
          console.log(response);
          console.log('single trip: error');
        });
      };


// When all trips button is clicked, get the list of trips
  $('#all-trips').on('click', function(){
      viewTripsList();
    });

// click event for single trip
  $('#trips ul').on('click', 'li', function(){
        let tripID = $(this).attr('data-id');
        viewTrip(tripID);
      });








    });
