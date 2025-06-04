import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();

const salaId = process.env.SALA_ID || 'sala1';
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com');
const topic = `${salaId}/presenca`;

client.on('connect', () => {
  let estado = false;
  setInterval(() => {
    estado = !estado;
    const mensagem = estado ? 'ocupado' : 'vazio';
    client.publish(topic, mensagem);
    console.log(`[${salaId}] Presença: ${mensagem}`);
  }, 7000);
});