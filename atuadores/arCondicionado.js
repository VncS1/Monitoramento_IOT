import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();

const salaId = process.env.SALA_ID || 'sala1';
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com');

const tempTopic = `${salaId}/temperatura`;
const arCmdTopic = `${salaId}/arcondicionado/comando`;
const arManualTopic = `${salaId}/arcondicionado/manual`;
const arStateTopic = `${salaId}/arcondicionado/estado`;

let arLigado = false;
let manual = null;

client.on('connect', () => {
  client.subscribe(tempTopic);
  client.subscribe(arManualTopic);
  client.publish(arStateTopic, arLigado ? 'ligado' : 'desligado');
});

client.on('message', (topic, message) => {
  if (topic === arManualTopic) {
    if (message.toString() === 'ligar') {
      arLigado = true;
      manual = true;
      client.publish(arStateTopic, 'ligado');
      console.log(`[${salaId}] AR ligado MANUALMENTE`);
    } else if (message.toString() === 'desligar') {
      arLigado = false;
      manual = false;
      client.publish(arStateTopic, 'desligado');
      console.log(`[${salaId}] AR desligado MANUALMENTE`);
    }
  }
  if (topic === tempTopic && manual === null) {
    const temp = parseFloat(message.toString());
    if (!arLigado && temp >= 27) {
      arLigado = true;
      client.publish(arStateTopic, 'ligado');
      console.log(`[${salaId}] AR ligado AUTOMATICAMENTE`);
    }
    if (arLigado && temp <= 23) {
      arLigado = false;
      client.publish(arStateTopic, 'desligado');
      console.log(`[${salaId}] AR desligado AUTOMATICAMENTE`);
    }
  }
});
setInterval(() => { manual = null; }, 120000);