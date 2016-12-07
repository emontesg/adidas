

var app = {};

if(config) {
  console.log('configuration loaded');
} else {
  console.error('error while loading config file')
}

app.lastTenCoords = [];
app.lastTenCoordsIterator = 0;
app.lastPosition = {};
app.intervalId;
app.positionObserver = {};
app.positionObserverId;
app.userAllowedGeolocation = false;
app.totalDistance = 0;
app.firstLocation = true;
app.startingCoords = {};
app.previousPosition = {};
app.allowStartButton = false;
app.helperFlag = true;
app.updatesCounter = 0;
app.measurePoints = [];
app.distances = [];
app.distancesIterator = 0;

app.initialize = function() {
    app.getCurrentPosition();
};

app.startApp = function() {
    if (app.allowStartButton) {
        console.log('running started');
        app.intervalId = setInterval(function(){
           app.showDetails();
        },config.timeout*1000);
    }
}


app.getCurrentPosition = function() {
  app.positionObserverId =  navigator.geolocation.watchPosition(function(location){
     app.allowStartButton = true;
     app.positionObserver = location;
     setTimeout(function(){
         app.displayStartButton();
     },2000);
  }, function(){}, {enableHighAccuracy:true,maximumAge:1000});
  
}


app.startRunning = function() {
    app.countDistance();
}

app.countDistance = function() {
  console.log(app.positionObserverId);
    if(typeof app.positionObserver.coords !== 'undefined') {
        var currentLat = app.positionObserver.coords.latitude;
        var currentLon = app.positionObserver.coords.longitude;
        var distance = 0;
        if(typeof app.measurePoints[0] !== 'undefined' &&  app.measurePoints[1] !== 'undefined') {
            var distance = getDistanceFromLatLonInKm(app.measurePoints[0].latitude, app.measurePoints[0].longitude, app.measurePoints[1].latitude, app.measurePoints[1].longitude);
        } 
        app.distances[app.distancesIterator] = distance;
        if(app.distancesIterator == 4) {
            app.distancesIterator = 0;
        } else {
            app.distancesIterator++;
        }
        
        var meters = distance*1000;
        var childTxt = document.createTextNode("["+meters+"]");  
        getHtmlEl('my-updates').appendChild(childTxt);
        var newBreak = document.createElement("br");
         getHtmlEl('my-updates').appendChild(newBreak);
        app.totalDistance = (app.totalDistance + distance);
        var sum = sumArrayValues(app.distances);
        if(sum < 2) {
          app.totalDistance = 0;
        }
        console.log(sum);
    }
}


 app.displayStartButton = function() {
     getHtmlEl('start-button').style.display = "block";
 }

 app.showDetails = function() {
    
    if(typeof app.positionObserver.coords !== 'undefined') {
        
        app.measurePoints[app.updatesCounter] = app.positionObserver.coords;
        console.log(app.measurePoints);
        var txt = 'last position lat '+app.lastPosition.latitude;
        var currentTxt = "latitude: "+app.positionObserver.coords.latitude+", longitude: "+app.positionObserver.coords.longitude;
        //getHtmlEl('my-last-position').innerHTML = txt;
        //getHtmlEl('my-current-position').innerHTML = currentTxt;
        var roundedDistance = app.totalDistance.toFixed(2);
        getHtmlEl('my-distance').innerHTML = roundedDistance;
        //getHtmlEl('my-updates').innerHTML = "app upated for the "+(app.updatesCounter+1)+" time";
       // var childTxt = document.createTextNode("["+app.measurePoints[app.updatesCounter].latitude+"]");  
       // getHtmlEl('my-updates').appendChild(childTxt);
        //var newBreak = document.createElement("br");
       // getHtmlEl('my-updates').appendChild(newBreak);

        
        if(app.updatesCounter == 1) {
          app.updatesCounter = 0;
        } else {
          app.updatesCounter++;
        }
        app.countDistance();



    }
 }


app.initialize();


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


function moveArrayElementsToTheLeft(_array, newValue) {

    var countElements = _array.length;
    var j = 1;
    for(var i = 0; i<countElements; i++) {
      if(i == (countElements - 1)) {
            _array[i] = newValue;
      } else {
          _array[i] = _array[j];  
      }
        
        j++;
    }
    return _array;

}


 function getHtmlEl(documentId) {
    var doc = document.getElementById(documentId);
    return doc;
 } 


 function sumArrayValues(_array) {
     var countElements = _array.length;
     var sum = 0;
     for(var i = 0; i <= countElements; i++) {
        sum = sum+_array[i];
     }
     return sum;
 }

