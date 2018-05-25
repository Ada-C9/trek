//click on reservation
//form appears - input name (on click event - prepopulated)

//Use a closures design where the outside function is the
//click function of a single element in the trips list.
//the inside element is going to be the inner function.

const URL = `https://ada-backtrek-api.herokuapp.com/trips`

let singleTripURL = function(tripID){
  let singleURL = ``
  return singleURL+=`https://ada-backtrek-api.herokuapp.com/trips/${tripID}`
}

let reserveAtrip = function(tripID){
  let singleURL =``
  return singleURL+= `https://ada-backtrek-api.herokuapp.com/trips/${tripID}/reservations`
}

const postURL = `https://ada-backtrek-api.herokuapp.com/trips`

const reportStatus = (message) =>{
  $(`#status-message`).html(message);
}

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += "<ul>";
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};



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
        divTrips.append(`<input type="hidden" name="location-id" value="${response.data.id}"/>`)
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

const createTrip = (event) =>{
  event.preventDefault();

  const newTripinfo = {
      name: $(`input[name="name-create"]`).val(),
      continent: $(`input[name="continent"]`).val(),
      about: $(`input[name="about"]`).val(),
      category: $(`input[name="category"]`).val(),
      weeks: $(`input[name="weeks"]`).val(),
      cost: $(`input[name="cost"]`).val()

  }
console.log(newTripinfo)
  reportStatus(`Attempting to create your new trip!`)
  $(`input[name="name-create"]`).val('')
  $(`input[name="continent"]`).val('')
  $(`input[name="about"]`).val('')
  $(`input[name="category"]`).val('')
  $(`input[name="weeks"]`).val('')
  $(`input[name="cost"]`).val('')

  axios.post(URL,newTripinfo)
  .then((response) => {
    reportStatus('Your trip has been created')
  })
  .catch((error) =>{
    console.log(error)
    reportStatus(`Error: ${error.message}`)
  })
//end of method
};


const bookTrip = (event) =>{
  event.preventDefault();

  const tripInfo ={
    name: $(`input[name="name"]`).val(),
    email:$(`input[name="email"]`).val(),
    tripID:$(`input[name="location-id"]`).val()
  }

  // console.log(tripInfo)

  reportStatus(`Attempting to make your reservation`)
  $(`input[name="name"]`).val('')
  $(`input[name="email"]`).val('')
  $(`input[name="location-id"]`).val('')

axios.post(reserveAtrip(tripInfo.tripID),tripInfo)
  .then((response) => {
    reportStatus('You trip has been booked')
  })
  .catch((error) => {
    reportStatus('fail')
    if( error.message && error.response.data.errors){
    reportError(error.message,error.response.data.errors)
  }else
    reportError(`encounted error: ${error.message}`)
 })
//end of method
};




/// DOCUMENT . READY ///
// / Original Code //

$(document).ready(() => {
  //all trips
   $(`#load`).click(loadTrips);
   //single trip
   $(document).on("click","#all-trips",function(event){
     loadTripdetails(event);
   });

   $(document).on("click","#make-res",function(){
      $("#book-trip-form").toggle();
   });

   $(`#book-trip-form`).submit(bookTrip);

   $(document).on("click","#submit-button",function(){
     $('#book-trip-form').toggle()
   })

   $(`#create-trip`).submit(createTrip);
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
