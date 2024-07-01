const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d')
const scoreContainer = document.querySelector('.score');
const livesContainer = document.querySelector('.lives');
const levelContainer = document.querySelector('.level');
const gameRules = document.querySelector('.pre-game');
const startPlaying = document.querySelector('.pre-game button')
startPlaying.addEventListener('click', function() {
    gameRules.style.display = 'none';
});

canvas.width = 600
canvas.height = 300

// create mario image
const mario = new Image();
mario.src = 'images/mario.png';
mario.onload = () => {
    ctx.drawImage(mario, 50, 50, 30, 30);
}

const gameOver = new Image();
gameOver.src = 'images/game-over.jpg';

// add movement to mario
let marioX = 30;
let marioY = 30;
const size = 30;

// score
let score;
score = localStorage.getItem('score') !== null ? parseInt(localStorage.getItem('score')) : 0;
//lives
let lives;
lives = localStorage.getItem('lives') !== null ? parseInt(localStorage.getItem('lives')) : 5;

// level
let level;
level = localStorage.getItem('level') !== null ? parseInt(localStorage.getItem('level')) : 1;


//addwalls
let walls = [];

//add obstacles
let obstacles = [];

// add enemies
let enemies = [];

// add treasures
let treasures = [];

// walls, obstacles, enemies and treasures
function addSquares(squares) {
    const maxAttempts = 100;
    let attempts = 0;
    let added = false;
    while (attempts < maxAttempts && !added) {
        let tX = Math.abs(Math.floor(Math.random() * (canvas.width - 1)));
        let tY = Math.abs(Math.floor(Math.random() * (canvas.height - 1)));
        if ((tX % 60 == 0 && tY % 30 == 0) && !checkCollision(tX, tY, walls) &&
            !checkCollision(tX, tY, enemies) && !checkCollision(tX, tY, obstacles) &&
            !checkCollision(tX, tY, treasures)) {
                squares.push({x: tX, y: tY});
                added = true;
        }
        attempts += 1;
    }
    if (!added) {
        console.log('Failed to add a new square after maximum attempts');
    }
}

// add obstacle
let levelSquares;
levelSquares = level > 1 ? level : 0;
while (obstacles.length < (5 + levelSquares)) addSquares(obstacles)
    
// add enemies
while (enemies.length < (3 + levelSquares)) addSquares(enemies)

// add walls
while (walls.length < (20 + levelSquares * 2)) addSquares(walls)

// add initial treasure
while (treasures.length != 1) addSquares(treasures)


// draw a square
function drawSquares(squares, color) {
    ctx.fillStyle = color;
    squares.forEach(square => {
        ctx.fillRect(square.x, square.y, size, size);
    });
}

// check collision
function checkCollision(x, y, squares) {
    for (let square of squares) {
        if (x < square.x + size &&
            x + size > square.x &&
            y < square.y + size &&
            y + size > square.y
        ) {
            return true;
        }
    }
    return false;
}

function checkBorder() {
    if (marioX < 0) marioX = 30;
    if (marioY < 0) marioY = 30;
    if (marioX > canvas.width - 30) marioX = canvas.width - 30;
    if (marioY > canvas.height - 30) marioY = canvas.height - 30;
}

// Interacting with Treasures and Obstacles
function removeSquare(squares, x, y) {
    let newSquares = squares.filter(square => !(x < square.x + size &&
        x + size > square.x &&
        y < square.y + size &&
        y + size > square.y
    ));
    return newSquares;
}

function checkTreasure(x, y) {
    if (checkCollision(x, y, treasures)) {
        score += 1;
        scoreContainer.textContent = localStorage.getItem('score');
        if (score >= 10 && score % 10 === 0 && score % level === 0) {
            levelUp();
        }
        treasures.length = 0;
        while (treasures.length != 1) addSquares(treasures);
    }
}

function checkObstacle(x, y) {
    if (checkCollision(x, y, obstacles)) {
        score -= 1;
        obstacles = removeSquare(obstacles, x, y);
    }
}

// check enemy
function checkEnemy(x, y) {
    if (checkCollision(x, y, enemies)) {
        lives -= 1;
        livesContainer.textContent = localStorage.getItem('lives');
        marioX = 30;
        marioY = 30;
        enemies = removeSquare(enemies, x, y);
    }
}

