function getServerURL(trigger, action) {
  var domain = localStorage.getItem('domain');
  var port = localStorage.getItem('port');
  var url = "https://" + domain + ":" + port + "/" + trigger + "/" + action;
  return url;
}

function garageRestCall(url) {
  var username = localStorage.getItem('username');
  var password = localStorage.getItem('password');

  $.ajax({
    type: "GET",
    url: url,
    dataType: "text",
    headers: {
      "Authorization": "Basic " + btoa(username + ":" + password)
    },
    cache: false,
    crossDomain: true,
    timeout: 5000,
    error: function(textStatus, errorThrown) {
        document.getElementById("error").innerHTML = errorThrown;
        onGarageError();
    },
    success: function(data, status) {
      if (status == "success") {
          onGarageSuccess(data.trim(), false);
      } else {
          onGarageError();
      }
    }
  });
}

function saveServerSettings() {
  var domain = document.getElementById('domain').value;
  localStorage.setItem('domain', domain);
  var port = document.getElementById('port').value;
  localStorage.setItem('port', port);
  var username = document.getElementById('username').value;
  localStorage.setItem('username', username);
  var password = document.getElementById('password').value;
  localStorage.setItem('password', password);
}

function loadServerSettings() {
  var domain = localStorage.getItem('domain');
  document.getElementById('domain').parentNode.MaterialTextfield.change(domain);
  var port = localStorage.getItem('port');
  document.getElementById('port').parentNode.MaterialTextfield.change(port);
  var username = localStorage.getItem('username');
  document.getElementById('username').parentNode.MaterialTextfield.change(username);
  var password = localStorage.getItem('password');
  document.getElementById('password').parentNode.MaterialTextfield.change(password);
}
