// ================= MQTT =================
const client =
mqtt.connect(
'wss://broker.hivemq.com:8884/mqtt'
);

// ================= MAP =================
const map =
L.map('map')
.setView([-7.9222,112.5966],18);

// ================= GOOGLE MAP STYLE =================
L.tileLayer(
'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
{
subdomains:['mt0','mt1','mt2','mt3'],
maxZoom: 22
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

// ================= MARKER MOBIL =================
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

// ================= START RACE =================
function startRace(){

document.getElementById(
"lapStatus"
).innerHTML = "RUNNING";

startTime = Date.now();

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

// ================= RESET =================
function resetRace(){

clearInterval(totalInterval);

route = [];

polyline.setLatLngs([]);

document.getElementById(
"lapStatus"
).innerHTML = "READY";

document.getElementById(
"totalTime"
).innerHTML = "00:00";

}

// ================= MQTT CONNECT =================
client.on('connect',()=>{

document.getElementById(
"mqtt-status"
).innerHTML = "ONLINE";

client.subscribe("kmhe/gps");

});

// ================= DATA GPS =================
client.on('message',(topic,msg)=>{

const d =
JSON.parse(msg.toString());

// ================= UI =================
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

// ================= GERAK MOBIL =================
marker.setLatLng([
d.lat,
d.lng
]);

// ================= FOLLOW MAP =================
map.panTo([
d.lat,
d.lng
]);

// ================= ROUTE TRACK =================
route.push([
d.lat,
d.lng
]);

polyline.setLatLngs(route);

});