// level up function
function levelUp() {
    level += 1;
    levelContainer.textContent = localStorage.getItem('level');
    for (let i = 0; i < level;) {
        let tX = Math.abs(Math.floor(Math.random() * (canvas.width - 1)));
        let tY = Math.abs(Math.floor(Math.random() * (canvas.height - 1)));
        if ((tX % 60 == 0 && tY % 30 == 0) && !checkCollision(tX, tY, walls) &&
            !checkCollision(tX, tY, enemies) && !checkCollision(tX, tY, obstacles) &&
            !checkCollision(tX, tY, treasures)) {
                obstacles.push({x: tX, y: tY});
                i++;
        }
    }
    for (let i = 0; i < level + 2;) {
        let tX = Math.abs(Math.floor(Math.random() * (canvas.width - 1)));
        let tY = Math.abs(Math.floor(Math.random() * (canvas.height - 1)));
        if ((tX % 60 == 0 && tY % 30 == 0) && !checkCollision(tX, tY, walls) &&
            !checkCollision(tX, tY, enemies) && !checkCollision(tX, tY, obstacles) &&
            !checkCollision(tX, tY, treasures)) {
                walls.push({x: tX, y: tY});
                i++;
        }
    }
    for (let i = 0; i < level;) {
        let tX = Math.abs(Math.floor(Math.random() * (canvas.width - 1)));
        let tY = Math.abs(Math.floor(Math.random() * (canvas.height - 1)));
        if ((tX % 60 == 0 && tY % 30 == 0) && !checkCollision(tX, tY, walls) &&
            !checkCollision(tX, tY, enemies) && !checkCollision(tX, tY, obstacles) &&
            !checkCollision(tX, tY, treasures)) {
                enemies.push({x: tX, y: tY});
                i++;
        }
    }
}

// change direction when play with mobile
function clickBtn() {
    if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        document.querySelector('.move-mobile').style.display = 'block';
        const btns = Array.from(document.querySelectorAll('.move-mobile button'));
        btns.forEach(btn => {
            btn.addEventListener('touchend', function(e) {
                let code = this.dataset.move;
                let nextX = marioX;
                let nextY = marioY;
                if (code === 'ArrowLeft') nextX -= marioSpeed;
                if (code === 'ArrowRight') nextX += marioSpeed;
                if (code === 'ArrowUp') nextY -= marioSpeed;
                if (code === 'ArrowDown') nextY += marioSpeed;
                if (!checkCollision(nextX, nextY, walls)) {
                    marioX = nextX;
                    marioY = nextY;
                    checkBorder();
                    checkTreasure(nextX, nextY);
                    checkObstacle(nextX, nextY);
                    checkEnemy(nextX, nextY);
                }
            })
        })
    } else {
        document.querySelector('.move-mobile').style.display = 'none';
        return;
    }
}

// Update local storge
function updateStorage() {
    localStorage.setItem('level', level);
    localStorage.setItem('score', score);
    localStorage.setItem('lives', lives);
    scoreContainer.textContent = localStorage.getItem('score');
    livesContainer.textContent = localStorage.getItem('lives');
    levelContainer.textContent = localStorage.getItem('level');
}

// add click event to keyboard
let normalSpeed = 3;
let highSpeed = 6;
let marioSpeed = normalSpeed;
document.addEventListener('keydown', function(event) {
    if (event.key === 's') {
        marioSpeed = highSpeed;
    }
});
document.addEventListener('keyup', function(event) {
    if (event.key === 's') {
        marioSpeed = normalSpeed;
    }
});
document.addEventListener('keydown', (event) => {
    let nextX = marioX;
    let nextY = marioY;
    if (event.key === 'ArrowLeft') nextX -= marioSpeed;
    if (event.key === 'ArrowRight') nextX += marioSpeed;
    if (event.key === 'ArrowUp') nextY -= marioSpeed;
    if (event.key === 'ArrowDown') nextY += marioSpeed;

    if (!checkCollision(nextX, nextY, walls)) {
        marioX = nextX;
        marioY = nextY;
        checkBorder();
        checkTreasure(nextX, nextY);
        checkObstacle(nextX, nextY);
        checkEnemy(nextX, nextY);
    }
});

// game loop
function gameLoop() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawSquares(walls, 'grey');
    drawSquares(treasures, 'yellow');
    drawSquares(obstacles, 'red');
    drawSquares(enemies, 'black');
    updateStorage();

    // draw mario
    ctx.drawImage(mario, marioX, marioY, 30, 30);

    // stop game when mario lives is 0
    if (lives === 0 || level > 10) {
        localStorage.removeItem('lives')
        localStorage.removeItem('score')
        localStorage.removeItem('level')
        clearInterval(game);
        gameRules.style.display = 'flex';
        startPlaying.textContent = 'Replay';
        startPlaying.previousElementSibling.textContent = `Finale Score: ${score}\nFinale Level: ${level}`;
    }

    // requestAnimationFrame(gameLoop);
}

let game = setInterval(gameLoop, 100);
clickBtn();
// mario.onload = gameLoop;
