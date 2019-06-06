/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/

var deviceInfo = function() {
};

var id;
var count = 0;
var latS;
var lonS;
var latG;
var lonG;

var endLocation = function() {
  clearInterval(id);
  console.log( "lat"+latS+"　lonS"+lonS+"　:　latG"+latG+"　lonG"+lonG);
}

var getLocation = function() {
  id = setInterval('getLocation2()',500);
  }


var getLocation2 = function() {
   
  	// 現在地を取得
	  navigator.geolocation.getCurrentPosition(

		// [第1引数] 取得に成功した場合の関数
		function successFunc( position )
    {
    // 最初だけ
      if(count==0){
          latS = position.coords.latitude;
          lonS = position.coords.longitude;
      }
  count++;
	// 緯度をアラート表示
  document.getElementById("resultLat").innerHTML= position.coords.latitude;
	// 経度をアラート表示
  document.getElementById("resultLon").innerHTML= position.coords.longitude;


  latG = position.coords.latitude;
  lonG = position.coords.longitude;
  var dis = getDistance(latS,lonS,latG,lonG);
    document.getElementById("distance").innerHTML= dis;

  console.log("distans"+dis);
  
},
		// [第2引数] 取得に失敗した場合の関数
		function( error )
		{
			// エラーコード(error.code)の番号
			// 0:UNKNOWN_ERROR				原因不明のエラー
			// 1:PERMISSION_DENIED			利用者が位置情報の取得を許可しなかった
			// 2:POSITION_UNAVAILABLE		電波状況などで位置情報が取得できなかった
			// 3:TIMEOUT					位置情報の取得に時間がかかり過ぎた…

			// エラー番号に対応したメッセージ
			var errorInfo = [
				"原因不明のエラーが発生しました…。" ,
				"位置情報の取得が許可されませんでした…。" ,
				"電波状況などで位置情報が取得できませんでした…。" ,
				"位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"
			] ;

			// エラー番号
			var errorNo = error.code ;

			// エラーメッセージ
			var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[ errorNo ] ;

			// アラート表示
			alert( errorMessage ) ;

			// HTMLに書き出し
			document.getElementById("result").innerHTML = errorMessage;
		} ,

		// [第3引数] オプション
		{
			"enableHighAccuracy": true,
			"timeout": 8000,
			"maximumAge": 2000,
		}

	) ;
};

function getDistance(lat1, lng1, lat2, lng2) {
    // 赤道半径
    var R = 6378137.0;

    function rad(deg) {
        return deg * Math.PI / 180;
    }

    return R *
        Math.acos(
            Math.cos(rad(lat1)) *
            Math.cos(rad(lat2)) *
            Math.cos(rad(lng2) - rad(lng1)) +
            Math.sin(rad(lat1)) *
            Math.sin(rad(lat2))
        );
}

// ここからおんせんUI
var app = {};

ons.ready(function () {
  ons.createElement('action-sheet.html', { append: true })
    .then(function (sheet) {
      app.showFromTemplate = sheet.show.bind(sheet);
      app.hideFromTemplate = sheet.hide.bind(sheet);
    });
});

app.showFromObject = function () {
  ons.openActionSheet({
    title: 'From object',
    cancelable: true,
    buttons: [
      'Label 0',
      'Label 1',
      {
        label: 'Label 2',
        modifier: 'destructive'
      },
      {
        label: 'Cancel',
        icon: 'md-close'
      }
    ]
  }).then(function (index) { console.log('index: ', index) });
};
var m = 0;
var showToast = function() {
  var word = ['You can do it!', 'Go for it!', 'It’s now or never!','I believe in you.','Do your best.'];
  ons.notification.toast(word[m], {
    timeout: 2000
  });
  m++;
};

//ここから関係ないかも
var vibrate = function() {
    navigator.vibrate(500);
};

var beep = function() {
    var my_media = new Media("beep.wav",
        // success callback
        function() {
            console.log("playAudio():Audio Success");
        },
        // error callback
        function(err) {
            console.log("playAudio():Audio Error: "+err);
    }).play();
};
/*
function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}*/


/*
var accelerationWatch = null;

function updateAcceleration(a) {
    document.getElementById('x').innerHTML = roundNumber(a.x);
    document.getElementById('y').innerHTML = roundNumber(a.y);
    document.getElementById('z').innerHTML = roundNumber(a.z);
}

var toggleAccel = function() {
    if (accelerationWatch !== null) {
        navigator.accelerometer.clearWatch(accelerationWatch);
        updateAcceleration({
            x : "",
            y : "",
            z : ""
        });
        accelerationWatch = null;
    } else {
        var options = {};
        options.frequency = 1000;
        accelerationWatch = navigator.accelerometer.watchAcceleration(
                updateAcceleration, function(ex) {
                    alert("accel fail (" + ex.name + ": " + ex.message + ")");
                }, options);
    }
};

var preventBehavior = function(e) {
    e.preventDefault();
};

function dump_pic(data) {
    var viewport = document.getElementById('viewport');
    viewport.style.display = "";
    viewport.style.position = "absolute";
    viewport.style.top = "10px";
    viewport.style.left = "10px";
    document.getElementById("test_img").src = "data:image/jpeg;base64," + data;
}

function fail(msg) {
    alert(msg);
}

function show_pic() {
    navigator.camera.getPicture(dump_pic, fail, {
        quality : 50,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 100,
        targetHeight: 100
    });
}

function close() {
    var viewport = document.getElementById('viewport');
    viewport.style.position = "relative";
    viewport.style.display = "none";
}

function contacts_success(contacts) {
    alert(contacts.length
            + ' contacts returned.'
            + (contacts[2] && contacts[2].name ? (' Third contact is ' + contacts[2].name.formatted)
                    : ''));
}

function contacts_failed(msgObject){
    alert("Failed to access contact list:" + JSON.stringify(msgObject));
}

function get_contacts() {
    var obj = new ContactFindOptions();
    obj.filter = "";
    obj.multiple = true;
    navigator.contacts.find(
            [ "displayName", "name" ], contacts_success,
            contacts_failed, obj);
}

function check_network() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    confirm('Connection type:\n ' + states[networkState]);
}

var watchID = null;

function updateHeading(h) {
    document.getElementById('h').innerHTML = h.magneticHeading;
}

function toggleCompass() {
    if (watchID !== null) {
        navigator.compass.clearWatch(watchID);
        watchID = null;
        updateHeading({ magneticHeading : "Off"});
    } else {
        var options = { frequency: 1000 };
        watchID = navigator.compass.watchHeading(updateHeading, function(e) {
            alert('Compass Error: ' + e.code);
        }, options);
    }
}
*/
function init() {
  var tokdis; 
    // the next line makes it impossible to see Contacts on the HTC Evo since it
    // doesn't have a scroll button
    // document.addEventListener("touchmove", preventBehavior, false);
    document.addEventListener("deviceready", deviceInfo, true);

    tokdis = getDistance(35.689487, 139.691706, 35.5562073, 139.5723855);
    document.getElementById("exDistance").innerHTML= tokdis;
    
}

