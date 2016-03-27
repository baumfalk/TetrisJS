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