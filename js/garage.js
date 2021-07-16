/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function onGarageSave() {
  var home_away = '';
  var alertNotify = '';
  var forgotNotify = '';

  if (document.getElementById("home-away-garage").checked) home_away = 'away';
  else home_away = 'home'
  if (document.getElementById("alertNotify").checked) alertNotify = "True";
  else alertNotify = "False";
  if (document.getElementById("forgotNotify").checked) forgotNotify = "True";
  else forgotNotify = "False";

  var alertMinutes = document.getElementById('alertMinutes').value;
  var alertStart = document.getElementById('alertStart').value;
  var alertEnd = document.getElementById('alertEnd').value;
  var forgotMinutes = document.getElementById('forgotMinutes').value;

  var url = getServerURL("garage", "set_settings " + home_away + "," + alertNotify + "," + alertMinutes + "," + alertStart + "," + alertEnd + "," + forgotNotify + "," + forgotMinutes);
  garageRestCall(url);
}

function onGarageTrigger() {
  document.getElementById("garageTriggerButton").disabled = true;
  var url = getServerURL("garage", "trigger");
  garageRestCall(url);
}

function getGarageState() {
  document.getElementById("error").innerHTML = "Loading";
  document.getElementById("garageStatus").src = "img/loading-big.gif";
  var url = getServerURL("garage", "get_state");
  garageRestCall(url);
}

function onGarageError() {
  document.getElementById("garageStatus").src = "img/error.png";
  document.getElementById("error").style.color = "black";
  document.getElementById("home-away-garage-text").innerHTML = "Error";
  document.getElementById("garageTriggerButton").disabled = true;

  document.getElementById("alertNotify").parentElement.MaterialSwitch.off();
  document.getElementById("forgotNotify").parentElement.MaterialSwitch.off();

  document.getElementById("alertMinutes").parentNode.MaterialTextfield.change('');
  document.getElementById("alertStart").parentNode.MaterialTextfield.change('');
  document.getElementById("alertEnd").parentNode.MaterialTextfield.change('');
  document.getElementById("forgotMinutes").parentNode.MaterialTextfield.change('');
}

function onGarageSuccess(data, notification) {
  if (data.includes(",")) {
    var res = data.split(",");

    // get allerts info
    if (res[2] == "True") document.getElementById("alertNotify").parentElement.MaterialSwitch.on();
    else if (res[2] == "False") document.getElementById("alertNotify").parentElement.MaterialSwitch.off();

    if (res[6] == "True") document.getElementById("forgotNotify").parentElement.MaterialSwitch.on();
    else if (res[6] == "False") document.getElementById("forgotNotify").parentElement.MaterialSwitch.off();

    document.getElementById("alertMinutes").parentNode.MaterialTextfield.change(res[3]);
    document.getElementById("alertStart").parentNode.MaterialTextfield.change(res[4]);
    document.getElementById("alertEnd").parentNode.MaterialTextfield.change(res[5]);
    document.getElementById("forgotMinutes").parentNode.MaterialTextfield.change(res[7]);

    // get state of door info
    document.getElementById("garageTriggerButton").disabled = false;

    if (res[0] == "open") {
      document.getElementById("error").innerHTML = "Open";
      document.getElementById("error").style.color = "red";
      document.getElementById("garageTriggerButton").innerHTML = "Close Door";
      document.getElementById("garageStatus").src = "img/garage-up.png";
    } else if (res[0] == "closed") {
      document.getElementById("error").innerHTML = "Closed";
      document.getElementById("error").style.color = "green";
      document.getElementById("garageTriggerButton").innerHTML = "Open Door";
      document.getElementById("garageStatus").src = "img/garage-down.png";
    }

    if (res[1] == "home") {
      document.getElementById("home-away-garage").parentElement.MaterialSwitch.off();
      document.getElementById("home-away-garage-text").innerHTML = "Home";
    } else if (res[1] == "away") {
      document.getElementById("home-away-garage").parentElement.MaterialSwitch.on();
      document.getElementById("home-away-garage-text").innerHTML = "Away";
    }
  }
  else {
    // get state of door info
    document.getElementById("garageTriggerButton").disabled = false;

    if (data.includes("open") && notification) {
      document.getElementById("garageStatus").src = "img/opening.gif";
    } else if (data.includes("open") && !notification) {
      document.getElementById("garageStatus").src = "img/garage-up.png";
    } else if (data.includes("closed") && !notification) {
      document.getElementById("garageStatus").src = "img/garage-down.png";
    } else if (data.includes("closed") && notification) {
      document.getElementById("garageStatus").src = "img/closing.gif";
    }

    if (data.includes("open")) {
      document.getElementById("error").innerHTML = "Open";
      document.getElementById("error").style.color = "red";
      document.getElementById("garageTriggerButton").innerHTML = "Close Door";
    } else if (data.includes("closed")) {
      document.getElementById("error").innerHTML = "Closed";
      document.getElementById("error").style.color = "green";
      document.getElementById("garageTriggerButton").innerHTML = "Open Door";
    }

    if (data.includes("home")) {
      document.getElementById("home-away-garage").parentElement.MaterialSwitch.off();
      document.getElementById("home-away-garage-text").innerHTML = "Home";
    } else if (data.includes("away")) {
      document.getElementById("home-away-garage").parentElement.MaterialSwitch.on();
      document.getElementById("home-away-garage-text").innerHTML = "Away";
    }
  }
}
