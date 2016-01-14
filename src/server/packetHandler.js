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
    case OPCode.SPAWN_PLAYER:
      spawnPlayer.call(this, codec);
      break;
    case OPCode.PLAYER_MOVE:
      movePlayer.call(this, codec);
      break;
    case OPCode.CAST_PRIMARY:
      castPrimary.call(this, codec);
      break;
    default:
      console.log("Undefined opcode %s", opcode);
  }
}

module.exports = PacketHandler;

function spawnPlayer(codec) {
  const playerName = codec.parse({ type: 'string', encoding: 'utf8' });
  
  this.socket.playerController.setName(playerName);
  this.gameServer.gameMode.onPlayerSpawn(this.gameServer, this.socket.playerController);
}

function movePlayer(codec) {
  const target = codec.parse([{
    name: 'x',
    type: 'uint16le'
  }, {
    name: 'y',
    type: 'uint16le'
  }]);
  
  this.socket.playerController.setTarget(target);
}

function castPrimary(codec) {
  const target = codec.parse([{
    name: 'x',
    type: 'uint16le'
  }, {
    name: 'y',
    type: 'uint16le'
  }]);
  
  this.socket.playerController.cast(OPCode.SPELL_PRIMARY, target);
}