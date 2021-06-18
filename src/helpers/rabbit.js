const amqp = require('amqplib');

let rabbitConnection;
let channel;
let queue;

async function connectRabbit(url, _queue) {
  rabbitConnection = await amqp.connect(url);
  channel = await rabbitConnection.createChannel();
  channel.assertQueue(_queue, {
    durable: false,
  });
  queue = _queue;
}

function disconnectRabbit() {
  rabbitConnection.close();
}

function sendToRabbit(toSend) {
  const msg = JSON.stringify(toSend);
  channel.sendToQueue(queue, Buffer.from(msg));
}

module.exports = { connectRabbit, disconnectRabbit, sendToRabbit };
