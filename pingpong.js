const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = 800;
canvas.height = 500;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
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
    row: 4, col: 8, w: 80, h: 20, gap: 10, offTop: 40, offLeft: 40
};
let grid = [];
for (let i = 0; i < blockConf.col; i++) {
    grid[i] = [];
    for (let j = 0; j < blockConf.row; j++) {
        grid[i][j] = { x: 0, y: 0, show: 1 };
    }
}
function drawPaddle() {
    ctx.fillStyle = bar.color;
    ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
}
function drawBall() {
    ctx.beginPath();ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);ctx.fillStyle = ball.color;ctx.fill();ctx.closePath();
}
function drawBlocks() {
    const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71"];
    for (let i = 0; i < blockConf.col; i++) {
        for (let j = 0; j < blockConf.row; j++) {
            if (grid[i][j].show === 1) {
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
            if (item.show === 1) {
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
    let rect = canvas.getBoundingClientRect();
    let mX = e.clientX - rect.left;
    bar.x = mX - bar.w / 2;
});
function update() {
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
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 50;
        ball.vy = -4;
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

gameLoop();