import { collide } from './collision.js';
import { Sprite } from './object.js';
import { instructions, finalMessage, proposal } from './instructions.js';

var Game = function () {

    this.canvas = document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.energy = 100;
    this.strength = 100;
    this.hugoLoveLevel = 0;

    this.energyEl = document.querySelector("#energyLevel .indicator");
    this.strengthEl = document.querySelector("#strengthLevel .indicator");
    this.hugoLoveEl = document.querySelector("#loveHugo .indicator");

    this.sprites = [];
    this.dumbels = [];
    this.coffees = [];
    this.dumbelCounter = 0;
    this.coffeeCounter = 0;
    this.timerdumbel = 300;
    this.timerCoffee = 200;

    this.hugoCounter = 0;
    this.timerHugo = 400;

    this.mainImage = new Image();
    this.mainImage.src = "img/sprite.png";
    this.mainImage.addEventListener('load', () => {});

    this.spaceIsDown = false;
    this.moveIsDown = false;
    this.allowJumps = 1;

    this.hugo = new Sprite(514, 0, 324, 101, 100, 0);
    this.hugo.numberOfFrames = 4;
    this.hugo.frameIndex = 3;
    this.hugo.ticksPerFrame = 10;
    this.hugo.loop = true;
    this.hugo.vx = 1;
    this.hugo.gravity = 1;
    this.sprites.push(this.hugo);
    
    this.gabi = new Sprite(0, 0, 257, 92, 0, 0);
    this.gabi.numberOfFrames = 4;
    this.gabi.frameIndex = 3;
    this.gabi.ticksPerFrame = 5;
    this.gabi.loop = false;
    this.gabi.gravity = 1;
    this.sprites.push(this.gabi);

    this.PAUSED = 0;
    this.PLAYING = 1;
    this.OVER = 2;
    this.STATE = this.PLAYING;
    
    this.loop = function () {
        if(this.STATE == this.OVER) return;
        window.requestAnimationFrame(this.loop.bind(this), this.canvas);
        switch (this.STATE){
            case this.PAUSED:
                break;
            case this.PLAYING:
                this.update();
                break;
            case this.OVER:
                this.gameOver();
                break;
        }
        this.render();
    }

    this.update = function () {
        this.gabi.loopSprite();
        this.gabi.move();

        if(this.gabi.y < (this.canvas.height-(this.gabi.height+72))){
            this.gabi.vy += this.gabi.gravity;
        }else{
            this.gabi.vy = 0;
            this.allowJumps = 1;
        }
        this.gabi.x = Math.max(0, Math.min(this.canvas.width-(this.gabi.width/this.gabi.numberOfFrames), this.gabi.x+this.gabi.vx) );
        this.gabi.y = Math.max(0, Math.min(this.canvas.height-(this.gabi.height+72), this.gabi.y+this.gabi.vy) );

        this.hugo.loopSprite();
        this.hugo.move();
        
        if(this.hugo.y < (this.canvas.height-(this.hugo.height+70))){
            this.hugo.vy += this.hugo.gravity;
        }else{
            this.hugo.vy = 0;
        }
        this.hugo.x = Math.max(-((this.hugo.width/this.hugo.numberOfFrames)+1), Math.min(this.canvas.width+1, this.hugo.x+this.hugo.vx) );
        this.hugo.y = Math.max(0, Math.min(this.canvas.height-(this.hugo.height+70), this.hugo.y+this.hugo.vy) );


        this.dumbelCounter++;
        if(this.dumbelCounter == this.timerdumbel){
            this.generateDumbel();
            this.dumbelCounter = 0;
        }

        this.hugoCounter++;
        if(this.hugoCounter == this.timerHugo){
            this.toggleHugoDirection();
            this.hugoCounter = 0;
            this.timerHugo = 300 + Math.floor(Math.random() * 500);
        }

        if(collide(this.hugo, this.gabi)){
            this.strength = Math.max(0, this.strength - 0.3);
            this.hugoLoveLevel = Math.min(100, this.hugoLoveLevel + 0.1);

            this.coffeeCounter++;
            if(this.coffeeCounter == this.timerCoffee){
                this.generateCoffee();
                this.coffeeCounter = 0;
            }

        }

        if(this.gabi.vx !== 0 && this.energy > 0.5){
            this.energy = Math.max(0, this.energy - 0.5); 
        }

        if(this.energy < 0.5){
            this.gabi.vx = 0;
            this.gabi.loop = false;
        }

        if(!this.moveIsDown){
            this.energy = Math.min(100, this.energy + 0.1); 
        }

        for(var i in this.dumbels){
            var dumbel = this.dumbels[i];
            dumbel.move();
            dumbel.loopSprite();
            if(dumbel.y >= (this.canvas.height-89)){
                this.removeObject(this.dumbels, dumbel);
                this.removeObject(this.sprites, dumbel);
                i--;
            }

            if(collide(dumbel, this.gabi)){
                this.removeObject(this.dumbels, dumbel);
                this.removeObject(this.sprites, dumbel);
                this.updateStrength(15);
                i--;
            }
        }
        
        for(var i in this.coffees){
            var coffee = this.coffees[i];
            coffee.move();
            coffee.loopSprite();

            if(coffee.y <= (this.canvas.height-89)){
                coffee.vy += coffee.gravity
            }
            if(coffee.y > (this.canvas.height-100)){
                coffee.vy = 0;
                coffee.vx = 0;
            }

            if(collide(coffee, this.gabi)){
                this.removeObject(this.coffees, coffee);
                this.removeObject(this.sprites, coffee);
                this.updateEnergy(40);
                i--;
            }
        }
        
        this.energyEl.style.width = `${(this.energy*146)/100}px`;
        this.strengthEl.style.width = `${(this.strength*146)/100}px`;
        this.hugoLoveEl.style.height = `${(this.hugoLoveLevel*219)/100}px`;

        if(this.strength == 0){
            this.gameOver();
        }

        if(this.hugoLoveLevel == 100){
            this.winGame();
        }

    }

    this.gameOver = function(){
        console.log(`AAAA`);
        this.STATE = this.OVER;
        showSection('game-over');
    }

    this.winGame = async function(){
        this.STATE = this.OVER;
        showSection('won');

        for(let j = 0; j < finalMessage.length; j++){
            const typed = await typeWriter('won', finalMessage[j], 100);
        }
        let p = document.createElement('p');
        p.setAttribute('id', 'finalProposal');
        document.getElementById('won').appendChild(p);
        typeWriter('finalProposal', proposal, 100);

    }


    this.toggleHugoDirection = function(){
        this.hugo.vx *= -1;
        this.hugo.SourceX = this.hugo.vx > 0 ? 514 : 837;
    }

    this.render = function () {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        if(this.sprites.length > 0){
            for (var i in this.sprites){
                var sprite = this.sprites[i];
                if(sprite.numberOfFrames == 1){
                    this.ctx.drawImage(this.mainImage, sprite.SourceX, sprite.SourceY, sprite.width, sprite.height, Math.floor(sprite.x), Math.floor(sprite.y), sprite.width, sprite.height);
                }else{
                    this.ctx.drawImage(this.mainImage, sprite.SourceX+sprite.frameIndex*(sprite.width/sprite.numberOfFrames), sprite.SourceY, (sprite.width/sprite.numberOfFrames), sprite.height, Math.floor(sprite.x), Math.floor(sprite.y), (sprite.width/sprite.numberOfFrames), sprite.height)
                }
            }
        }
    }

    this.removeObject = function (array, item) {
        var index = array.indexOf(item);
        if(index != -1){
            array.splice(index, 1);
        }
    }

    this.generateDumbel = function () {
        var posDumbel = Math.floor(Math.random()*15)*40
        var dumbel = new Sprite(1161, 0, 40, 28, posDumbel, -28);
        dumbel.numberOfFrames = 1;
        dumbel.ticksPerFrame = 1;
        dumbel.vy = 5;
        dumbel.loop = false;
        this.dumbels.push(dumbel);
        this.sprites.push(dumbel);
    }

    this.generateCoffee = function () {
        var posCoffee = this.hugo.x+26;
        var coffee = new Sprite(1202, 0, 28, 22, posCoffee, this.hugo.y - 24);
        coffee.numberOfFrames = 1;
        coffee.ticksPerFrame = 1;
        coffee.vy = -10;
        coffee.vx = this.hugo.vx * -1.5;
        coffee.gravity = 1;
        coffee.loop = false;
        this.coffees.push(coffee);
        this.sprites.push(coffee);
    }

    this.updateStrength = function (value) {
        this.strength = Math.min(100, this.strength+value);
    }

    this.updateEnergy = function (value) {
        this.energy = Math.min(100, this.energy+value);
    }

}


