
const reportStatus = (message) =>{
  $(`#status-message`).html(message);
}

const URL = `https://ada-backtrek-api.herokuapp.com/trips`

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
      tripList.append(`<li id="trip-item">${trip.name}</li>`)

    });
    reportStatus('Trips loaded!');
  })
  .catch((error) =>{
    console.log(error)
    reportStatus(`Error: ${error.message} `)
  })

}

//method for details
//if a on click event occurs on a trip item
//populate trip details list

$(document).ready(() => {
   $(`#load`).click(loadTrips);
   $(document).on("click","#trip-item",function(){

   });
   // $("trip-item").click(function(){
   //   console.log('hello');
   // });

});
