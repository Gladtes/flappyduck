const duck = document.getElementById('duck');
const gameContainer = document.getElementById('gameContainer');
const obstacleTop = document.getElementById('obstacleTop');
const obstacleBottom = document.getElementById('obstacleBottom');
const scoreDisplay = document.getElementById('score');
const stageDisplay = document.getElementById('stage');
let duckTop = parseInt(window.getComputedStyle(duck).getPropertyValue('top'));
let isJumping = false;
let score = 0;
let stage = 1;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isJumping) {
        isJumping = true;
        let jumpCount = 0;
        let jumpInterval = setInterval(function() {
            if (jumpCount < 15) {
                duckTop -= 5;
                duck.style.top = duckTop + 'px';
            }
            if (jumpCount > 20) {
                clearInterval(jumpInterval);
                isJumping = false;
                let fallInterval = setInterval(function() {
                    if (duckTop < gameContainer.clientHeight - duck.clientHeight) {
                        duckTop += 3;
                        duck.style.top = duckTop + 'px';
                    } else {
                        clearInterval(fallInterval);
                    }
                }, 20);
            }
            jumpCount++;
        }, 20);
    }
});

function checkCollision() {
    const duckRect = duck.getBoundingClientRect();
    const obstacleTopRect = obstacleTop.getBoundingClientRect();
    const obstacleBottomRect = obstacleBottom.getBoundingClientRect();

    if (
        duckRect.right > obstacleTopRect.left &&
        duckRect.left < obstacleTopRect.right &&
        (duckRect.top < obstacleTopRect.bottom || duckRect.bottom > obstacleBottomRect.top)
    ) {
        alert('Game Over! Your score: ' + score);
        resetGame();
    }
}

function resetGame() {
    duckTop = gameContainer.clientHeight / 2 - duck.clientHeight / 2;
    duck.style.top = duckTop + 'px';
    score = 0;
    stage = 1;
    scoreDisplay.textContent = score;
    stageDisplay.textContent = 'Stage ' + stage;
}

function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    if (score % 10 === 0) {
        stage++;
        stageDisplay.textContent = 'Stage ' + stage;
        increaseDifficulty();
    }
}

function increaseDifficulty() {
    const newSpeed = 2 - stage * 0.1;
    obstacleTop.style.animationDuration = newSpeed + 's';
    obstacleBottom.style.animationDuration = newSpeed + 's';
}

setInterval(function() {
    checkCollision();
    updateScore();
}, 2000);
