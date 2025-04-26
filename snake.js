const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');

let box = 20;
let rows = 20;
let cols = 20;
let snake = [];
let direction = '';
let nextDirection = '';
let food = {};
let score = 0;
let gameRunning = false;
let game;

function resizeCanvas() {
  const container = document.querySelector('.game-container');
  const size = container.offsetWidth;
  canvas.width = size;
  canvas.height = size;
  box = Math.floor(size / 20);
  rows = Math.floor(canvas.height / box);
  cols = Math.floor(canvas.width / box);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  if (gameRunning) draw(); // Redraw if game is running
});

function initGame() {
  resizeCanvas();
  snake = [{ x: Math.floor(cols / 2) * box, y: Math.floor(rows / 2) * box }];
  direction = 'RIGHT';
  nextDirection = 'RIGHT';
  score = 0;
  scoreElement.textContent = 'Score: 0';
  placeFood();
  gameRunning = true;
  clearInterval(game);
  game = setInterval(gameLoop, 150);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box
  };
  // Avoid placing food on the snake
  if (snake.some(seg => seg.x === food.x && seg.y === food.y)) {
    placeFood();
  }
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
  const key = e.key;
  if (key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
  else if (key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';
  else if (key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
  else if (key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
});

startBtn.addEventListener('click', () => {
  if (gameRunning) {
    clearInterval(game);
    gameRunning = false;
    startBtn.textContent = 'Start Game';
  } else {
    initGame();
    startBtn.textContent = 'Pause Game';
  }
});

function gameLoop() {
  if (nextDirection) {
    direction = nextDirection;
    nextDirection = '';
  }

  const head = { x: snake[0].x, y: snake[0].y };

  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = 'Score: ' + score;
    placeFood();
  } else {
    snake.pop(); // only pop if not eating
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((seg, idx) => {
    ctx.fillStyle = idx === 0 ? '#0f0' : '#4caf50';
    ctx.fillRect(seg.x, seg.y, box, box);
    ctx.strokeStyle = '#111';
    ctx.strokeRect(seg.x, seg.y, box, box);
  });

  // Draw food
  ctx.fillStyle = '#f00';
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
  ctx.fill();
}

function gameOver() {
  clearInterval(game);
  gameRunning = false;
  startBtn.textContent = 'Start Game';
  alert('Game Over! Your score was: ' + score);
}

// Initial draw
resizeCanvas();
draw();
