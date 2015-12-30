'use strict';

let config = require('./config');

exports.massToRadius = function (mass) {
  return 4 + Math.sqrt(mass) * 6;
};

exports.log = (function () {
  var log = Math.log;
  return function (n, base) {
    return log(n) / (base ? log(base) : 1);
  };
})();

exports.getDistance = function (pointA, pointB) {
  return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)) - pointA.radius - pointB.radius;
};

exports.randomInRange = function (from, to) {
  return Math.floor(Math.random() * (to - from)) + from;
};

exports.randomPosition = function (radius) {
  return {
    x: exports.randomInRange(radius, config.gameWidth - radius),
    y: exports.randomInRange(radius, config.gameHeight - radius)
  };
};

exports.findIndex = function (arr, id) {
  var len = arr.length;

  while (len--) {
    if (arr[len].id === id) {
      return len;
    }
  }

  return -1;
};

exports.randomColor = function () {
  var color = '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
  var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  var r = (parseInt(c[1], 16) - 32) > 0 ? (parseInt(c[1], 16) - 32) : 0;
  var g = (parseInt(c[2], 16) - 32) > 0 ? (parseInt(c[2], 16) - 32) : 0;
  var b = (parseInt(c[3], 16) - 32) > 0 ? (parseInt(c[3], 16) - 32) : 0;

  return {
    fill: color,
    border: '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  };
};
