const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

// Report Status and Errors to User
const reportStatus = (message) => {
  $('#status-message').html(message)
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li> ${field}: ${problem}<li>`;
    }
  }
  content += '</ul>';
  reportStatus(content)
};


$(document).ready(() => {

});
