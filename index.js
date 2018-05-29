const URL = `https://ada-backtrek-api.herokuapp.com/trips`
const postURL = `https://ada-backtrek-api.herokuapp.com/trips`


let singleTripURL = function(tripID){
  let singleURL = ``
  return singleURL+=`https://ada-backtrek-api.herokuapp.com/trips/${tripID}`
}

let reserveAtrip = function(tripID){
  let singleURL =``
  return singleURL+= `https://ada-backtrek-api.herokuapp.com/trips/${tripID}/reservations`
}


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
    tripDetails.append(`<li>Trip Location: ${response.data.name}</li>`)
    tripDetails.append(`<li>Continent: ${response.data.continent}</li>`)
    tripDetails.append(`<li>Category: ${response.data.category}</li>`)
    tripDetails.append(`<li>Weeks: ${response.data.weeks}</li>`)
    tripDetails.append(`<li>Cost: $${response.data.cost}</li>`)
    tripDetails.append(`<li>Details: ${response.data.about}</li>`)
    tripDetails.append(`<button class="button" id="make-res">Book this trip!</button>`)
    divTrips.append(`<input type="hidden" name="location-id" value="${response.data.id}"/>`)
    divTrips.append('<label for="trip" >Trip</label>')
    divTrips.append(`<input type="trip" name="trip" id="trip-input" value="${response.data.name}"/>`)
    reportStatus('Trip details found!')
  })
  .catch((error) =>{
    console.log(error)
    reportStatus(`Error: ${error.message}`)
  })
}

const loadTrips = ()=>{
  //create reference to all-trips element
  let tripList = $(`#all-trips`);
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
    reportStatus('fail')
    if( error.message && error.response.data.errors){
      reportError(error.message,error.response.data.errors)
    }else
    reportError(`encounted error: ${error.message}`)
  })
};


const bookTrip = (event) =>{
  event.preventDefault();

  const tripInfo ={
    name: $(`input[name="name"]`).val(),
    email:$(`input[name="email"]`).val(),
    tripID:$(`input[name="location-id"]`).val()
  }

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
      let v = error.response.data.errors
      console.log(v)
      reportError(error.message,error.response.data.errors)
    }else
    reportError(`encounted error: ${error.message}`)
  })
};


$(document).ready(() => {
  $(`#load`).click(loadTrips);
  $(document).on("click","#all-trips",function(event){
    loadTripdetails(event);
  });

  $(document).on("click","#make-res",function(){
    $("#book-trip-form").toggle("slow");
  });

  $(`#book-trip-form`).submit(bookTrip);

  $(document).on("click","#submit-button",function(event){
    $(`#submit-button`).toggle();
    $(`#book-trip-form`).append(`<button id="button-success" class="button success">Trip Booked!</button>`);
  });

  $(document).on("click","#create-trip-button",function(){
    $(`#create-trip`).toggle("slow");
  })

  $(`#create-trip`).submit(createTrip);
  $(document).on("click","#submit-trip",function(){
    $('#create-trip').toggle("slow")
  })

  $(document).on("click","#all-trips",function(){
    $(`#button-success`).remove();
    $(`#submit-button`).show();
  })
});
