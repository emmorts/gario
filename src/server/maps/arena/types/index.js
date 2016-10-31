const ArenaType = require('server/maps/arena/ArenaType');

module.exports = {
  [ArenaType.DEFAULT]: require('server/maps/arena/types/Default'),
  [ArenaType.DONUT]: require('server/maps/arena/types/Donut'),
};
