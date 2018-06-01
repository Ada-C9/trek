const URL = 'https://ada-backtrek-api.herokuapp.com/trips/';

// Report helpers
const reportStatus = (message) => {
  $('#status-message').html(message);
}

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

//LOAD all/specific trips based on url params
const getTrips = (url) => {
  const tripList = $('#trip-list');
  tripList.show();
  tripList.empty();

  reportStatus('Loading trips, please wait...');

  axios.get(url)
    .then((response) => {
      let header = $(`<h4>All Trips</h4>`)
      tripList.append(header);

      response.data.forEach((trip) => {
        let item = $(`<li>${trip.name}</li>`).attr('id', `${trip.id}`);
        tripList.append(item);
      });

      reportStatus(`Successfully loaded ${response.data.length} trips`)
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
};

// GET ALL TRIPS
const loadTrips = () => {
  getTrips(URL)
}
// GET ASIA
const asiaTrips = () => {
  let url = (URL + '/continent?query=Asia')
  getTrips(url)
}
// GET AFRICA
const africaTrips = () => {
  let url = (URL + '/continent?query=Africa')
  getTrips(url)
}
// GET Antartica
const antarticaTrips = () => {
  let url = (URL + '/continent?query=Antartica')
  getTrips(url)
}
// GET Australasia
const australasiaTrips = () => {
  let url = (URL + '/continent?query=Australasia')
  getTrips(url)
}
// GET EUROPE
const europeTrips = () => {
  let url = (URL + '/continent?query=Europe')
  getTrips(url)
}
// GET North America
const nAmericaTrips = () => {
  let url = (URL + '/continent?query=North%20America')
  getTrips(url)
}
// GET South America
const sAmericaTrips = () => {
  let url = (URL + '/continent?query=South%20America')
  getTrips(url)
}

// GET details for single trip
const getTripDetails = function getTripDetails(id) {

  let tripDetail = $('#trip-detail-section');
  tripDetail.empty();

  axios.get(URL + id)
    .then((response) => {
      let data = response.data;
      let name = $(`<h4><strong>Name:</strong> ${data.name}</h4>`).addClass(`${id}`);
      let about = $(`<span><strong>Description:</strong> ${data.about.slice(0, 150)}</span>`).addClass("teaser");
      let aboutFullText = $(`<span>${data.about.slice(150)}</span>`).addClass("moreinfo hidden").attr('id', 'info1');
      let more = $(`<span>...Read more</span>`).addClass("more").attr('target', 1);
      let continent = $(`<p><strong>Continent:</strong> ${data.continent}</p>`);
      let category = $(`<p><strong>Category:</strong> ${data.category}</p>`);
      let weeks = $(`<p><strong>Weeks:</strong> ${data.weeks}</p>`);
      let cost = $(`<p><strong>Cost:</strong> $${data.cost}</p>`);

      tripDetail.append(name, about, aboutFullText, more, continent, category, weeks, cost);

      reportStatus(`Successfully loaded details for ${response.data.name} trip`)
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Error: ${error.message}`);
    });
}

// Form helpers
const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#trip-form input[name="${name}"]`);

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };

  const formData = {};
  FORM_FIELDS.forEach((field) => {
    formData[field] = getInput(field);
  });

  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
}

// Reserve spot on trip
const reserveTrip = (event) => {
  event.preventDefault();
  // let id = Number($('#trip-detail-section h4')[0].classList[0]);
  let id = $('.trip-detail-section h4').attr("class");

  const tripData = readFormData();

  reportStatus('Sending trip reservation data...');

  axios.post((`${URL}${id}/reservations`), tripData)
    .then((response) => {
      clearForm();
      reportStatus(`Successfully created trip reservation with ID ${response.data.trip_id}!`);
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#asia').click(asiaTrips);
  $('#africa').click(africaTrips);
  $('#antartica').click(antarticaTrips);
  $('#australasia').click(australasiaTrips);
  $('#europe').click(europeTrips);
  $('#north-amer').click(nAmericaTrips);
  $('#south-amer').click(sAmericaTrips);

  $('#trip-list').on('click', 'li', function(event) {
    let id = Number(event.target.id);
    $("section").removeClass("hidden");
    getTripDetails(id);
  });

  $('#trip-form').submit(reserveTrip);

  $(".trip-detail-section").on('click', '.more', function(event) {
    $(".moreinfo").removeClass("hidden");
    $(".more").addClass("hidden");
  });

//Failed attempts at reading input from a drop-down form to select specific continent...
  // $('load-by-continent-form').submit(function() {
  //   console.log($("#load-by-continent-form").val());
  // });

  // $('#submit').on('click', function() {
  //   let continent = $( "#load-by-continent" ).val();
  //   loadTripsByContinent(continent);
  // });

  // $('#load-by-continent').submit(function() {
  //    let continent = $( "#load-by-continent" ).val();
  //    loadTripsByContinent(continent);
  // });

//More failed attempts at making a toggle read more/less function
  // $('.moreinfo').hide();
  // $('.more').click(function (ev) {
  //   $(".more-info").removeClass("hidden");
  //   console.log(ev);
    // let t = ev.target
    // $('#info' + $(this).attr('target')).toggle(500, function(){
    //   $(t).html($(this).is(':visible')? 'I\'m done reading more' : 'Read more')
    // });
    // return false;
  // });
  // $(".more").toggle(function(){
  //   $(this).text("less..").siblings(".complete").show();
  // }, function(){
  //   $(this).text("more..").siblings(".complete").hide();
  // });
});
