exports.register = (app) => {
  require('server/api/controllers/AuthController')(app);
};
