const gameArea = document.querySelector(".game");
const ballElement = document.querySelector(".ball");
const barElement = document.querySelector(".bar");
const blockArea = document.querySelector(".block-area");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const levelButtons = document.querySelectorAll(".lvl-btn");

let gameStarted = false;
let isPaused = false;
let currentLevel = 1;

let blocks = [];
let gifts = [];
let balls = [];

let maxBalls = 18;
let maxGifts = 2;

let bar = {
    x: 350,
    y: 470,
    width: 110,
    height: 15
};

let ballSpeed = 2;

let blockRow = 6;
let blockCol = 14;
let blockWidth = 50;
let blockHeight = 20;
let blockGap = 4;

let blockMove = 0;
let blockDirection = 1;
let blockMoveSpeed = 0.5;

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
            let y = 30 + row * (blockHeight + blockGap);
            let block = document.createElement("div");
            let colorNumber = row;

            if (colorNumber >= colors.length) {
                colorNumber = colorNumber - colors.length;
            }

            block.className = "block";
            block.style.left = x + "px";
            block.style.top = y + "px";
            block.style.backgroundColor = colors[colorNumber];

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

function moveBlocks() {
    if (currentLevel !== 3) {
        return;
    }

    let move = blockMoveSpeed * blockDirection;

    blockMove = blockMove + move;

    for (let i = 0; i < blocks.length; i++) {
        blocks[i].x = blocks[i].x + move;
        blocks[i].element.style.left = blocks[i].x + "px";
    }

    if (blockMove >= 20) {
        blockDirection = -1;
    }

    if (blockMove <= -20) {
        blockDirection = 1;
    }
}

function chooseLevel(level) {
    currentLevel = level;
    blockMove = 0;
    blockDirection = 1;

    if (level === 1) {
        blockRow = 6;
        ballSpeed = 2;
        bar.width = 110;
    } else if (level === 2) {
        blockRow = 7;
        ballSpeed = 2;
        bar.width = 105;
    } else if (level === 3) {
        blockRow = 8;
        ballSpeed = 3;
        bar.width = 95;
    } else if (level === 4) {
        blockRow = 9;
        ballSpeed = 3;
        bar.width = 85;
    } else if (level === 5) {
        blockRow = 10;
        ballSpeed = 4;
        bar.width = 75;
    } else if (level === 6) {
        blockRow = 11;
        ballSpeed = 5;
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

    resetBalls();
}

function resetBalls() {
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].element !== ballElement) {
            balls[i].element.remove();
        }
    }

    balls = [];

    ballElement.style.display = "block";

    balls.push({
        x: gameArea.clientWidth / 2,
        y: gameArea.clientHeight - 50,
        radius: 8,
        speedX: ballSpeed,
        speedY: -ballSpeed,
        element: ballElement
    });
}

function showGame() {
    barElement.style.width = bar.width + "px";
    barElement.style.height = bar.height + "px";
    barElement.style.left = bar.x + "px";
    barElement.style.top = bar.y + "px";

    for (let i = 0; i < balls.length; i++) {
        balls[i].element.style.left =
            balls[i].x - balls[i].radius + "px";

        balls[i].element.style.top =
            balls[i].y - balls[i].radius + "px";
    }

    for (let i = 0; i < gifts.length; i++) {
        gifts[i].element.style.left = gifts[i].x + "px";
        gifts[i].element.style.top = gifts[i].y + "px";
    }
}

function createGift(x, y) {
    if (currentLevel < 2) {
        return;
    }

    if (gifts.length >= maxGifts) {
        return;
    }

    if (Math.random() > 0.1) {
        return;
    }

    let type = 2;

    if (Math.random() >= 0.5) {
        type = 3;
    }

    let gift = document.createElement("div");

    gift.className = "gift";
    gift.innerText = "x" + type;

    gameArea.appendChild(gift);

    gifts.push({
        x: x,
        y: y,
        width: 40,
        height: 25,
        speed: 2,
        type: type,
        element: gift
    });
}

function moveGifts() {
    let i = gifts.length - 1;

    while (i >= 0) {
        let gift = gifts[i];

        gift.y = gift.y + gift.speed;

        let giftBottom = gift.y + gift.height;
        let giftRight = gift.x + gift.width;
        let barRight = bar.x + bar.width;

        if (
            giftBottom >= bar.y &&
            gift.y <= bar.y + bar.height &&
            giftRight >= bar.x &&
            gift.x <= barRight
        ) {
            multiplyBalls(gift.type);

            gift.element.remove();
            gifts.splice(i, 1);
        } else if (gift.y > gameArea.clientHeight) {
            gift.element.remove();
            gifts.splice(i, 1);
        }

        i--;
    }
}