document.addEventListener("keydown", function (ev) {
    switch (ev.keyCode){
        case 37:
            if(!game.moveIsDown){
                if(game.energy > 0.5){
                    game.gabi.SourceX = 255;
                    game.gabi.vx = -4;
                    game.gabi.loop = true;
                }
                game.moveIsDown = true;
            }
            break;
        case 39:
            if(!game.moveIsDown){
                if(game.energy > 0.5){         
                    game.gabi.SourceX = 0;
                    game.gabi.vx = 4;
                    game.gabi.loop = true;
                }
                game.moveIsDown = true;
            }
            break;
        case 32:
            if(!game.spaceIsDown){
                if(game.allowJumps > 0 && game.energy >= 5){
                    game.gabi.vy = -15;
                    game.energy -= 5;
                    game.allowJumps--;
                }
                game.spaceIsDown = true;
            }
            break;
    }
}, false)

document.addEventListener("keyup", function (ev) {
    switch (ev.keyCode){
        case 37:
            game.moveIsDown = false;
            game.gabi.vx = 0;
            game.gabi.frameIndex = 0;
            game.gabi.loop = false;
            break;
        case 39:
            game.moveIsDown = false;
            game.gabi.vx = 0;
            game.gabi.frameIndex = 3;
            game.gabi.loop = false;
            break;
        case 32:
            game.spaceIsDown = false;
            break;
        case 82:
            hideSections();
            restartGame();
            break;
    }
}, false);
let currentInstruction = 0;
document.querySelectorAll('.btn.btn-action').forEach(btn => {
    btn.addEventListener('click', function(ev) {
        switch (ev.target.id){
            case 'btn-start':
                hideSections();
                game.loop();
                break;
            case 'btn-start-game':
                hideSections();
                game.loop();               
                break;
            case 'btn-instructions':
                showSection('instructions-block');
                setTimeout(() => {
                    startInstructions(currentInstruction);
                }, 500)
                break;
            case 'btn-next-instruction':
                startInstructions(++currentInstruction);
                break;
        }
    });
});

