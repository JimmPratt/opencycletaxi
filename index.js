/* -------------------------------------------------------------------------------------------*/
// get the position, trap success, and offer up switching to lower accuracy on error
var options = {
    maximumAge: 600000,
    timeout: 5000,
    enableHighAccuracy: true
}

navigator.geolocation.watchPosition(
    successCallback,
    errorCallback_on_highAccuracy,
    options
);

/* -------------------------------------------------------------------------------------------*/
// callback functions that handles errors,
// and fall-back on a less accurate position if necessary.

function errorCallback_on_highAccuracy(position) {

    if (error.code == error.TIMEOUT)
    {
        // Attempt to get GPS location timed out after 5 seconds,
        // then try low accuracy location
        $('body').append("<p class='waitformap'>Attempting to get low accuracy location via mobile network...</p>");
        navigator.geolocation.getCurrentPosition(
               successCallback,
               errorCallback_on_lowAccuracy,
               {maximumAge: 600000, timeout: 10000, enableHighAccuracy: false});
        return;
    }

    var msg = "<p class='waitformap'>Can't get your location via high accuracy attempt (GPS). Error = ";
    if (error.code == 1)
        msg += "PERMISSION_DENIED";
    else if (error.code == 2)
        msg += "POSITION_UNAVAILABLE";
    msg += ", msg = " + error.message + "</p>";

    $('body').append(msg);
}

function errorCallback_on_lowAccuracy(position) {
    var msg = "<p class='waitformap'>Can't get your location via low accuracy attempt (mobile network). Error = ";
    if (error.code == 1)
        msg += "PERMISSION_DENIED";
    else if (error.code == 2)
        msg += "POSITION_UNAVAILABLE";
    else if (error.code == 3)
        msg += "TIMEOUT";
    msg += ", msg = " + error.message + "</p>";

    $('body').append(msg);
}

/* -------------------------------------------------------------------------------------------*/
// when we are successful at getting a position, we do all our map creation work inside here

function successCallback(position) {
	$('#map').append('<p class="waitformap">map loading...</p>');
    var customerLatitude = position.coords.latitude,
        customerLongitude = position.coords.longitude,
        accuracy = position.coords.accuracy,
        personIcon = L.icon({
            iconUrl: 'feature/person.png',
            iconSize:     [24, 24], // size of the icon
            iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
        }),
        rickshawIcon = L.icon({
            iconUrl: 'feature/rickshaw.png',
            iconSize:     [24, 24], // size of the icon
            iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
        });
    //console.log("Your location is: " + customerLatitude + "," + customerLongitude+" Accuracy="+position.coords.accuracy+"m");

    var map = L.map('map');
    
//  playing with watercolor map.  looks pretty, but not very informative
//    var layer = new L.StamenTileLayer('watercolor');
//    map.addLayer(layer); */

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Accuracy: ' + accuracy + ' meters -  &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

     /* var oms = new OverlappingMarkerSpiderfier(map); */

    // add a marker in the given location, attach some pop-up content to it and open the pop-up
    //L.marker([customerLatitude, customerLongitude], {icon: greenIcon}).addTo(map).bindPopup('you are here');

    // here is where the user is located
    L.marker([customerLatitude, customerLongitude], {icon: personIcon})
      .addTo(map);

    // here are the cycle taxis (later pulled from database)
    //  var m = L.marker([-37.785, 175.263], {draggable:true}).bindLabel('A sweet static label!', { noHide: true })


    L.marker([55.678885020269895, 12.592901587486267]).bindLabel('Jimm is available!', { noHide: true }).addTo(map).showLabel();
    L.marker([55.68060674857952, 12.587215304374695])
      .bindPopup('<b>Sebastian</b><br><span style="color:grey">Out to Lunch</span>')
      .addTo(map);
    L.marker([55.680203733331545, 12.585026621818542])
      .bindPopup('<b>George</b><br><span style="color:red">In Service</span>')
      .addTo(map);
    L.marker([55.678637756621235, 12.579651474952698])
      .bindPopup('<b>Lars</b><br><span style="color:red">In Service</span>')
      .addTo(map);
    L.marker([55.67867405230058, 12.579709142446518])
      .bindPopup('<b>Gilli</b><br><span style="color:green">Available</span>')
      .addTo(map);

    // loop through all the coordinates and find the north-eastern boundaries
    // and south-western boundaries then scale the map accordingly,
	 //fitting customer and drivers on the map

	 // replace with array from database
	 map.fitBounds([[customerLatitude, customerLongitude],
						 [55.678885020269895, 12.592901587486267],
						 [55.68060674857952, 12.587215304374695],
						 [55.680203733331545, 12.585026621818542],
						 [55.678637756621235, 12.579651474952698],
						 [55.67867405230058, 12.579709142446518]]
	 );
}
