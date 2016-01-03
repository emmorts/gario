let OPCode = require('../opCode');
let BufferCodec = require('../bufferCodec');

function PacketHandler (gameServer, socket) {
  this.gameServer = gameServer;
  this.socket = socket;
}

PacketHandler.prototype.handleMessage = function (message) {
  if (!message || message.length === 0) {
    return;
  }
  
  let codec = BufferCodec(message.data);
  const opcode = codec.getOpcode();
  
  switch (opcode) {
    case OPCode.SPAWN:
      const length = codec.parse({ type: 'uint8' });
      const playerName = codec.parse({ type: 'string', length: length });
      
      this.socket.playerController.setName(playerName);
      break;
  }
}

module.exports = PacketHandler;