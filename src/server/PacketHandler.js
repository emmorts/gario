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
  const opcode = codec.parse({ code: 'uint8' }, obj => obj.code);
  
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
  const playerName = codec.parse({
    name: { type: 'string', encoding: 'utf8' }
  }, obj => obj.name || '');
  
  this.socket.playerController.setName(playerName);
  this.gameServer.gameMode.onPlayerSpawn(this.gameServer, this.socket.playerController);
}

function movePlayer(codec) {
  const target = codec.parse({
    x: 'uint16le',
    y: 'uint16le'
  });
  
  this.socket.playerController.setTarget(target);
}

function castPrimary(codec) {
  const options = codec.parse({
    playerX: 'uint16le',
    playerY: 'uint16le',
    x: 'uint16le',
    y: 'uint16le',
  });
  
  this.socket.playerController.cast(OPCode.SPELL_PRIMARY, options);
}