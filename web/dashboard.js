const salas = ['sala1','sala2','sala3','sala4','sala5','sala6'];
const salaNames = ['Sala 1','Sala 2','Sala 3','Sala 4','Sala 5','Sala 6'];

const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

function renderSalas() {
  const div = document.getElementById("salas");
  div.innerHTML = salas.map((salaId, idx) => `
    <div class="sala-block" id="${salaId}">
      <h2>${salaNames[idx]}</h2>
      <p>🌡️ Temperatura: <span id="${salaId}-temp">--</span> °C</p>
      <p>🧍 Presença: <span id="${salaId}-presenca">--</span></p>
      <p>❄️ Ar-condicionado: <span id="${salaId}-ar">--</span></p>
      <div class="controls">
        <button class="btn-on" onclick="controlManual('${salaId}','arcondicionado','ligar')">Ligar Ar</button>
        <button class="btn-off" onclick="controlManual('${salaId}','arcondicionado','desligar')">Desligar Ar</button>
      </div>
      <p>💡 Luz: <span id="${salaId}-luz">--</span></p>
      <div class="controls">
        <button class="btn-on" onclick="controlManual('${salaId}','luz','ligar')">Ligar Luz</button>
        <button class="btn-off" onclick="controlManual('${salaId}','luz','desligar')">Desligar Luz</button>
      </div>
    </div>
  `).join("");
}
window.controlManual = function(salaId, tipo, acao) {
  const topic = `${salaId}/${tipo}/manual`;
  client.publish(topic, acao);
};
renderSalas();

salas.forEach(salaId => {
  client.subscribe(`${salaId}/temperatura`);
  client.subscribe(`${salaId}/presenca`);
  client.subscribe(`${salaId}/arcondicionado/estado`);
  client.subscribe(`${salaId}/luz/estado`);
});

client.on('message', (topic, message) => {
  salas.forEach(salaId => {
    if (topic === `${salaId}/temperatura`)
      document.getElementById(`${salaId}-temp`).textContent = message.toString();
    if (topic === `${salaId}/presenca`)
      document.getElementById(`${salaId}-presenca`).textContent = message.toString().toUpperCase();
    if (topic === `${salaId}/arcondicionado/estado`)
      document.getElementById(`${salaId}-ar`).textContent = message.toString().toUpperCase();
    if (topic === `${salaId}/luz/estado`)
      document.getElementById(`${salaId}-luz`).textContent = message.toString().toUpperCase();
  });
});