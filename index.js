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
      $('#fail').html('<p>Trips List: unsuccessful</p>')
      console.log(response);
    });
  };



// When all trips button is clicked, get the list of trips
  $('#all-trips').on('click', function(){
      viewTripsList();
    });







    });
