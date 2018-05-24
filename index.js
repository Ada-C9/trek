//click on reservation
//form appears - input name (on click event - prepopulated)

//Use a closures design where the outside function is the
//click function of a single element in the trips list.
//the inside element is going to be the inner function.

const URL = `https://ada-backtrek-api.herokuapp.com/trips`

const reportStatus = (message) =>{
  $(`#status-message`).html(message);
}

let singleTripURL = function(tripID){
  let singleURL = ``
  return singleURL+=`https://ada-backtrek-api.herokuapp.com/trips/${tripID}`
}

const loadTripdetails = (aTrip)=>{
  const tripDetails = $(`#trip-details`);
  const divTrips = $('#div-for-trips');
  divTrips.empty();
  tripDetails.empty();

  reportStatus('Searching for trip details...')

  axios.get(singleTripURL(aTrip.target.id))
    .then((response) => {
        tripDetails.append(`<li>${response.data.name}</li>`)
        tripDetails.append(`<li>${response.data.continent}</li>`)
        tripDetails.append(`<li>${response.data.category}</li>`)
        tripDetails.append(`<li>${response.data.weeks}</li>`)
        tripDetails.append(`<li>${response.data.cost}</li>`)
        tripDetails.append(`<li>${response.data.about}</li>`)
        tripDetails.append(`<button id="make-res">Book this trip!</button>`)
        divTrips.append('<label for="trip">Trip</label>')
        divTrips.append(`<input type="trip" name="trip" id="trip-input" value=${response.data.name}/>`)
      reportStatus('Trip details found!')
    })
  .catch((error) =>{
      console.log(error)
      reportStatus(`Error: ${error.message}`)
    })
}

const loadTrips = ()=>{
  //create reference to all-trips element
  const tripList = $(`#all-trips`);
  //empty list before call to API
  tripList.empty();
  //display pending status to user
  reportStatus('Loading trips....')
axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`)
    });
    reportStatus('Trips loaded!');
  })
  .catch((error) =>{
    console.log(error)
    reportStatus(`Error: ${error.message} `)
  })
}

// / Original Code //

$(document).ready(() => {
  //all trips
   $(`#load`).click(loadTrips);
   //single trip
   $(document).on("click","#all-trips",function(event){
     loadTripdetails(event);
   });

   $(document).on("click","#make-res",function(){
      $("#form").toggle();
   });


//post a reservation


});


// Come back to closures

// $(document).ready(() => {
//   //all trips
//    $(`#load`).click(loadTrips);
//    //single trip
//
//    const clickOntrip = function(){
//      $(document).on("click","all-trips",function(event){
//        loadTripdetails(event);
//      }
//
//       )
//    }
//    $(document).on("click","#all-trips", function(event) {
//      // loadTripdetails(event);
//      //  console.log($(`#name`).val());
//      // here you're attempting to call an item before it has been created by javascript.
//      $(document).on("click","#make-reservation", function() {
//        // $("#trip-input").val(event.result)
//        // console.log(singleTripevent)
//        $("#trip-form").toggle("slow");
//        // $("#trip-input").val(`${event.result.name}`)
//      })
//    });


//
// });
