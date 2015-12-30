var OPCode = {
  "SYN": 0x0,
  "ACK": 0x1,  
  "JOINED": 0x2,
  "PING": 0x3,
  "PONG": 0x4,
  "SPAWN": 0x5
};

if (typeof window === 'undefined') {
    module.exports = OPCode;
} else {
    window.OPCode = OPCode;
}