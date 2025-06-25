# Monitoramento IoT de Salas Inteligentes

Simulação de automação para 6 salas usando sensores e atuadores MQTT, com controle automático e manual, além de dashboard web em tempo real.

## Funcionalidades
- Simulação de temperatura e presença em 6 salas
- Controle automático do ar-condicionado e da luz por sensores
- Controle manual via dashboard web
- Atualização em tempo real via MQTT
- Estrutura modular e escalável

## Como usar
1. Clone o repositório e acesse a pasta:
   git clone https://github.com/seu-usuario/monitoramento-iot-salas.git
   cd monitoramento-iot-salas

2. Instale as dependências:
   npm install

3. (Opcional) Configure o broker em `.env`:
   MQTT_BROKER_URL=mqtt://broker.hivemq.com

4. Rode o sistema:
   node startAll.js

5. Acesse o dashboard abrindo `web/index.html` no navegador.

## Observações
- O dashboard exibe temperatura, presença e estado dos dispositivos para cada sala
- Botões permitem controle manual de ar e luz por 2 minutos
- Pode monitorar tópicos MQTT via HiveMQ Web Client ou MQTT Explorer

---
Projeto educacional para demonstração de IoT e MQTT.