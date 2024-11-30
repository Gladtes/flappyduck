// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Load the horse image
const horseImage = new Image();
horseImage.src = "horse.png"; // Ensure the file is in the same directory

// Horse properties
const horse = { x: 150, y: 300, width: 60, height: 50, velocity: 0 };
const gravity = 0.6;
const jumpStrength = -10;

// Pipes
const pipes = [];
const pipeWidth = 80;
const gapHeight = 200;
const pipeSpeed = 2;

// Game state
let score = 0;
let isGameRunning = false; // Initially, the game is not running

// Start button coordinates and dimensions
const startButton = {
  x: canvas.width / 2 - 100,
  y: canvas.height / 2 - 30,
  width: 200,
  height: 60,
};

// Handle user input
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && isGameRunning) {
    horse.velocity = jumpStrength;
  }
});

canvas.addEventListener("click", (event) => {
  if (!isGameRunning) {
    // Check if the start button is clicked
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
      mouseX >= startButton.x &&
      mouseX <= startButton.x + startButton.width &&
      mouseY >= startButton.y &&
      mouseY <= startButton.y + startButton.height
    ) {
      startGame();
    }
  }
});

// Reset the game
function resetGame() {
  horse.y = 300;
  horse.velocity = 0;
  score = 0;
  isGameRunning = true;

  // Reset pipes
  pipes.length = 0;
  for (let i = 0; i < 3; i++) {
    const x = canvas.width + i * 300;
    const height = Math.random() * (canvas.height - gapHeight - 100) + 50;
    pipes.push({ x, height });
  }
}

// Start the game
function startGame() {
  resetGame();
  gameLoop();
}

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

// Draw the horse
function drawHorse() {
  ctx.drawImage(horseImage, horse.x, horse.y, horse.width, horse.height);
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

// Draw the start button
function drawStartButton() {
  ctx.fillStyle = "blue";
  ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("START", startButton.x + 50, startButton.y + 40);
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

  if (isGameRunning) {
    // Draw game objects
    drawHorse();
    drawPipes();
    drawScore();
  } else {
    // Draw game over message and start button
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 150, canvas.height / 2 - 60);
    drawStartButton();
  }
}

// Main game loop
function gameLoop() {
  updateGame();
  renderGame();

  if (isGameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Initial rendering (shows the start button before the game starts)
drawStartButton();
