// HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');

// Game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = retrieveHighScore();
let direction = 'right';
let gameStarted = false;
let gameInterval;
let gameSpeedDelay = 200;


// Audio, soundeffects
const audio = new Audio("music/walen - Gameboy (freetouse.com).mp3");
const gameOverSound = new Audio("music/mixkit-arcade-retro-game-over-213.wav")
const foodEatSound = new Audio("music/mixkit-player-jumping-in-a-video-game-2043.mp3")

function retrieveHighScore() {
    let highestScore = localStorage.getItem('snakeHighScore') || 0;
    highScoreText.textContent = highestScore.toString().padStart(3, '0');
    highScoreText.style.display = 'block'; 
    return highestScore;
}


// Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create a Snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element
}

// Set position of snake of food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


// Draw food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

// Moving the snake
function move(){
    const head = { ...snake[0] };
    let newDirection;
    switch(direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;  
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;

    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y){
        foodEatSound.play();
        food = generateFood();
        increaseSpeed();
        updateScore();
        clearInterval(gameInterval); //clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw(); 
        }, gameSpeedDelay); //the speed increases with progress
    } else {
        snake.pop()
    }
}


function startGame() {
    gameStarted = true; //keep track of running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
    playAudio();
}

// key press event listener
function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ') //so every browser handle this
    ) {
        startGame();
    } else {
        let newDirection;

        switch (event.key) {
            case 'ArrowUp':
                newDirection = 'up';
                break;
            case 'ArrowDown':
                newDirection = 'down';
                break;
            case 'ArrowLeft':
                newDirection = 'left';
                break;  
            case 'ArrowRight':
                newDirection = 'right';
                break;
            default:
                return; // Exit the function for other keys
        }

        if (!isOppositeDirection(newDirection, direction)) {
            // Only update the direction if it's not opposite to the current direction
            direction = newDirection;
        }
    }
}

// Function to check if the new direction is opposite to the current direction
function isOppositeDirection(newDirection, currentDirection) {
    return (
        (newDirection === 'up' && currentDirection === 'down') ||
        (newDirection === 'down' && currentDirection === 'up') ||
        (newDirection === 'left' && currentDirection === 'right') ||
        (newDirection === 'right' && currentDirection === 'left')
    );
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if(gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i< snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0'); //for three digits
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
    updateHighScore()
    stopAudio();
    gameOverSound.play();
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
        localStorage.setItem('snakeHighScore', highScore);
    }
    highScoreText.style.display = 'block'; 
}

function playAudio() {
    audio.loop = true;
    audio.play();
}

//Music track: Gameboy by walen
// Source: https://freetouse.com/music
// Free Music Without Copyright (Safe)

function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
}