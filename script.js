let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// getting bird element properties
let bird_props = bird.getBoundingClientRect();

// This method returns DOMReact -> top, right, bottom, left, x, y, width and height
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.id('gameCanvas');  // Assign an id to the canvas
    bird = new Bird();
    obstacles.push(new Obstacle());
    buttonWidth = 200;
    buttonHeight = 50;
    buttonX = width / 2 - buttonWidth / 2;
    buttonY = height / 2 - buttonHeight / 2;
    cnv.touchStarted(handleTouch);
}

function draw() {
    // Draw the background image
    image(backgroundImage, 0, 0, width, height);

    bird.update();
    bird.show();

    if (!gameOver) {
        if (frameCount % 100 == 0) {
            obstacles.push(new Obstacle());
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].show();
            obstacles[i].update();

            if (obstacles[i].hits(bird)) {
                console.log("HIT");
                gameOver = true;
                gameOverSound.play();  // Play game over sound
            }

            if (obstacles[i].offscreen()) {
                obstacles.splice(i, 1);
            }
        }
    } else {
        fill(255);
        textSize(25);
        textAlign(CENTER, CENTER);
        text("WE ARE VERY LOW OVER THE FOREST NOW.", width / 2, height / 4);
        // Draw the restart button
        fill(200);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        fill(0);
        textSize(19);
        text("Fly Fast!!", width / 2, height / 2)
 
    }
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);  // Center align text
    text("Score: " + score, width / 2, 50);  // Position at center of screen

    textSize(15); // Make the following texts smaller
    text("Divya", width / 2, 75); // Place the text below the score
    text("#pepperprogramming", width / 2, 100); // Place the text below "Divya"

    image(baseImg, 0, height - baseImg.height * 0.75, width, baseImg.height * 0.75);
  // Draw the base image at the bottom of the screen

}

function keyPressed() {
    if (key == ' ') {
        bird.up();
    }
}

function handleTouch() {
    // Handle touch event on mobile
    if (!gameOver) {
        bird.up();
    } else {
        // Check if the touch is within the bounds of the restart button
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
            restartGame();
        }
    }
}


function mousePressed() {
    // Check if the mouse click is within the bounds of the button
    if (gameOver && mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        // Restart the game
        bird = new Bird();
        obstacles = [];
        score = 0;
        gameOver = false;

        // Play start sound
        startSound.play();
    }
}

function Bird() {
    this.y = height / 2;
    this.x = 64;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;

    this.show = function() {
        image(birdImg, this.x, this.y, 32, 32);
    }

    this.up = function() {
        this.velocity = this.lift; 
    }

    this.update = function() {
        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;

        if (this.y > height - baseImg.height - birdImg.height / 2) {
            this.y = height - baseImg.height - birdImg.height / 2;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
}

function Obstacle() {
    this.top = random(height / 2);
    this.bottom = random(height / 2);
    this.x = width;
    this.w = 50;
    this.speed = 2;

    this.hits = function(bird) {
        if (bird.y - birdImg.height / 2 < this.top || bird.y + birdImg.height / 2 > height - this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.w) {
                return true;
            }
        }
        return false;
    }

    this.show = function() {
        image(obstacleTopImg, this.x, 0, this.w, this.top);
        image(obstacleBottomImg, this.x, height - this.bottom, this.w, this.bottom);
    }

    this.update = function() {
        this.x -= this.speed;
    }

    this.offscreen = function() {
        if (this.x < -this.w) {
            score++;
            passSound.play();  // Play pass sound
            return true;
        } else {
            return false;
        }
    }
}