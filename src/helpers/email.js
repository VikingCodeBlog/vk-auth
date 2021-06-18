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
  const from = process.env.CREATE_USER_EMAIL_FROM;
  const to = createdUser.data.email;
  const subject = process.env.CREATE_USER_EMAIL_SUBJECT;
  const text = process.env.CREATE_USER_EMAIL_BASEURL + createdUser._id;
  const html = process.env.CREATE_USER_EMAIL_HTML;
  sendMail(from, to, subject, text, html);
};

module.exports = { sendMail, sendValidateUser };