function multiplyBalls(number) {
    if (balls.length === 0 || balls.length >= maxBalls) {
        return;
    }

    let oldBalls = [];

    for (let i = 0; i < balls.length; i++) {
        oldBalls.push(balls[i]);
    }

    for (let i = 0; i < oldBalls.length; i++) {
        let oldBall = oldBalls[i];

        for (let j = 1; j < number; j++) {
            if (balls.length >= maxBalls) {
                return;
            }

            let newBallElement = document.createElement("div");

            newBallElement.className = "ball";

            gameArea.appendChild(newBallElement);

            let newX = oldBall.x;
            let newSpeedX = oldBall.speedX;

            if (j === 1) {
                newX = newX - 15;

                if (newSpeedX > 0) {
                    newSpeedX = -newSpeedX;
                }
            } else {
                newX = newX + 15;

                if (newSpeedX < 0) {
                    newSpeedX = -newSpeedX;
                }
            }

            if (newX < 10) {
                newX = 10;
            }

            if (newX > gameArea.clientWidth - 10) {
                newX = gameArea.clientWidth - 10;
            }

            balls.push({
                x: newX,
                y: oldBall.y - 10,
                radius: 8,
                speedX: newSpeedX,
                speedY: -ballSpeed,
                element: newBallElement
            });
        }
    }
}

function clearGifts() {
    for (let i = 0; i < gifts.length; i++) {
        gifts[i].element.remove();
    }

    gifts = [];
}

function checkBlockCollision(ball) {
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

                createGift(block.x + 5, block.y);

                break;
            }
        }
    }
}

function checkWallCollision(ball) {
    if (
        ball.x + ball.radius >= gameArea.clientWidth &&
        ball.speedX > 0
    ) {
        ball.speedX = -ball.speedX;
    }

    if (
        ball.x - ball.radius <= 0 &&
        ball.speedX < 0
    ) {
        ball.speedX = -ball.speedX;
    }

    if (
        ball.y - ball.radius <= 0 &&
        ball.speedY < 0
    ) {
        ball.speedY = -ball.speedY;
    }
}

function checkBarCollision(ball) {
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
        ball.y = bar.y - ball.radius;
    }
}

function moveBalls() {
    let i = balls.length - 1;

    while (i >= 0) {
        let ball = balls[i];

        ball.x = ball.x + ball.speedX;
        ball.y = ball.y + ball.speedY;

        checkWallCollision(ball);
        checkBarCollision(ball);
        checkBlockCollision(ball);

        if (ball.y - ball.radius > gameArea.clientHeight) {
            if (ball.element === ballElement) {
                ball.element.style.display = "none";
            } else {
                ball.element.remove();
            }

            balls.splice(i, 1);
        }

        i--;
    }

    if (balls.length === 0) {
        clearGifts();
        resetGame();
        createBlocks();

        gameStarted = false;
    }
}

function checkWin() {
    let remainingBlocks = 0;

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].visible === true) {
            remainingBlocks++;
        }
    }

    if (remainingBlocks !== 0) {
        return false;
    }

    gameStarted = false;
    clearGifts();

    if (currentLevel < 6) {
        let nextLevel = currentLevel + 1;

        alert(
            "Đã chiến thắng Level " +
            currentLevel +
            "! Qua Level " +
            nextLevel
        );

        chooseLevel(nextLevel);
    } else {
        alert("Đã chiến thắng tất cả Level!");

        resetGame();
        createBlocks();
        showGame();
    }

    return true;
}

function updateGame() {
    if (gameStarted === false || isPaused === true) {
        return;
    }

    moveBlocks();
    moveBalls();
    moveGifts();
    checkWin();
}

function gameLoop() {
    updateGame();
    showGame();

    requestAnimationFrame(gameLoop);
}

function startGame() {
    if (gameStarted === false) {
        gameStarted = true;
        isPaused = false;
    } else if (isPaused === true) {
        isPaused = false;
    }
}

playBtn.addEventListener("click", function() {
    startGame();
});

pauseBtn.addEventListener("click", function() {
    if (gameStarted === true) {
        isPaused = true;
    }
});

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        startGame();
    }
});

for (let i = 0; i < levelButtons.length; i++) {
    levelButtons[i].addEventListener("click", function() {
        let level = Number(this.getAttribute("data-level"));

        chooseLevel(level);
    });
}

gameArea.addEventListener("mousemove", function(event) {
    if (gameStarted === false || isPaused === true) {
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