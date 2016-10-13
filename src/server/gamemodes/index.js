module.exports = {
  FFA: require('gamemodes/FFA')
};

module.exports.get = function (id) {
  let mode;
  
  switch (id) {
    default:
      mode = new module.exports.FFA(this);
      break;
  }
  
  return mode;
};
