const userController = require('../controllers/user');

module.exports = (app, path) => {
  app.post(`/${path}/create`, userController.create);
  app.get(`/${path}/validate-by-email/:id`, userController.validateByEmail);
};
