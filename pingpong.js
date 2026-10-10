const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const levelButtons = document.querySelectorAll(".lvl-btn");
let currentLevel = 1;
let isPaused = false;
let gameStarted = false;
const bar = {
    w: 100,
    h: 15,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    color: "#f4f5f8"
};
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    r: 8,
    vx: 4,
    vy: -4,
    color: "#ffffff"
};
const blockConf = {
    row: 4,
    col: 8,
    w: 80,
    h: 20,
    gap: 10,
    offTop: 40,
    offLeft: 40
};

let grid = [];
function initGrid() {
    grid = [];
    for (let i = 0; i < blockConf.col; i++) {
        grid[i] = [];
        for (let j = 0; j < blockConf.row; j++) {
            grid[i][j] = { x: 0, y: 0, show: 1 };
        }
    }
}
function setLevel(lvl) {
    currentLevel = lvl;
    levelButtons.forEach(btn => {
        let bLvl = parseInt(btn.getAttribute("data-level"));
        if (bLvl === lvl) {
            btn.style.background = "#007bff";
            btn.style.borderColor = "#007bff";
        } else {
            btn.style.background = "#333";
            btn.style.borderColor = "#555";
        }
    });
    blockConf.row = 2 + lvl;
    let speed = 3 + lvl * 1.2;
    bar.w = Math.max(60, 110 - lvl * 8);
    ball.vx = ball.vx > 0 ? speed : -speed;
    ball.vy = -speed;
    resetPositions();
    initGrid();
    gameStarted = false;
}
function resetPositions() {
    bar.x = canvas.width / 2 - bar.w / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
}
playBtn.addEventListener("click", function() {
    isPaused = false;
    gameStarted = true;
});
pauseBtn.addEventListener("click", function() {
    isPaused = true;
});
levelButtons.forEach(btn => {
    btn.addEventListener("click", function() {
        let lvl = parseInt(this.getAttribute("data-level"));
        setLevel(lvl);
    });
});
function drawPaddle() {
    ctx.fillStyle = bar.color;
    ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}
function drawBlocks() {
    const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#9b59b6", "#34495e", "#1abc9c", "#e84393"];
    for (let i = 0; i < blockConf.col; i++) {
        for (let j = 0; j < blockConf.row; j++) {
            if (grid[i][j] && grid[i][j].show === 1) {
                let bx = i * (blockConf.w + blockConf.gap) + blockConf.offLeft;
                let by = j * (blockConf.h + blockConf.gap) + blockConf.offTop;
                grid[i][j].x = bx;
                grid[i][j].y = by;
                ctx.fillStyle = colors[j % colors.length];
                ctx.fillRect(bx, by, blockConf.w, blockConf.h);
            }
        }
    }
}
function breakBlocks() {
    for (let i = 0; i < blockConf.col; i++) {
        for (let j = 0; j < blockConf.row; j++) {
            let item = grid[i][j];
            if (item && item.show === 1) {
                if (
                    ball.x > item.x &&
                    ball.x < item.x + blockConf.w &&
                    ball.y > item.y &&
                    ball.y < item.y + blockConf.h
                ) {
                    ball.vy = -ball.vy;
                    item.show = 0;
                }
            }
        }
    }
}
canvas.addEventListener("mousemove", function(e) {
    if (isPaused) return;
    let rect = canvas.getBoundingClientRect();
    let mX = e.clientX - rect.left;
    bar.x = mX - bar.w / 2;
});
function update() {
    if (isPaused || !gameStarted) return;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x + ball.r > canvas.width || ball.x - ball.r < 0) {
        ball.vx = -ball.vx;
    }
    if (ball.y - ball.r < 0) {
        ball.vy = -ball.vy;
    }
    if (
        ball.y + ball.r >= bar.y &&
        ball.x >= bar.x &&
        ball.x <= bar.x + bar.w &&
        ball.vy > 0
    ) {
        ball.vy = -ball.vy;
    }
    breakBlocks();
    if (ball.y - ball.r > canvas.height) {
        resetPositions();
        initGrid();
        gameStarted = false;
    }
}
function gameLoop() {
    ctx.fillStyle = "#151212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    drawPaddle();
    drawBall();
    update();
    requestAnimationFrame(gameLoop);
}

setLevel(1);
gameLoop();