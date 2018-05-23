//click on reservation
//form appears - input name (on click event - prepopulated)

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
        tripDetails.append(`<li><button id="reserve-trip">Reserve this trip</button></li>`)
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




$(document).ready(() => {
   $(`#load`).click(loadTrips);
   $(document).on("click","#all-trips",function(event){
     loadTripdetails(event);
   });
   $(document).on("click","#reserve-trip",function(){
     $("#trip-form").toggle("slow");
   })


});
