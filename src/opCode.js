var OPCode = {
  "PING": 0x1,
  "PONG": 0x2,
  "SPAWN": 0x3,
  "ADD_NODE": 0x4,
  "UPDATE_NODES": 0x5,
  "MOUSE_MOVE": 0x6
};

if (typeof window === 'undefined') {
    module.exports = OPCode;
} else {
    window.OPCode = OPCode;
}