const { sendToRabbit } = require('./rabbitHelper')

function sendMail(from, to, subject, text, html) {
  const toSend = {
    from,
    to,
    subject,
    text,
    html,
  };

  sendToRabbit(toSend);
}

module.exports = { sendMail }