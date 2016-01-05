module.exports = {
  FFA: require('./FFA')
};

var get = function (id) {
  var mode;
  switch (id) {
    default: // FFA is default
      mode = new module.exports.FFA();
      break;
  }
  return mode;
};

module.exports.get = get;
