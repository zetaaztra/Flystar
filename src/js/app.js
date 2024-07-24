const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let star = { x: 50, y: canvas.height / 2, radius: 20 };
let pillars = [];
let score = 0;
let lives = 3;
let gameSpeed = 2;
let gameInterval;
let gameOver = false;

const keys = { up: false, down: false, left: false, right: false };

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') keys.up = true;
    if (e.code === 'ArrowDown') keys.down = true;
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp') keys.up = false;
    if (e.code === 'ArrowDown') keys.down = false;
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
});

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.fillStyle = 'yellow';
    ctx.fill();
}

function createPillar() {
    let gap = 200;
    let height = Math.random() * (canvas.height - gap);
    pillars.push({ x: canvas.width, top: height, bottom: height + gap });
}

function drawPillars() {
    ctx.fillStyle = 'green';
    for (let pillar of pillars) {
        ctx.fillRect(pillar.x, 0, 50, pillar.top);
        ctx.fillRect(pillar.x, pillar.bottom, 50, canvas.height - pillar.bottom);
    }
}

function updatePillars() {
    for (let pillar of pillars) {
        pillar.x -= gameSpeed;
        if (pillar.x + 50 < 0) {
            pillars.shift();
            score += 10;
            if (score % 100 === 0) gameSpeed += 0.5;
        }
    }
    if (pillars.length === 0 || pillars[pillars.length - 1].x < canvas.width - 300) {
        createPillar();
    }
}

function checkCollision() {
    for (let pillar of pillars) {
        if (star.x + star.radius > pillar.x && star.x - star.radius < pillar.x + 50) {
            if (star.y - star.radius < pillar.top || star.y + star.radius > pillar.bottom) {
                return true;
            }
        }
    }
    return false;
}

function resetGame() {
    star = { x: 50, y: canvas.height / 2, radius: 20 };
    pillars = [];
    score = 0;
    lives = 3;
    gameSpeed = 2;
    gameOver = false;
    document.getElementById('game-over').style.display = 'none';
    gameInterval = setInterval(gameLoop, 20);
}

function endGame() {
    clearInterval(gameInterval);
    gameOver = true;
    document.getElementById('game-over').style.display = 'block';
}

document.getElementById('score-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const resultDiv = document.getElementById('score-results');
    const newScore = document.createElement('p');
    newScore.textContent = `${name}: ${score} points`;
    resultDiv.appendChild(newScore);
    resetGame();
});

function gameLoop() {
    if (keys.up) star.y -= 4;
    if (keys.down) star.y += 4;
    if (keys.left) star.x -= 4;
    if (keys.right) star.x += 4;

    // Prevent star from going out of canvas bounds
    if (star.y - star.radius < 0) star.y = star.radius;
    if (star.y + star.radius > canvas.height) star.y = canvas.height - star.radius;
    if (star.x - star.radius < 0) star.x = star.radius;
    if (star.x + star.radius > canvas.width) star.x = canvas.width - star.radius;

    if (checkCollision()) {
        lives--;
        if (lives <= 0) {
            endGame();
            return;
        } else {
            star.y = canvas.height / 2;
            star.x = 50;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStar(star.x, star.y, 6, star.radius, star.radius / 2);
    drawPillars();
    updatePillars();

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 60);
}

resetGame();

