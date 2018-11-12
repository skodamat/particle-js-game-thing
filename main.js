
// helper functions

function random(min,max) {
    let num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// classes

class Particle
{
    constructor ( posX, posY, velX, velY, color, size )
    {
        this.x = posX;
        this.y = posY;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw ()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fill();
    }

    checkBounds ()
    {
        if ( (this.x + this.size) >= viewWidth )
        {
            this.x -= 1;
            this.velX = -(this.velX)* 0.7;
        }

        if ( (this.x - this.size) <= 0 )
        {
            this.x += 1;
            this.velX = -(this.velX)* 0.7;
        }

        if ( (this.y + this.size) >= viewHeight )
        {
            this.y -= 1;
            this.velY = -(this.velY) * 0.7;
            this.velX *= 0.99;
        }

        if ( (this.y - this.size) <= 0 )
        {
            this.velY = -(this.velY);
        }
    }

    update ()
    {
        this.draw();
        this.checkBounds();

        this.size -= elapsedSec;

        this.x += this.velX * elapsedSec;
        this.y += elapsedSec * ( this.velY + elapsedSec * (9.8/2) );
        this.velY += elapsedSec * 9.8;
    }
}

class Shot
{
    constructor ( color, velX, velY )
    {
        this.x = viewWidth/2;
        this.y = viewHeight/2;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = 5;
        this.age = 0
    }

    draw ()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fill();
    }

    checkBounds ()
    {
        if ( (this.x + this.size) >= viewWidth )
        {
            this.x -= 1;
            this.velX = -(this.velX)* 0.7;
        }

        if ( (this.x - this.size) <= 0 )
        {
            this.x += 1;
            this.velX = -(this.velX) * 0.7;
        }

        if ( (this.y + this.size) >= viewHeight )
        {
            this.y -= 1;
            this.velY = -(this.velY) * 0.7;
            this.velX *= 0.99;
        }

        if ( (this.y - this.size) <= 0 )
        {
            this.velY = -(this.velY);
        }
    }

    update ()
    {
        this.draw();
        this.checkBounds();

        this.age += elapsedSec;

        this.x += this.velX * elapsedSec;
        this.y += elapsedSec * ( this.velY + elapsedSec * (9.8/2) );
        this.velY += elapsedSec * 9.8;
    }
}

"use strict";

// setup canvas

const canvas = document.querySelector('canvas');
const ctx    = canvas.getContext('2d');

const viewWidth  = canvas.width  = window.innerWidth;
const viewHeight = canvas.height = window.innerHeight;

var particles = [];
var shots = [];

// main loop

var now = 0;
var then = 0;
var elapsed = 0;
var elapsedSec = 0;
var timestamp = 0;

window.onclick = ( e ) => {
    let shot = new Shot( 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')', (e.x - (viewWidth/2)) * 2 + random(-80, 80), (e.y - (viewHeight/2)) * 2 + random(-80, 80));
    shots.push( shot );
}

function startAnimating() {
    then = window.performance.now();
    loop();
}

function loop( timestamp ) 
{
    requestAnimationFrame( loop );

    if ( timestamp ) {
        now = timestamp;
    }
    elapsed = now - then;
    elapsedSec = elapsed / 1000;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    ctx.font = '90px Helvetica';
    ctx.fillStyle = "rgba(20, 20, 20, 0.2)";
    ctx.fillText( 'click', 500, 470 );

    for (let j = 0; j < shots.length; j++) {
        shots[j].update();

        if( shots[j].age > 0.5 )
        {
            for (let k = 0; k < 20; k++)
            {
                let size = random(2,5);
                let particle = new Particle(
                                            shots[j].x,
                                            shots[j].y,
                                            shots[j].velX + random(-shots[j].velX /2, shots[j].velX /2),
                                            shots[j].velY + random(-shots[j].velX /2, shots[j].velX /2),
                                            'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
                                            size );
                particles.push(particle);
            }

            shots.splice(j, 1);
        }
    }

    for (let i = 0; i < particles.length; i++) {

        particles[i].update();

        if( particles[i].size < 0 )
        {
            particles.splice(i, 1);
        }
    }

    

    then = now;
}

startAnimating(60);