import { spawn } from 'child_process';

const salas = ['sala1','sala2','sala3','sala4','sala5','sala6'];

salas.forEach(salaId => {
  spawn('node', ['sensores/temperatura.js'], { env: { ...process.env, SALA_ID: salaId }, stdio: 'inherit' });
  spawn('node', ['sensores/presenca.js'], { env: { ...process.env, SALA_ID: salaId }, stdio: 'inherit' });
  spawn('node', ['atuadores/arCondicionado.js'], { env: { ...process.env, SALA_ID: salaId }, stdio: 'inherit' });
  spawn('node', ['atuadores/iluminacao.js'], { env: { ...process.env, SALA_ID: salaId }, stdio: 'inherit' });
  spawn('node', ['controladores/controladorInteligente.js'], { env: { ...process.env, SALA_ID: salaId }, stdio: 'inherit' });
});