const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        let tripID = trip.id;
        tripList.append(`<li id="${tripID}">${trip.name} ${trip.id}</li>`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const loadDetails = (id) => {

  let idURL = `${URL}/${id}`;

  axios.get(idURL)
    .then((response) => {

      console.log(response);

      let name = response.data.name;
      let continent = response.data.continent;
      let about = response.data.about;
      let weeks = response.data.weeks;
      let cost = response.data.cost;
      let category = response.data.category;

      ($('#name')).html(`Name: ${name}`);
      ($('#continent')).html(`Continent: ${continent}`);
      ($('#about')).html(`About: ${about}`);
      ($('#weeks')).html(`Weeks: ${weeks}`);
      ($('#cost')).html(`Cost: ${cost}`);
      ($('#category')).html(`Category: ${category}`);

      })
    .catch((error) => {
      console.log(error);
    });
};


$(document).ready(() => {
  $('#load').click(loadTrips);

  $('#trip-list').on('click', 'li', function() {
    loadDetails(this.id);
    console.log(this.id);
  });

});
