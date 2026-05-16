const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

const map = L.map('map').setView([-7.9222,112.5966], 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'KMHE'
}).addTo(map);

const marker = L.marker([-7.9222,112.5966]).addTo(map);

setInterval(()=>{
document.getElementById("clock").innerHTML =
new Date().toLocaleTimeString();
},1000);

client.on('connect',()=>{
document.getElementById("mqtt-status").innerHTML="ONLINE";
client.subscribe("kmhe/gps");
});

client.on('message',(topic,msg)=>{

const d = JSON.parse(msg.toString());

document.getElementById("speed").innerHTML = d.speed.toFixed(1);
document.getElementById("sat").innerHTML = d.sat;
document.getElementById("lat").innerHTML = d.lat;
document.getElementById("lng").innerHTML = d.lng;

marker.setLatLng([d.lat,d.lng]);
map.setView([d.lat,d.lng]);

});
