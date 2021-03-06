const jwt = require('jsonwebtoken');
const { sendToRabbit } = require('./rabbit');

const sendMail = (from, to, subject, text, html) => {
  const toSend = {
    from,
    to,
    subject,
    text,
    html,
  };

  sendToRabbit(toSend);
};

const sendValidateUser = (createdUser) => {
  const payload = {
    userId: createdUser._id,
  };

  const token = jwt.sign(payload, process.env.AUTH_KEY, {
    expiresIn: 2 * 60 * 60 * 1000, // 2 horas
  });

  const from = process.env.EMAIL_FROM;
  const to = createdUser.data.email;
  const subject = process.env.CREATE_USER_EMAIL_SUBJECT;
  const text = process.env.CREATE_USER_EMAIL_BASEURL + token;
  const html = process.env.CREATE_USER_EMAIL_HTML.replace(/TOKEN/g, text);
  sendMail(from, to, subject, text, html);
};

const sendValidateIP = (_ip, userIPs, email, randomCode) => {
  const from = process.env.EMAIL_FROM;
  const to = email;
  const subject = process.env.VALIDATE_IP_EMAIL_SUBJECT;
  const html = process.env.VALIDATE_IP_EMAIL_HTML.replace(/CODE/g, randomCode);
  sendMail(from, to, subject, html, html);
};

module.exports = { sendMail, sendValidateUser, sendValidateIP };
