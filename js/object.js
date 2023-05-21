var Sprite = function(SourceX, SourceY, width, height, x, y){
    this.SourceX = SourceX;
    this.SourceY = SourceY;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.loop = false;
    this.numberOfFrames = 1;
    this.ticksPerFrame = 0;
    this.tickCount = 0;
    this.frameIndex = 0;
    this.gravity = 0;
    this.vx = 0;
    this.vy = 0;
}

Sprite.prototype.loopSprite = function () {
    this.tickCount++;
    if(this.loop && this.tickCount > this.ticksPerFrame){
        this.tickCount = 0;
        if(this.frameIndex < this.numberOfFrames-1){
            this.frameIndex++;
        }else if(this.loop){
            this.frameIndex = 0;
        }
    }
}

Sprite.prototype.move = function () {
    this.x += this.vx;
    this.y += this.vy;
}

Sprite.prototype.centerX = function () {
    var centerX = (this.numberOfFrames > 1) ? this.x+((this.width/this.numberOfFrames)/2) : this.x+(this.width/2);
    return centerX;
}

Sprite.prototype.centerY = function () {
    return this.y+(this.height/2);
}

Sprite.prototype.halfWidth = function () {
    var halfWidth = (this.numberOfFrames > 1) ? (this.width/this.numberOfFrames)/2 : this.width/2;
    return halfWidth;
}

Sprite.prototype.halfHeight = function () {
    return this.height/2;
}

export { Sprite };