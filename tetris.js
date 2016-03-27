function Block(x,y) {
  this.form = [
    [false,true,false],
    [true,true,true]
  ];
  this.height  = this.form.length;
  this.width = this.form[0].length;
  this.color = "red";
  this.firstRot = true;
  // note: xpos/ypos should be in 'game canvas' pixels, 
  // not global pixels
  this.xPos   = x;
  this.yPos   = y;
  
  // todo: don't draw here, but generate an array of rects to draw elsewhere
  this.draw = function(context, pixelSize) {
    var oldColor= context.fillStyle;
    context.fillStyle = this.color;
    
    for(var curY = 0; curY < this.height; curY++) {
      for(var curX = 0; curX < this.width; curX++) {
        if(this.form[curY][curX]) {
          var drawXPos = this.xPos + curX*pixelSize;
          var drawYPos = this.yPos + curY*pixelSize;
          context.fillRect(drawXPos,drawYPos,pixelSize,pixelSize);
        }
      }
    }
    
    context.fillStyle = oldColor;
  }

  this.rotate = function() {
    var oldForm = this.form;
    var newForm = null;
    newForm  = new Array(this.width);
    for(var curX = 0; curX < this.width; curX++) {
      newForm[curX] = new Array(this.height);
      for(var curY = 0; curY < this.height; curY++) { 
        if(this.firstRot) {     
          newForm[curX][curY] = oldForm[curY][curX];
          
        } else {
          newForm[curX][curY] = oldForm[curY][this.width-curX-1];

        }
      }
    }
    this.firstRot = !this.firstRot;  
    this.height  = newForm.length;
    this.width = newForm[0].length;
    this.form = newForm;
  }

}

function Tetris() {
  this.initialize = function() {
    this.height = 400;
    this.width  = 0.75 * this.height;
    this.lineThickness  = this.width/100;
    this.blockWidth     = this.width/25;
    this.curPiece       = null;
    this.count          = 0;

    this.gamePos               = new Object();
    this.gamePos.topLeft       = new Object();
    this.gamePos.bottomRight   = new Object();
    this.gamePos.topLeft.x     = this.width*(1/6);
    this.gamePos.topLeft.y     = 0;
    this.gamePos.bottomRight.x = this.width*(5/6);
    this.gamePos.bottomRight.y = this.height;

    this.fps      = 24;
    this.tickTime = 1000/this.fps;

    this.canvas         = document.getElementById("tetris");
    this.canvas.height  = this.height;
    this.canvas.width   = this.width;
    this.context        = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;

    this.started = false;
    document.addEventListener("keypress", this.inputHandler.bind(this));
  }

  this.inputHandler = function(e) {
    console.log(e);
    if(this.isUp(e)) {
      this.curPiece.rotate();
    } else if(this.isLeft(e)) {
      console.log(this.curPiece);
      this.curPiece.xPos -= this.blockWidth;
    } else if(this.isDown(e)) {
      
    } else if(this.isRight(e)) {
      this.curPiece.xPos += this.blockWidth;
    } else if(this.isStart(e)) {
      this.handleStart();
    }
    this.drawBackground();
    this.curPiece.draw(this.context,this.blockWidth);

  }

  this.isUp = function(e) {
    if(e.key === "w" || e.keyCode == 87) {
      return true;
    }
    return false;
  }

  this.isLeft = function(e) {
    if(e.key === "a" || e.keyCode == 65) {
      return true;
    }
    return false;
  }

  this.isDown = function(e) {
    if(e.key === "s" || e.keyCode == 83) {
      return true;
    }
    return false;
  }

  this.isRight = function(e) {
    if(e.key === "d" || e.keyCode == 68) {
      return true;
    }
    return false;
  }

  this.isStart = function(e) {
    if(e.key === " " || e.keyCode == 32) {
      return true;
    }
    return false;
  }

  this.handleStart = function() {
    if(this.started) {
      console.log("pausing");
      clearInterval(this.intervalID);
      this.started = false;
    } else {
      console.log("starting");
      this.intervalID = setInterval(this.gameLoop.bind(this), this.tickTime);
      this.started = true;
    }
  }

  this.gameLoop = function() {
    /*this.updatePiecePosition();
    this.detectCollisions(); 
    this.fixCollisions();
    this.removeLines();
    */
    if(null === this.curPiece) {
      this.curPiece = new Block(150,0);
    }
    this.drawBackground();
    this.curPiece.draw(this.context,this.blockWidth);
    if(this.count >= this.fps/4) {
      this.curPiece.yPos += this.blockWidth;
      this.count = 0;
    } 

    this.count++;
    //this.draw();

    console.log("tick!");
  }

  this.drawBackground = function() {
    
    this.fillRect(0, 0, this.canvas.width, this.canvas.height,"#000");

    //topLeftX, topLeftY, width, height
    this.fillRect(this.gamePos.topLeft.x - this.lineThickness-1, 0, this.lineThickness, this.height,"#fff");
    this.fillRect(this.gamePos.bottomRight.x + 1, 0, this.lineThickness, this.height,"#fff");

    //this.context.fillRect(0, 0, this.canvas.width/(3/4)+1, this.canvas.width/(4/5));

  }

  this.fillRect = function(xPos,yPos, width, height, color) {
    var oldColor = this.context.fillStyle;
    this.context.fillStyle = color;
    this.context.fillRect(Math.floor(xPos),Math.floor(yPos),width,height);
    this.context.fillStyle = oldColor;
  }
}

window.onload = function() {
  var tetris = new Tetris();
  tetris.initialize();
  tetris.drawBackground();

  console.log("initialized tetris");
}