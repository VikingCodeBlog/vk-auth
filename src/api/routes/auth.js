const authController = require('../controllers/auth');

module.exports = (app, path) => {
  app.post(`/${path}/login/local`, authController.localLogin);
  app.get(`/${path}/check-token`, authController.checkToken);
  app.post(`/${path}/send-ip-code`, authController.sendIpCode);
};
