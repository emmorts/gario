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
  
  const codec = BufferCodec(message);
  const opcode = codec.getOpcode();
  
  switch (opcode) {
    case OPCode.SPAWN:
      const length = codec.parse({ type: 'uint8' });
      const playerName = codec.parse({ type: 'string', length: length, encoding: 'utf8' });
      
      this.socket.playerController.setName(playerName);
      this.gameServer.gameMode.onPlayerSpawn(this.gameServer, this.socket.playerController);

      break;
    case OPCode.MOUSE_MOVE:
      const target = codec.parse([{
        name: 'x',
        type: 'floatle'
      }, {
        name: 'y',
        type: 'floatle'
      }]);
      this.socket.playerController.target = target;
      break;
    default:
      console.log("Undefined opcode %s", opcode);
  }
}

module.exports = PacketHandler;