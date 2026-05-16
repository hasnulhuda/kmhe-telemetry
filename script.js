const client = mqtt.connect(
'wss://broker.hivemq.com:8884/mqtt'
);

client.on('connect', function () {

    console.log("MQTT Connected");

    client.subscribe('kmhe/gps');

});

client.on('message', function (topic, message) {

    console.log(message.toString());

    const data = JSON.parse(message.toString());

    document.getElementById("speed").innerHTML =
      "Speed : " + data.speed + " km/h";

    document.getElementById("sat").innerHTML =
      "Satellite : " + data.sat;

    document.getElementById("lat").innerHTML =
      "Latitude : " + data.lat;

    document.getElementById("lng").innerHTML =
      "Longitude : " + data.lng;

});
