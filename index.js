const express = require('express');
const dotenv = require('dotenv');
const { connectRabbit, disconnectRabbit } = require('./src/helpers/rabbit');

if (!process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Init mongo database
const db = require('vkmongo'); // eslint-disable-line
connectRabbit(process.env.AMQP_URL, process.env.AMQP_QUEUE);

const app = express();
app.use(express.json());
require('./src/api/routes')(app); // eslint-disable-line

const server = app.listen(process.env.port || 3000, () => {
  console.log('vkAuth up');
});

process.on('exit', () => {
  disconnectRabbit();
  db.close();
});

module.exports = { app, db, server, disconnectRabbit };
