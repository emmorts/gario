module.exports = {
  FFA: require('./FFA')
};

module.exports.get = function (id) {
  let mode;
  
  switch (id) {
    default:
      mode = new module.exports.FFA();
      break;
  }
  
  return mode;
};
