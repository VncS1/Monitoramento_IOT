import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();

const salaId = process.env.SALA_ID || 'sala1';
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com');

let temperaturaAtual = 25;
let presencaAtual = 'vazio';

const dentroDoHorarioLetivo = () => {
  const agora = new Date();
  const hora = agora.getHours();
  return hora >= 7 && hora < 22;
};

client.on('connect', () => {
  client.subscribe(`${salaId}/temperatura`);
  client.subscribe(`${salaId}/presenca`);
});

client.on('message', (topic, message) => {
  const msg = message.toString();
  if (topic === `${salaId}/temperatura`) temperaturaAtual = parseFloat(msg);
  if (topic === `${salaId}/presenca`) presencaAtual = msg;
  aplicarRegrasInteligentes();
});

function aplicarRegrasInteligentes() {
  if (dentroDoHorarioLetivo()) {
    if (temperaturaAtual > 26 && presencaAtual === 'ocupado') {
      client.publish(`${salaId}/arcondicionado/comando`, 'ligar');
    } else {
      client.publish(`${salaId}/arcondicionado/comando`, 'desligar');
    }
    if (presencaAtual === 'ocupado') {
      client.publish(`${salaId}/luz/comando`, 'ligar');
    } else {
      client.publish(`${salaId}/luz/comando`, 'desligar');
    }
  } else {
    client.publish(`${salaId}/arcondicionado/comando`, 'desligar');
    client.publish(`${salaId}/luz/comando`, 'desligar');
  }
}