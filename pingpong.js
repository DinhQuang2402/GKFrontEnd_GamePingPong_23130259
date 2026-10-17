const gameArea = document.getElementById("gameArea");
const ballElement = document.getElementById("ball");
const barElement = document.getElementById("bar");
const blockArea = document.getElementById("blockArea");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const levelButtons = document.querySelectorAll(".lvl-btn");
let gameStarted = false;
let isPaused = false;
let currentLevel = 1;
let blocks = [];
let gifts = [];
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
    speedX: 2,
    speedY: -2
};
let blockRow = 2;
let blockCol = 6;
let blockWidth = 80;
let blockHeight = 20;
let blockGap = 10;
const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "purple",
    "gray",
    "cyan",
    "pink"
];
function createBlocks() {
    blockArea.innerHTML = "";
    blocks = [];
    let totalWidth = blockCol * blockWidth + (blockCol - 1) * blockGap;
    let startX = (gameArea.clientWidth - totalWidth) / 2;
    for (let row = 0; row < blockRow; row++) {
        for (let col = 0; col < blockCol; col++) {
            let x = startX + col * (blockWidth + blockGap);
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
    currentLevel = level;
    if (level === 1) {
        blockRow = 2;
        blockCol = 6;
        ball.speedX = 3;
        ball.speedY = -3;
        bar.width = 110;
    } else if (level === 2) {
        blockRow = 3;
        blockCol = 6;
        ball.speedX = 3;
        ball.speedY = -3;
        bar.width = 105;
    } else if (level === 3) {
        blockRow = 4;
        blockCol = 7;
        ball.speedX = 4;
        ball.speedY = -4;
        bar.width = 95;
    } else if (level === 4) {
        blockRow = 5;
        blockCol = 7;
        ball.speedX = 5;
        ball.speedY = -5;
        bar.width = 85;
    } else if (level === 5) {
        blockRow = 6;
        blockCol = 8;
        ball.speedX = 6;
        ball.speedY = -6;
        bar.width = 75;
    } else if (level === 6) {
        blockRow = 7;
        blockCol = 8;
        ball.speedX = 7;
        ball.speedY = -7;
        bar.width = 65;
    }
    for (let i = 0; i < levelButtons.length; i++) {
        let buttonLevel = Number(levelButtons[i].getAttribute("data-level"));
        if (buttonLevel === level) {
            levelButtons[i].style.backgroundColor = "dodgerblue";
            levelButtons[i].style.borderColor = "dodgerblue";
        } else {
            levelButtons[i].style.backgroundColor = "dimgray";
            levelButtons[i].style.borderColor = "gray";
        }
    }
    clearGifts();
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
    if (ball.speedY > 0) {
        ball.speedY = -ball.speedY;
    }
}
function showGame() {
    barElement.style.width = bar.width + "px";
    barElement.style.height = bar.height + "px";
    barElement.style.left = bar.x + "px";
    barElement.style.top = bar.y + "px";
    ballElement.style.left = ball.x - ball.radius + "px";
    ballElement.style.top = ball.y - ball.radius + "px";
    for (let i = 0; i < gifts.length; i++) {
        gifts[i].element.style.left = gifts[i].x + "px";
        gifts[i].element.style.top = gifts[i].y + "px";
    }
}
function createGift(x, y) {
    if (currentLevel < 2) {
        return;
    }
    let random = Math.random();
    if (random > 0.3) {
        return;
    }
    let gift = document.createElement("div");
    gift.className = "gift";
    gift.innerText = "x2";
    gameArea.appendChild(gift);
    gifts.push({
        x: x,
        y: y,
        speed: 2,
        element: gift
    });
}
function moveGifts() {
    for (let i = gifts.length - 1; i >= 0; i--) {
        gifts[i].y = gifts[i].y + gifts[i].speed;
        if (gifts[i].y > gameArea.clientHeight) {
            gifts[i].element.remove();
            gifts.splice(i, 1);
        }
    }
}
function clearGifts() {
    for (let i = 0; i < gifts.length; i++) {
        gifts[i].element.remove();
    }
    gifts = [];
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
                createGift(block.x + 20, block.y);
                break;
            }
        }
    }
}
function checkWin() {
    let remainingBlocks = 0;
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].visible === true) {
            remainingBlocks++;
        }
    }
    if (remainingBlocks === 0) {
        gameStarted = false;
        clearGifts();
        if (currentLevel < 6) {
            let nextLevel = currentLevel + 1;
            alert("Đã chiến thắng Level " + currentLevel + "! Qua Level " + nextLevel);
            chooseLevel(nextLevel);
        } else {
            alert("Đã chiến thắng tất cả Level!");
            resetGame();
            showGame();
        }
        return true;
    }
    return false;
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
    moveGifts();
    if (checkWin() === true) {
        return;
    }
    if (ball.y - ball.radius > gameArea.clientHeight) {
        clearGifts();
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
    if (ball.speedY > 0) {
        ball.speedY = -ball.speedY;
    }
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
    if (gameStarted === false) {
        return;
    }
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