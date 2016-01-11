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
      const playerName = codec.parse({ type: 'string', encoding: 'utf8' });
      
      this.socket.playerController.setName(playerName);
      this.gameServer.gameMode.onPlayerSpawn(this.gameServer, this.socket.playerController);

      break;
    case OPCode.PLAYER_MOVE:
      const target = codec.parse([{
        name: 'x',
        type: 'floatle'
      }, {
        name: 'y',
        type: 'floatle'
      }]);
      this.socket.playerController.setTarget(target.x, target.y);
      break;
    default:
      console.log("Undefined opcode %s", opcode);
  }
}

module.exports = PacketHandler;