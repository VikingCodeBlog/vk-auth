const fs = require('fs');

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;
    const fileName = `${file.substr(0, file.indexOf('.'))}`;
    require(`./${fileName}`)(app, fileName); // eslint-disable-line
  });
};
