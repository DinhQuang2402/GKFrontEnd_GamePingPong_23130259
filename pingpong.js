const gameArea = document.getElementById("gameArea");
const ballElement = document.getElementById("ball");
const barElement = document.getElementById("bar");
const blockArea = document.getElementById("blockArea");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const levelButtons = document.querySelectorAll(".lvl-btn");
let gameStarted = false;
let isPaused = false;
let blocks = [];
let bar = {
    x: 350,
    y: 470,
    width: 100,
    height: 15
};
let ball = {
    x: 400,
    y: 450,
    radius: 8,
    speedX: 4,
    speedY: -4
};
let blockRow = 3;
let blockCol = 8;
let blockWidth = 80;
let blockHeight = 20;
let blockGap = 10;
const colors = [
    "#e74c3c",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#9b59b6",
    "#34495e",
    "#1abc9c",
    "#e84393"
];
function createBlocks() {
    blockArea.innerHTML = "";
    blocks = [];
    for (let row = 0; row < blockRow; row++) {
        for (let col = 0; col < blockCol; col++) {
            let x = 40 + col * (blockWidth + blockGap);
            let y = 40 + row * (blockHeight + blockGap);
            let block = document.createElement("div");
            block.className = "block";
            block.style.left = x + "px";
            block.style.top = y + "px";
            block.style.backgroundColor = colors[row];
            blockArea.appendChild(block);
            blocks.push({
                x: x,
                y: y,
                visible: true,
                element: block
            });
        }
    }
}
function chooseLevel(level) {
    if (level === 1) {
        blockRow = 3;
        ball.speedX = 4;
        ball.speedY = -4;
        bar.width = 100;
    } else if (level === 2) {
        blockRow = 4;
        ball.speedX = 5;
        ball.speedY = -5;
        bar.width = 95;
    } else if (level === 3) {
        blockRow = 5;
        ball.speedX = 6;
        ball.speedY = -6;
        bar.width = 90;
    } else if (level === 4) {
        blockRow = 6;
        ball.speedX = 7;
        ball.speedY = -7;
        bar.width = 80;
    } else if (level === 5) {
        blockRow = 7;
        ball.speedX = 8;
        ball.speedY = -8;
        bar.width = 70;
    } else if (level === 6) {
        blockRow = 8;
        ball.speedX = 9;
        ball.speedY = -9;
        bar.width = 60;
    }
    for (let i = 0; i < levelButtons.length; i++) {
        let buttonLevel = Number(levelButtons[i].getAttribute("data-level"));
        if (buttonLevel === level) {
            levelButtons[i].style.backgroundColor = "#007bff";
            levelButtons[i].style.borderColor = "#007bff";
        } else {
            levelButtons[i].style.backgroundColor = "#333";
            levelButtons[i].style.borderColor = "#555";
        }
    }
    resetGame();
    createBlocks();
    gameStarted = false;
    isPaused = false;
    showGame();
}
function resetGame() {
    bar.x = gameArea.clientWidth / 2 - bar.width / 2;
    bar.y = gameArea.clientHeight - 30;
    ball.x = gameArea.clientWidth / 2;
    ball.y = gameArea.clientHeight - 50;
}
function showGame() {
    barElement.style.width = bar.width + "px";
    barElement.style.height = bar.height + "px";
    barElement.style.left = bar.x + "px";
    barElement.style.top = bar.y + "px";
    ballElement.style.left = ball.x - ball.radius + "px";
    ballElement.style.top = ball.y - ball.radius + "px";
}
function checkBlockCollision() {
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (block.visible === true) {
            let left = block.x;
            let right = block.x + blockWidth;
            let top = block.y;
            let bottom = block.y + blockHeight;
            if (
                ball.x >= left &&
                ball.x <= right &&
                ball.y >= top &&
                ball.y <= bottom
            ) {
                ball.speedY = -ball.speedY;
                block.visible = false;
                block.element.style.display = "none";
                break;
            }
        }
    }
}
function checkWallCollision() {
    if (ball.x + ball.radius >= gameArea.clientWidth) {
        ball.speedX = -ball.speedX;
    }
    if (ball.x - ball.radius <= 0) {
        ball.speedX = -ball.speedX;
    }
    if (ball.y - ball.radius <= 0) {
        ball.speedY = -ball.speedY;
    }
}
function checkBarCollision() {
    let ballBottom = ball.y + ball.radius;
    let barRight = bar.x + bar.width;
    if (
        ballBottom >= bar.y &&
        ballBottom <= bar.y + bar.height &&
        ball.x >= bar.x &&
        ball.x <= barRight &&
        ball.speedY > 0
    ) {
        ball.speedY = -ball.speedY;
    }
}
function updateGame() {
    if (gameStarted === false) {
        return;
    }
    if (isPaused === true) {
        return;
    }
    ball.x = ball.x + ball.speedX;
    ball.y = ball.y + ball.speedY;
    checkWallCollision();
    checkBarCollision();
    checkBlockCollision();
    if (ball.y - ball.radius > gameArea.clientHeight) {
        resetGame();
        createBlocks();
        gameStarted = false;
    }
}
function gameLoop() {
    updateGame();
    showGame();
    requestAnimationFrame(gameLoop);
}
playBtn.addEventListener("click", function() {
    gameStarted = true;
    isPaused = false;
});

pauseBtn.addEventListener("click", function() {
    isPaused = true;
});
for (let i = 0; i < levelButtons.length; i++) {
    levelButtons[i].addEventListener("click", function() {
        let level = Number(this.getAttribute("data-level"));

        chooseLevel(level);
    });
}
gameArea.addEventListener("mousemove", function(event) {
    if (isPaused === true) {
        return;
    }
    let gamePosition = gameArea.getBoundingClientRect();
    let mouseX = event.clientX - gamePosition.left;
    bar.x = mouseX - bar.width / 2;
    if (bar.x < 0) {
        bar.x = 0;
    }
    if (bar.x + bar.width > gameArea.clientWidth) {
        bar.x = gameArea.clientWidth - bar.width;
    }
});
chooseLevel(1);
gameLoop();