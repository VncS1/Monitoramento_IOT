import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();

const salaId = process.env.SALA_ID || 'sala1';
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com');
const tempTopic = `${salaId}/temperatura`;
const arStateTopic = `${salaId}/arcondicionado/estado`;

let temperatura = 24 + Math.random() * 2;
let arLigado = false;

client.on('connect', () => {
  client.subscribe(arStateTopic);
  setInterval(() => {
    if (arLigado) {
      temperatura -= Math.random() * 0.3 + 0.1;
      if (temperatura < 22) temperatura = 22;
    } else {
      temperatura += Math.random() * 0.3 + 0.1;
      if (temperatura > 30) temperatura = 30;
    }
    client.publish(tempTopic, temperatura.toFixed(1));
    console.log(`[${salaId}] Temperatura atual: ${temperatura.toFixed(1)}°C`);
  }, 4000);
});

client.on('message', (topic, msg) => {
  if (topic === arStateTopic) {
    arLigado = msg.toString() === 'ligado';
  }
});