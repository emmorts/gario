const OPCode = require('../opCode');
const BufferCodec = require('buffercodec');

class PacketHandler {

  constructor(gameServer, socket) {
    this.gameServer = gameServer;
    this.socket = socket;
  }

  handleMessage(message) {
    if (!message || message.length === 0) {
      return;
    }
    
    const codec = BufferCodec(message);
    const opcode = codec.parse({ code: 'uint8' }, obj => obj.code);
    
    switch (opcode) {
      case OPCode.SPAWN_PLAYER:
        this._spawnPlayer.call(this, codec);
        break;
      case OPCode.PLAYER_MOVE:
        this._movePlayer.call(this, codec);
        break;
      case OPCode.CAST_PRIMARY:
        this._castPrimary.call(this, codec);
        break;
      default:
        console.log("Undefined opcode %s", opcode);
    }
  }

  _spawnPlayer(codec) {
    const playerName = codec.parse({
      name: { type: 'string', encoding: 'utf8' }
    }, obj => obj.name || '');
    
    this.socket.playerController.setName(playerName);
    this.gameServer.gameMode.onPlayerSpawn(this.socket.playerController);
  }

  _movePlayer(codec) {
    const target = codec.parse({
      x: 'uint16le',
      y: 'uint16le'
    });
    
    this.socket.playerController.setTarget(target);
  }

  _castPrimary(codec) {
    const options = codec.parse({
      playerX: 'uint16le',
      playerY: 'uint16le',
      x: 'uint16le',
      y: 'uint16le',
    });
    
    this.socket.playerController.cast(OPCode.SPELL_PRIMARY, options);
  }
  
}

module.exports = PacketHandler;