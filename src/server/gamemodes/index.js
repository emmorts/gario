module.exports = {
  FFA: require('server/gamemodes/FFA'),
};

module.exports.get = (id) => {
  let mode;

  switch (id) {
    default:
      mode = new module.exports.FFA(this);
      break;
  }

  return mode;
};
