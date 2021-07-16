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
var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.receivedEvent('deviceready');

    loadServerSettings();
    getState();
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    window.FirebasePlugin.onTokenRefresh(
      function(token) {
        console.log("FIREBASE TOKEN: " + token);
        setDeviceID(token);
      },
      function(error) {
        console.error("FIREBASE TOKEN ERROR:" + error);
      });

    window.FirebasePlugin.onMessageReceived(
      function(data) {
        if (data.tap) {
          onGarageSuccess(data.event, true);
        } else {
          document.getElementById('home').click();
          onGarageSuccess(data.event, true);
        }
      },
      function(error) {
        alert(error);
      }
    );

    console.log('Received Event: ' + id);
  }
};

app.initialize();

function getDeviceID() {

  window.FirebasePlugin.getToken(
    function(token) {
      console.log("FIREBASE TOKEN: " + token);
      setDeviceID(token);
      alert(token);
    },
    function(error) {
      console.error("FIREBASE TOKEN ERROR:" + error);
    }
  );

}

function setDeviceID(token) {
  var action = "firebase:" + token;
  var url = getServerURL("garage", action);
  garageRestCall(url);
}

function getState() {
  getGarageState();
}

function viewPage(page) {
  if (page == "home") {
    document.getElementById('home').style.display = "initial";
    document.getElementById('notificationsettings').style.display = "none";
    document.getElementById('serversettings').style.display = "none";
  } else if (page == "notificationsettings") {
    document.getElementById('home').style.display = "none";
    document.getElementById('notificationsettings').style.display = "inline";
    document.getElementById('serversettings').style.display = "none";
  } else if (page == "serversettings") {
    document.getElementById('home').style.display = "none";
    document.getElementById('notificationsettings').style.display = "none";
    document.getElementById('serversettings').style.display = "inline";
  }
  document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
}
