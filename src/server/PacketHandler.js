const OPCode = require('../opCode');
const BufferCodec = require('buffercodec');
const Action = require('actions');

class PacketHandler {

  constructor(gameServer, socket) {
    this.gameServer = gameServer;
    this.socket = socket;
  }

  handleMessage(message) {
    if (!message || message.length === 0) {
      console.log("An empty message was received.");
      
      return;
    }
    
    const codec = BufferCodec(message);
    const code = codec.parse({ code: 'uint8' }, obj => obj.code);

    if (code in Action) {
      const action = new Action[code](this.gameServer, this.socket);
      const buffer = codec.getBuffer(true);

      action.execute(buffer);
    } else {
      console.error(`Operation '${OPCode.getName(code)}' does not cover any action.'`);
    }
  }

  _spawnPlayer(codec) {
    const playerName = codec.parse({
      name: { type: 'string', encoding: 'utf8' }
    }, obj => obj.name || '');
    
    this.socket.playerController.spawn(playerName);
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