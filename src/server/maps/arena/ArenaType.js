const Enumeration = require('common/Enumeration');
// const types = require('server/maps/arena/types');

// let instance;

// class ArenaType extends Enumeration {
//   constructor() {
//     super([
//       'DEFAULT',
//       'DONUT',
//     ]);
//   }

//   static get instance() {
//     if (!instance) {
//       instance = new ArenaType();
//     }

//     return instance;
//   }

//   get(name) {
//     const type = super.get(name);

//     if (type) {
//       return types[type];
//     }

//     return null;
//   }
// }

module.exports = new Enumeration([
  'DEFAULT',
  'DONUT',
]);
