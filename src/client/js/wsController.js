var WSController = (function () {
    
    function WSController (options) {
        options = options || {};
        this._uri = options.uri || 'ws://localhost:3000';
        
        this._socket = setupSocket();
    }
    
    function setupSocket() {
        this._socket = new WebSocket(this._uri);
        this._socket.binaryType = 'arraybuffer';
        
        this._socket.onopen = function (event) {
            console.log("WebSocket is now open");
            
            this._socket.onmessage = function (event) {
                console.log(event);
            }
        }
    }
    
    return WSController;
    
})();