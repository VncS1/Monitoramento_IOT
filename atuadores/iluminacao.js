import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();

const salaId = process.env.SALA_ID || 'sala1';
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com');

const presencaTopic = `${salaId}/presenca`;
const luzCmdTopic = `${salaId}/luz/comando`;
const luzManualTopic = `${salaId}/luz/manual`;
const luzStateTopic = `${salaId}/luz/estado`;

let luzLigada = false;
let manual = null;

client.on('connect', () => {
  client.subscribe(presencaTopic);
  client.subscribe(luzManualTopic);
  client.publish(luzStateTopic, luzLigada ? 'ligada' : 'desligada');
});

client.on('message', (topic, message) => {
  if (topic === luzManualTopic) {
    if (message.toString() === 'ligar') {
      luzLigada = true;
      manual = true;
      client.publish(luzStateTopic, 'ligada');
      console.log(`[${salaId}] LUZ ligada MANUALMENTE`);
    } else if (message.toString() === 'desligar') {
      luzLigada = false;
      manual = false;
      client.publish(luzStateTopic, 'desligada');
      console.log(`[${salaId}] LUZ desligada MANUALMENTE`);
    }
  }
  if (topic === presencaTopic && manual === null) {
    if (message.toString() === 'ocupado' && !luzLigada) {
      luzLigada = true;
      client.publish(luzStateTopic, 'ligada');
      console.log(`[${salaId}] LUZ ligada AUTOMATICAMENTE`);
    } else if (message.toString() === 'vazio' && luzLigada) {
      luzLigada = false;
      client.publish(luzStateTopic, 'desligada');
      console.log(`[${salaId}] LUZ desligada AUTOMATICAMENTE`);
    }
  }
});
setInterval(() => { manual = null; }, 120000);