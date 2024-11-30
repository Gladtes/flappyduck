// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Horse properties
const horse = { x: 150, y: 300, width: 40, height: 30, velocity: 0 };
const gravity = 0.6;
const jumpStrength = -10;

// Pipes
const pipes = [];
const pipeWidth = 80;
const gapHeight = 200;
const pipeSpeed = 2;

// Game state
let score = 0;
let isGameRunning = true;

// Create initial pipes
for (let i = 0; i < 3; i++) {
  const x = canvas.width + i * 300;
  const height = Math.random() * (canvas.height - gapHeight - 100) + 50;
  pipes.push({ x, height });
}

// Handle user input
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && isGameRunning) {
    horse.velocity = jumpStrength;
  }
});

// Check for collisions
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
// Load the horse image
const horseImage = new Image();
horseImage.src = "horse.png"; // 
// Draw the horse
function drawHorse() {
  ctx.drawHorse = "brown";
  ctx.drawImage(horse.x, horse.y, horse.width, horse.height);
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  for (const pipe of pipes) {
    // Upper pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);
    // Lower pipe
    ctx.fillRect(pipe.x, pipe.height + gapHeight, pipeWidth, canvas.height - pipe.height - gapHeight);
  }
}

// Draw score
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// Update game state
function updateGame() {
  if (!isGameRunning) return;

  // Apply gravity to the horse
  horse.velocity += gravity;
  horse.y += horse.velocity;

  // Move pipes
  for (const pipe of pipes) {
    pipe.x -= pipeSpeed;
  }

  // Add new pipes and remove old ones
  if (pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    const newPipeX = pipes[pipes.length - 1].x + 300;
    const newPipeHeight = Math.random() * (canvas.height - gapHeight - 100) + 50;
    pipes.push({ x: newPipeX, height: newPipeHeight });
    score++;
  }

  // Check for collisions
  checkCollision();
}

// Render the game
function renderGame() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw game objects
  drawHorse();
  drawPipes();
  drawScore();
}

// Main game loop
function gameLoop() {
  if (isGameRunning) {
    updateGame();
    renderGame();
  } else {
    // Display game over message
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 150, canvas.height / 2);
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 50);
  }
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
