// ================= MQTT =================
const client =
mqtt.connect(
'wss://broker.hivemq.com:8884/mqtt'
);

// ================= MAP =================
const map =
L.map('map')
.setView([-7.9222,112.5966],18);

// ================= GOOGLE MAP =================
L.tileLayer(
'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
{
subdomains:['mt0','mt1','mt2','mt3'],
maxZoom:22
}
).addTo(map);

// ================= ICON MOBIL =================
const carIcon =
L.icon({

iconUrl:
'https://cdn-icons-png.flaticon.com/512/744/744465.png',

iconSize:[60,60],
iconAnchor:[30,30]

});

// ================= MARKER =================
const marker =
L.marker(
[-7.9222,112.5966],
{icon:carIcon}
).addTo(map);

// ================= ROUTE =================
let route = [];

const polyline =
L.polyline(route,{

color:'#00ffee',
weight:5

}).addTo(map);

// ================= TIMER =================
let totalInterval;
let startTime;
let lapStartTime;

// ================= LAP =================
let lapCount = 0;
let bestLap = null;

// ================= RACE =================
let raceRunning = false;

// ================= AUTO LAP =================
let startLat = null;
let startLng = null;

const lapRadius = 0.00008;

let lapCooldown = false;

// ================= START =================
function startRace(){

raceRunning = true;

lapCount = 0;

bestLap = null;

route = [];

polyline.setLatLngs([]);

document.getElementById(
"lapHistory"
).innerHTML = "";

document.getElementById(
"lapStatus"
).innerHTML = "RUNNING";

startTime = Date.now();

lapStartTime = Date.now();

// TOTAL TIMER
totalInterval =
setInterval(()=>{

let t =
Date.now() - startTime;

let sec =
Math.floor(t/1000);

let min =
Math.floor(sec/60);

sec = sec % 60;

document.getElementById(
"totalTime"
).innerHTML =
String(min).padStart(2,'0')
+ ":" +
String(sec).padStart(2,'0');

},1000);

}

// ================= STOP =================
function stopRace(){

raceRunning = false;

clearInterval(totalInterval);

document.getElementById(
"lapStatus"
).innerHTML = "STOPPED";

}

// ================= RESET =================
function resetRace(){

raceRunning = false;

clearInterval(totalInterval);

route = [];

polyline.setLatLngs([]);

lapCount = 0;

bestLap = null;

document.getElementById(
"lapStatus"
).innerHTML = "READY";

document.getElementById(
"totalTime"
).innerHTML = "00:00";

document.getElementById(
"bestLap"
).innerHTML = "00:00";

document.getElementById(
"lastLap"
).innerHTML = "00:00";

document.getElementById(
"lapHistory"
).innerHTML = "";

}

// ================= FORMAT TIME =================
function formatTime(ms){

let sec =
Math.floor(ms/1000);

let min =
Math.floor(sec/60);

sec = sec % 60;

return (
String(min).padStart(2,'0')
+ ":" +
String(sec).padStart(2,'0')
);

}

// ================= ADD LAP =================
function addLap(){

lapCount++;

let lapNow =
Date.now() - lapStartTime;

lapStartTime = Date.now();

let lapText =
formatTime(lapNow);

// LAST LAP
document.getElementById(
"lastLap"
).innerHTML = lapText;

// BEST LAP
if(bestLap == null || lapNow < bestLap){

bestLap = lapNow;

document.getElementById(
"bestLap"
).innerHTML = lapText;

}

// HISTORY
document.getElementById(
"lapHistory"
).innerHTML +=

"<p>LAP "
+ lapCount +
" : " +
lapText +
"</p>";

}

// ================= MQTT CONNECT =================
client.on('connect',()=>{

document.getElementById(
"mqtt-status"
).innerHTML = "ONLINE";

client.subscribe("kmhe/gps");

});

// ================= GPS DATA =================
client.on('message',(topic,msg)=>{

const d =
JSON.parse(msg.toString());

// UI
document.getElementById(
"speed"
).innerHTML =
d.speed.toFixed(1);

document.getElementById(
"sat"
).innerHTML =
d.sat;

document.getElementById(
"lat"
).innerHTML =
d.lat.toFixed(6);

document.getElementById(
"lng"
).innerHTML =
d.lng.toFixed(6);

// MOVE MOBIL
marker.setLatLng([
d.lat,
d.lng
]);

// FOLLOW MAP
map.panTo([
d.lat,
d.lng
]);

// ROUTE
route.push([
d.lat,
d.lng
]);

polyline.setLatLngs(route);

// AUTO LAP
if(raceRunning){

// SET START
if(startLat == null){

startLat = d.lat;
startLng = d.lng;

}

// DISTANCE
let dLat =
Math.abs(d.lat - startLat);

let dLng =
Math.abs(d.lng - startLng);

// CHECK START AREA
if(
dLat < lapRadius &&
dLng < lapRadius &&
!lapCooldown
){

addLap();

lapCooldown = true;

// COOLDOWN
setTimeout(()=>{

lapCooldown = false;

},5000);

}

}

});
