const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const horse = { x: 150, y: 300, width: 40, height: 30, velocity: 0 };
const gravity = 0.6;
const jumpStrength = -10;

const pipes = [];
const pipeWidth = 80;
const gapHeight = 200;
const pipeSpeed = 2;

let score = 0;
let isGameRunning = true;

// Generate initial pipes
for (let i = 0; i < 3; i++) {
  const x = canvas.width + i * 300;
  const height = Math.random() * (canvas.height - gapHeight - 100) + 50;
  pipes.push({ x, height });
}

// Handle spacebar press
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && isGameRunning) {
    horse.velocity = jumpStrength;
  }
});

// Check for collision
function checkCollision() {
  if (horse.y + horse.height > canvas.height || horse.y < 0) {
    isGameRunning = false;
  }

  for (const pipe of pipes) {
    if (
      horse.x < pipe.x + pipeWidth &&
      horse.x + horse.width > pipe.x &&
      (horse.y < pipe.height || horse.y + horse.height > pipe.height + gapHeight)
    ) {
      isGameRunning = false;
    }
  }
}

// Draw horse
function drawHorse() {
  ctx.fillStyle = "brown";
  ctx.fillRect(horse.x, horse.y, horse.width, horse.height);
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  for (const pipe of pipes) {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height); // Top pipe
    ctx.fillRect(pipe.x, pipe.height + gapHeight, pipeWidth, canvas.height - pipe.height - gapHeight); // Bottom pipe
  }
}

// Draw score
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(`
