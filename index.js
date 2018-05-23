




const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const showTrips = () => {

  $('#all-trips').addClass('bordered');

  $('#all-trips > h2').html('All Trips');
  $('#all-trips > h2').addClass('bordered-bottom')
  axios.get(URL)
  .then((response) => {
    let collection = response.data
    for (const trip of collection) {
      $('#trip-list').append(
        `<li class='bordered-bottom'>
          <a href="https://ada-backtrek-api.herokuapp.com/trips/${trip.id}">${trip.name}</a>
        </li>`
      );
    }
  })
  .catch((error) => {

  });

};



const showDetails = (event) => {
  event.preventDefault();
  const detailsLink = event.currentTarget.getAttribute('href');

  axios.get(detailsLink)
    .then((response) => {
      $('#trip-details').addClass('bordered');
      $('#trip-details').empty();


      $('#trip-details > h2').html('Trip Details');
      $('#trip-details > h2').addClass('bordered-bottom')
      $('#trip-details').append(
        `<ul>
          <li><strong>Name: ${response.data.name}</strong></li>
          <li><strong>Continent: </strong>${response.data.continent}</li>
          <li><strong>Category: </strong>${response.data.category}</li>
          <li><strong>Weeks: </strong>${response.data.weeks}</li>
          <li><strong>Cost: </strong>$${response.data.cost}</li>
          <li>
          <strong>About: </strong>
            <p>${response.data.about}</p>
          </li>
        </ul>`
      );
    })
    .catch((error) => {

    });




};





$(document).ready(()=>{
  console.log("This is Working!");
  $('#all').click(showTrips);
  $('#trip-list').on('click', 'a', showDetails)
});
