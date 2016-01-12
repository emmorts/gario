let OPCode = require('../opCode');
let BufferCodec = require('buffercodec');

function PacketHandler (gameServer, socket) {
  this.gameServer = gameServer;
  this.socket = socket;
}

PacketHandler.prototype.handleMessage = function (message) {
  if (!message || message.length === 0) {
    return;
  }
  
  const codec = BufferCodec(message);
  const opcode = codec.parse({ type: 'uint8' });
  
  switch (opcode) {
    case OPCode.SPAWN:
      const playerName = codec.parse({ type: 'string', encoding: 'utf8' });
      
      this.socket.playerController.setName(playerName);
      this.gameServer.gameMode.onPlayerSpawn(this.gameServer, this.socket.playerController);

      break;
    case OPCode.PLAYER_MOVE:
      const target = codec.parse([{
        name: 'x',
        type: 'float32le'
      }, {
        name: 'y',
        type: 'float32le'
      }]);
      this.socket.playerController.setTarget(target.x, target.y);
      break;
    default:
      console.log("Undefined opcode %s", opcode);
  }
}

module.exports = PacketHandler;