var game = new Game();

// game.loop(); 

function restartGame(){
    game = new Game;
    game.loop();
}

export { Game }

async function startInstructions(instructionIndex = 0){
    document.getElementById('btn-start-game').style.display = 'none';
    document.getElementById('btn-next-instruction').style.display = 'none';
    document.getElementById('instructions').innerHTML = "";
    
    for(let j = 0; j < instructions[instructionIndex].length; j++){
        const typed = await typeWriter('instructions', instructions[instructionIndex][j], 20);
    }

    if(instructionIndex == instructions.length-1){
        document.getElementById('btn-start-game').style.display = 'block';
        document.getElementById('btn-next-instruction').style.display = 'none';
    }else{
        document.getElementById('btn-next-instruction').style.display = 'block';
    }
}

function hideSections(){
    document.querySelectorAll('.sections > *').forEach(el => {
        el.style.display = "none";
    })
}

function showSection(sectionId){
    hideSections();
    document.getElementById(sectionId).style.display = 'flex';
}

function typeWriter(elemmId, txt, speed = 50, i = 0) {
    return new Promise((resolve) => {
        const type = (elemmId, txt, speed, i) => {
            if (i < txt.length) {
                if(txt.charAt(i) == '<'){
                    const tag = getTagFromString(txt, i);
                    console.log(tag);
                    document.getElementById(elemmId).innerHTML += tag.str;
                    i = tag.endIndex+2;
                }else{
                    document.getElementById(elemmId).innerHTML += txt.charAt(i);
                    i++;
                }
                setTimeout(() => type(elemmId, txt, speed, i), speed);
            }else{
                document.getElementById(elemmId).innerHTML += "<br><br>";
                resolve(true);
            }
        }
        type(elemmId, txt, speed, i);
    });
}

function getTagFromString(str, indexStartTag){
    let finalIndexTag = -1;
    for(let i=indexStartTag; i <= str.length; i++){
        if(str.charAt(i) == '>'){
            finalIndexTag = i;
            break;
        }
    }
    return { str: /<(.*?)>/g.exec(str.substr(indexStartTag, finalIndexTag))[0], endIndex: finalIndexTag }
}

hideSections();
showSection('start');
