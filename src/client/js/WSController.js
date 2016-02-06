var BufferCodec = require('buffercodec');
var OPCode = require('../../opCode');

import EventEmitter from './util/EventEmitter';
import * as Packets from './packets/index';

export default class WSController extends EventEmitter {
  constructor() {
    super();
    
    this._uri = 'ws://192.168.2.116:3000';
    this._socket = null;

    this._setupSocket();
  }
  
  spawn(playerName) {
    var buffer = BufferCodec()
      .uint8(OPCode.SPAWN_PLAYER)
      .uint8(playerName.length)
      .string(playerName)
      .result();
      
    this._socket.send(buffer);
  }
  
  move(player) {
    var buffer = BufferCodec()
      .uint8(OPCode.PLAYER_MOVE)
      .uint16le(player.target.x)
      .uint16le(player.target.y)
      .result();

    this._socket.send(buffer);
  }
  
  cast(opcode, options) {
    var buffer = BufferCodec()
      .uint8(opcode)
      .uint16le(options.playerX)
      .uint16le(options.playerY)
      .uint16le(options.x)
      .uint16le(options.y)
      .result();

    this._socket.send(buffer);
  }
  
  _setupSocket() {
    this._socket = new WebSocket(this._uri);
    this._socket.binaryType = 'arraybuffer';

    this._socket.onopen = function onConnectionEstablished(event) {
      this._fire('open');

      this._socket.onmessage = function handleMessage(message) {
        var codec = BufferCodec(message.data);
        var code = this._getOpCode(codec);

        switch (code) {
          case OPCode.ADD_PLAYER:
            this._fire('addPlayer', this._parse(codec, Packets.AddPlayer));
            break;
          case OPCode.UPDATE_PLAYERS:
            this._fire('updatePlayers', this._parse(codec, Packets.UpdatePlayers));
            break;
          case OPCode.UPDATE_SPELLS:
            this._fire('updateSpells', this._parse(codec, Packets.UpdateSpells));
            break;
          default:
            console.warn("Undefined opcode");
            break;
        }
      }.bind(this)
    }.bind(this)
  }
  
  _parse(codec, packet) {
    return codec.parse(packet.mapping, packet.transform);
  }
  
  _getOpCode(codec) {
    return codec.parse({ code: 'uint8' }, obj => obj.code);
  }
}