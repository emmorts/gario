var Graph = (function () {
    
    var spin = 0;
    
    function Graph (canvas, options) {
        this._graph = canvas.getContext('2d');
        
        options = options || {};
        this._lineColor = options.lineColor || '#000000';
        this._globalAlpha = options.globalAlpha || 0.15;
        this._screenWidth = options.screenHeight || window.innerHeight;
        this._screenHeight = options.screenWidth || window.innerWidth;
        this._foodSides = options.virusSides || 10;
        this._virusSides = options.foodSides || 20;
        
        canvas.width = this._screenWidth;
        canvas.height = this._screenHeight;
        
        this._playerOptions = {
            border: 6,
            textColor: '#FFFFFF',
            textBorder: '#000000',
            textBorderSize: 3,
            defaultSize: 30
        };
        
        this._player = {
            id: -1,
            x: this._screenWidth / 2,
            y: this._screenHeight / 2,
            screenWidth: this._screenWidth,
            screenHeight: this._screenHeight,
            target: { x: this._screenWidth / 2, y: this._screenHeight / 2 }
        };
    }
    
    Graph.prototype.Clear = function () {
        this._graph.fillStyle = 'rgb(255, 255, 255)';
        this._graph.fillRect(0, 0, this._screenWidth, this._screenHeight);
        
        return this;
    }
    
    Graph.prototype.DrawGrid = function () {
        this._graph.lineWidth = 1;
        this._graph.strokeStyle = this._lineColor;
        this._graph.globalAlpha = this._globalAlpha;
        this._graph.beginPath();

        for (var x = xoffset - this._player.x; x < this._screenWidth; x += this._screenHeight / 18) {
            this._graph.moveTo(x, 0);
            this._graph.lineTo(x, this._screenHeight);
        }

        for (var y = yoffset - this._player.y ; y < this._screenHeight; y += this._screenHeight / 18) {
            this._graph.moveTo(0, y);
            this._graph.lineTo(this._screenWidth, y);
        }

        this._graph.stroke();
        this._graph.globalAlpha = 1;
        
        return this;
    }

    Graph.prototype.DrawCircle = function (centerX, centerY, radius, sides) {
        var theta = 0;
        var x = 0;
        var y = 0;

        this._graph.beginPath();

        for (var i = 0; i < sides; i++) {
            theta = (i / sides) * 2 * Math.PI;
            x = centerX + radius * Math.sin(theta);
            y = centerY + radius * Math.cos(theta);
            this._graph.lineTo(x, y);
        }

        this._graph.closePath();
        this._graph.stroke();
        this._graph.fill();
        
        return this;
    }

    Graph.prototype.DrawFood = function (food) {
        if (food) {
            if (food.constructor !== Array) {
                food = [ food ];
            }
            
            food.forEach(function (item) {
                this._graph.strokeStyle = 'hsl(' + food.hue + ', 100%, 45%)';
                this._graph.fillStyle = 'hsl(' + food.hue + ', 100%, 50%)';
                
                var centerX = food.x - this._player.x + this._screenWidth / 2;
                var centerY = food.y - this._player.y + this._screenHeight / 2;
                
                this.DrawCircle(centerX, centerY, food.radius, this._foodSides);
            });
        }
        
        return this;
    }

    Graph.prototype.DrawViruses = function (viruses) {
        if (viruses) {
            if (viruses.constructor !== Array) {
                viruses = [ viruses ];
            }
            
            viruses.forEach(function (virus) {
                this._graph.strokeStyle = virus.stroke;
                this._graph.fillStyle = virus.fill;
                this._graph.lineWidth = virus.strokeWidth;
                
                var centerX = virus.x - this._player.x + this._screenWidth / 2;
                var centerY = virus.y - this._player.y + this._screenHeight / 2;
                
                this.DrawCircle(centerX, centerY, virus.radius, this._virusSides);
            });
        }
        
        return this;
    }

    Graph.prototype.DrawFireFood = function (masses) {
        if (masses) {
            if (masses.constructor !== Array) {
                masses = [ masses ];
            }
            
            masses.forEach(function (mass) {
                this._graph.strokeStyle = 'hsl(' + mass.hue + ', 100%, 45%)';
                this._graph.fillStyle = 'hsl(' + mass.hue + ', 100%, 50%)';
                this._graph.lineWidth = this._playerOptions.border + 10;
                
                var centerX = mass.x - this._player.x + this._screenWidth / 2;
                var centerY = mass.y - this._player.y + this._screenHeight / 2;
                
                this.DrawCircle(centerX, centerY, mass.radius-5, 18 + (~~(mass.masa/5)));
            });
        }
        
        return this;
    }

    Graph.prototype.DrawPlayers = function (playerList, order) {
        var start = {
            x: this._player.x - (this._screenWidth / 2),
            y: this._player.y - (this._screenHeight / 2)
        };

        for (var z = 0; z < order.length; z++)
        {
            var currentPlayer = playerList[order[z].nCell];
            var currentCell = playerList[order[z].nCell].cells[order[z].nDiv];

            var x = 0;
            var y = 0;

            var points = 30 + ~~(currentCell.mass / 5);
            var increase = Math.PI * 2 / points;

            this._graph.strokeStyle = 'hsl(' + currentPlayer.hue + ', 100%, 45%)';
            this._graph.fillStyle = 'hsl(' + currentPlayer.hue + ', 100%, 50%)';
            this._graph.lineWidth = this._playerOptions.border;

            var xstore = [];
            var ystore = [];

            spin += 0.0;

            var circle = {
                x: currentCell.x - start.x,
                y: currentCell.y - start.y
            };

            for (var i = 0; i < points; i++) {

                x = currentCell.radius * Math.cos(spin) + circle.x;
                y = currentCell.radius * Math.sin(spin) + circle.y;
                if(typeof(currentPlayer.id) == "undefined") {
                    x = isValueInRange(-currentPlayer.x + this._screenWidth / 2, gameWidth - currentPlayer.x + this._screenWidth / 2, x);
                    y = isValueInRange(-currentPlayer.y + this._screenHeight / 2, gameHeight - currentPlayer.y + this._screenHeight / 2, y);
                } else {
                    x = isValueInRange(-currentCell.x - this._player.x + this._screenWidth/2 + (currentCell.radius/3), gameWidth - currentCell.x + gameWidth - this._player.x + this._screenWidth/2 - (currentCell.radius/3), x);
                    y = isValueInRange(-currentCell.y - this._player.y + this._screenHeight/2 + (currentCell.radius/3), gameHeight - currentCell.y + gameHeight - this._player.y + this._screenHeight/2 - (currentCell.radius/3) , y);
                }
                spin += increase;
                xstore[i] = x;
                ystore[i] = y;
            }
            /*if (wiggle >= this._player.radius/ 3) inc = -1;
            *if (wiggle <= this._player.radius / -3) inc = +1;
            *wiggle += inc;
            */
            for (i = 0; i < points; ++i) {
                if (i === 0) {
                    this._graph.beginPath();
                    this._graph.moveTo(xstore[i], ystore[i]);
                } else if (i > 0 && i < points - 1) {
                    this._graph.lineTo(xstore[i], ystore[i]);
                } else {
                    this._graph.lineTo(xstore[i], ystore[i]);
                    this._graph.lineTo(xstore[0], ystore[0]);
                }

            }
            this._graph.lineJoin = 'round';
            this._graph.lineCap = 'round';
            this._graph.fill();
            this._graph.stroke();
            var nameCell = "";
            if(typeof(currentPlayer.id) == "undefined")
                nameCell = this._player.name;
            else
                nameCell = currentPlayer.name;

            var fontSize = Math.max(currentCell.radius / 3, 12);
            this._graph.lineWidth = this._playerOptions.textBorderSize;
            this._graph.fillStyle = this._playerOptions.textColor;
            this._graph.strokeStyle = this._playerOptions.textBorder;
            this._graph.miterLimit = 1;
            this._graph.lineJoin = 'round';
            this._graph.textAlign = 'center';
            this._graph.textBaseline = 'middle';
            this._graph.font = 'bold ' + fontSize + 'px sans-serif';

            if (toggleMassState === 0) {
                this._graph.strokeText(nameCell, circle.x, circle.y);
                this._graph.fillText(nameCell, circle.x, circle.y);
            } else {
                this._graph.strokeText(nameCell, circle.x, circle.y);
                this._graph.fillText(nameCell, circle.x, circle.y);
                this._graph.font = 'bold ' + Math.max(fontSize / 3 * 2, 10) + 'px sans-serif';
                if (nameCell.length === 0) fontSize = 0;
                this._graph.strokeText(Math.round(currentCell.mass), circle.x, circle.y+fontSize);
                this._graph.fillText(Math.round(currentCell.mass), circle.x, circle.y+fontSize);
            }
        }
        
        return this;
    }
    
    function isValueInRange (min, max, value) {
        return Math.min(max, Math.max(min, value));
    }
    
    return Graph;
})();