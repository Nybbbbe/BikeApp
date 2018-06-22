var url =  "https://api.digitransit.fi/routing/v1/routers/hsl/bike_rental"
var map = L.map('map',{
    zoomSnap: 0.1,
}).setView([60.1680, 24.940], 15)
var locationIcon = document.querySelector('.location-icon');
var locIcon;
var pinMarker;
map.on('click', moveMap);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFubnliZXJnIiwiYSI6ImNqaWV6bW1xOTBvcjAzcG5yeGxwaWdiMmcifQ.QGOvziDjYjO4FhiDcZWBjQ'
}).addTo(map);

httpGetAsync(url, setMarkers)

function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function setMarkers(text) {
    var json = JSON.parse(text);
    var id = [];
    for(var i = 0; i < json.stations.length; i++){
        //L.marker([json.stations[i].y, json.stations[i].x]).addTo(map);
        var station = json.stations[i];
        var numOfBikes = station.bikesAvailable;
        var stationSize = numOfBikes + station.spacesAvailable
        var percentage = numOfBikes / stationSize

        if(percentage == 0){
            pinMarker = new L.Marker([station.y, station.x],{
                icon: new L.DivIcon({
                    className: 'pin-icon',
                    html: '<div class="pin-red-image" />'+
                    '<div class="pin-text-container"><div class="pin-text-center"><span class="pin-text">'+ numOfBikes + '</span></div></div></div>'
                })
            })
        }
        else if (percentage <= 0.2) {
            pinMarker = new L.Marker([station.y, station.x],{
                icon: new L.DivIcon({
                    className: 'pin-icon',
                    html: '<div class="pin-yellow-image" />'+
                    '<div class="pin-text-container"><div class="pin-text-center"><span class="pin-text">'+ numOfBikes + '</span></div></div></div>'
                })
            })
        }
        else {
            pinMarker = new L.Marker([station.y, station.x],{
                icon: new L.DivIcon({
                    className: 'pin-icon',
                    html: '<div class="pin-green-image" />'+
                    '<div class="pin-text-container"><div class="pin-text-center"><span class="pin-text">'+ numOfBikes + '</span></div></div></div>'
                })
            })
        }
        pinMarker.bindPopup("<p>" + station.name + "</p>"+
            "<p>" + numOfBikes + " / " + stationSize + "</p>"
            );
            pinMarker.addTo(map);
    }
}

locationIcon.addEventListener('click', getPosition);

function getPosition () {
    navigator.geolocation.getCurrentPosition(positionRecieved, getPositionFailed);
}

function getPositionFailed (error) {
    alert(error);
}

function positionRecieved (position){
    console.log('click')
    map.flyTo([position.coords.latitude, position.coords.longitude], 16);
    if(locIcon == null){
        locIcon = new L.Marker([position.coords.latitude, position.coords.longitude],{
            icon: new L.DivIcon({
                className: 'my-location',
                html: '<div class="my-location-image"/></div>'
            })
        }).addTo(map);
    }
}

function moveMap(e) {
    var clientY = document.getElementById('map').clientHeight;
    var clientX = document.getElementById('map').clientWidth;
    var clickY = e.layerPoint.y;
    var clickX = e.layerPoint.x;
    if(clickY <= clientY*0.05 || clickY >= clientY*0.95 || clickX <= clientX*0.05 || clickX >= clientX*0.95){
        map.flyTo([e.latlng.lat, e.latlng.lng])
    }
}


if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker
             .register('./sw.js')
             .then(function() { console.log('Service Worker Registered'); });
    } catch {
        console.log('Registration failed');
    }
  }

