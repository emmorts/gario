var BufferCodec = (function () {
  
  function BufferCodec(buffer) {
    if (!(this instanceof BufferCodec)) {
      return new BufferCodec(buffer);
    }
    
    this.offset = 0;
    this.jobs = [];
    
    if (buffer) {
      if (buffer instanceof ArrayBuffer && buffer.byteLength > 0) {
        this.buffer = buffer;
      } else {
        console.warn("Received malformed data");
      }
    }
  }
  
  BufferCodec.prototype.getOpcode = function () {
    this.offset++;
    return new Uint8Array(this.buffer)[0];
  }
  
  BufferCodec.prototype.setOpcode = function (opcode) {
    var array = new Uint8Array(1);
    array[0] = opcode;
    return array.buffer;
  }
  
  BufferCodec.prototype.string = function (value) {
    var buffer = new ArrayBuffer(value.length * 2);
    var bufferView = new Uint16Array(buffer);
    for (var i = 0, strLen = value.length; i < strLen; i++) {
      bufferView[i] = value.charCodeAt(i);
    }
    return buffer;
  }
  
  BufferCodec.prototype.parse = function (template) {    
    if (this.buffer && template.length > 0) {
      var data = new DataView(this.buffer);
      var result = {};
      
      if (template.constructor === Array) {
        template.forEach(function (element) {
          parseItem(element, result)
        }, this);
      } else {
        parseItem(template, result);
      }
      
      return result;
    }
    
    function parseArray(data, template) {
      var result = [];
      
      var length = data.getUint8(this.offset++);
      if (length > 0) {
        for (var i = 0; i < length; i++) {
          result.push(this.parse(template));
        }
      }
      
      return result;
    }
    
    function parseItem(element) {
      var templateResult;
      switch (element.type) {
        case 'uint8':
          templateResult = data.getUint8(this.offset);
          this.offset += 1;
          break;
        case 'uint16le':
          templateResult = data.getUint16(this.offset, true);
          this.offset += 2;
          break;
        case 'floatle':
          templateResult = data.getFloat32(this.offset, true);
          this.offset += 4;
          break;
        case 'string':
          var utf16 = new ArrayBuffer(element.length * 2);
          var utf16view = new Uint16Array(utf16);
          for (var i = 0; i < element.length; i++, this.offset += 1) {
            utf16view[i] = data.getUint8(this.offset);
          }
          templateResult = String.fromCharCode.apply(null, utf16view);
          break;
        case 'array':
          templateResult = parseArray.call(this, data, element.itemTemplate);
          break;
      }
      
      if (element.name) {
        result[element.name] = templateResult;
      } else {
        result = templateResult;
      }
    }
  }
  
  return BufferCodec;
  
})();

if (typeof window === 'undefined') {
  module.exports = BufferCodec;
}