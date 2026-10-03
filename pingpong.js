const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = 800;
canvas.height = 500;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
const paddle = {
    width: 100,
    height: 15,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    color: "#007bff"
};
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 8,
    dx: 4,  // Tốc độ di chuyển ngang
    dy: -4, // Tốc độ di chuyển lên
    color: "#ffffff"
};

function drawPaddle() {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}
canvas.addEventListener("mousemove", function(e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    paddle.x = mouseX - paddle.width / 2;
});
function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
}
function gameLoop() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Xóa khung cũ

    drawPaddle();
    drawBall();
    update();

    requestAnimationFrame(gameLoop);
}
gameLoop();