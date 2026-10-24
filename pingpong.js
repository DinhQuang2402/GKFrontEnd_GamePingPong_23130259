const game = document.querySelector(".game");
const ctx = game.getContext("2d");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const levelButtons = document.querySelectorAll(".lvl-btn");

let gameStarted = false;
let isPaused = false;
let currentLevel = 1;
let balls = [];
let blocks = [];
let gifts = [];
let maxBalls = 18;
let maxGifts = 2;
let ballSpeed = 2;
let blockRow = 6;
let blockCol = 14;
let blockWidth = 50;
let blockHeight = 20;
let blockGap = 4;
let blockMove = 0;
let blockDirection = 1;
let blockMoveSpeed = 0.5;

let bar = {
    x: 350,
    y: 570,
    width: 110,
    height: 15
};

const colors = [
    "red", "orange", "yellow", "green",
    "purple", "gray", "cyan", "pink"
];

function level4Path(row, col) {
    if (row === 1 && (col === 5 || col === 6)) return true;
    if (col === 5 && row >= 1 && row <= 4) return true;
    if (row === 4 && col >= 3 && col <= 5) return true;
    if (col === 3 && row >= 4 && row <= 6) return true;
    if (row === 6 && col >= 3 && col <= 9) return true;
    if (col === 9 && row >= 3 && row <= 6) return true;
    if (row === 3 && col >= 8 && col <= 9) return true;

    return false;
}

function createBlocks() {
    blocks = [];

    let rows = blockRow;

    if (currentLevel === 4) {
        rows = 9;
    }

    let totalWidth = blockCol * blockWidth + (blockCol - 1) * blockGap;
    let startX = (game.width - totalWidth) / 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < blockCol; col++) {
            if (currentLevel === 4 && level4Path(row, col)) {
                continue;
            }

            let x = startX + col * (blockWidth + blockGap);
            let y = 30 + row * (blockHeight + blockGap);
            let hit = 1;

            let colorNumber = row;

            if (colorNumber >= colors.length) {
                colorNumber = colorNumber - colors.length;
            }

            if (currentLevel === 4) {
                let outside =
                    row === 0 ||
                    row === rows - 1 ||
                    col === 0 ||
                    col === blockCol - 1;

                if (outside) {
                    hit = 1;
                } else {
                    if (Math.random() < 0.5) {
                        hit = 2;
                    } else {
                        hit = 3;
                    }
                }
            }

            blocks.push({
                x: x,
                y: y,
                hit: hit,
                color: colors[colorNumber],
                visible: true
            });
        }
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
    }

    for (let i = 0; i < levelButtons.length; i++) {
        let levelNumber = Number(
            levelButtons[i].getAttribute("data-level")
        );

        if (levelNumber === level) {
            levelButtons[i].style.backgroundColor = "dodgerblue";
        } else {
            levelButtons[i].style.backgroundColor = "dimgray";
        }
    }

    gifts = [];
    createBlocks();
    resetGame();

    gameStarted = false;
    isPaused = false;

    drawGame();
}

function resetGame() {
    bar.x = game.width / 2 - bar.width / 2;
    bar.y = game.height - 30;

    balls = [];

    balls.push({
        x: game.width / 2,
        y: game.height - 50,
        radius: 8,
        speedX: ballSpeed,
        speedY: -ballSpeed
    });
}

function moveBlocks() {
    if (currentLevel !== 3) return;

    blockMove += blockMoveSpeed * blockDirection;

    if (blockMove >= 20) {
        blockMove = 20;
        blockDirection = -1;
    }

    if (blockMove <= -20) {
        blockMove = -20;
        blockDirection = 1;
    }
}

function createGift(x, y) {
    if (currentLevel < 2) return;
    if (gifts.length >= maxGifts) return;
    if (Math.random() > 0.1) return;

    let type = 2;

    if (Math.random() > 0.5) {
        type = 3;
    }

    gifts.push({
        x: x,
        y: y,
        width: 40,
        height: 25,
        speed: 2,
        type: type
    });
}

function multiplyBalls(number) {
    if (balls.length === 0) return;

    let oldCount = balls.length;

    for (let i = 0; i < oldCount; i++) {
        if (balls.length >= maxBalls) return;

        let oldBall = balls[i];
        let newX = oldBall.x - 15;

        if (newX < 8) {
            newX = 8;
        }

        balls.push({
            x: newX,
            y: oldBall.y - 10,
            radius: 8,
            speedX: -ballSpeed,
            speedY: -ballSpeed
        });

        if (number === 3 && balls.length < maxBalls) {
            newX = oldBall.x + 15;

            if (newX > game.width - 8) {
                newX = game.width - 8;
            }

            balls.push({
                x: newX,
                y: oldBall.y - 10,
                radius: 8,
                speedX: ballSpeed,
                speedY: -ballSpeed
            });
        }
    }
}

function moveGifts() {
    for (let i = gifts.length - 1; i >= 0; i--) {
        let gift = gifts[i];

        gift.y += gift.speed;

        let giftRight = gift.x + gift.width;
        let giftBottom = gift.y + gift.height;
        let barRight = bar.x + bar.width;
        let barBottom = bar.y + bar.height;

        if (
            giftBottom >= bar.y &&
            gift.y <= barBottom &&
            giftRight >= bar.x &&
            gift.x <= barRight
        ) {
            multiplyBalls(gift.type);
            gifts.splice(i, 1);
        } else if (gift.y > game.height) {
            gifts.splice(i, 1);
        }
    }
}

function checkWall(ball) {
    if (ball.x + ball.radius >= game.width && ball.speedX > 0) {
        ball.x = game.width - ball.radius;
        ball.speedX = -ball.speedX;
    }

    if (ball.x - ball.radius <= 0 && ball.speedX < 0) {
        ball.x = ball.radius;
        ball.speedX = -ball.speedX;
    }

    if (ball.y - ball.radius <= 0 && ball.speedY < 0) {
        ball.y = ball.radius;
        ball.speedY = -ball.speedY;
    }
}

function checkBar(ball) {
    let ballLeft = ball.x - ball.radius;
    let ballRight = ball.x + ball.radius;
    let ballBottom = ball.y + ball.radius;
    let barRight = bar.x + bar.width;

    if (
        ballBottom >= bar.y &&
        ball.y <= bar.y + bar.height &&
        ballRight >= bar.x &&
        ballLeft <= barRight &&
        ball.speedY > 0
    ) {
        ball.y = bar.y - ball.radius;
        ball.speedY = -ball.speedY;
    }
}

function checkBlock(ball) {
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];

        if (block.visible === false) {
            continue;
        }

        let x = block.x;

        if (currentLevel === 3) {
            x += blockMove;
        }

        let ballLeft = ball.x - ball.radius;
        let ballRight = ball.x + ball.radius;
        let ballTop = ball.y - ball.radius;
        let ballBottom = ball.y + ball.radius;

        let blockRight = x + blockWidth;
        let blockBottom = block.y + blockHeight;

        if (
            ballRight >= x &&
            ballLeft <= blockRight &&
            ballBottom >= block.y &&
            ballTop <= blockBottom
        ) {
            ball.speedY = -ball.speedY;
            block.hit--;

            if (block.hit <= 0) {
                block.visible = false;
                createGift(x + 5, block.y);
            }

            break;
        }
    }
}

function moveBalls() {
    for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];

        ball.x += ball.speedX;
        ball.y += ball.speedY;

        checkWall(ball);
        checkBar(ball);
        checkBlock(ball);

        if (ball.y - ball.radius > game.height) {
            balls.splice(i, 1);
        }
    }

    if (balls.length === 0) {
        gifts = [];
        blockMove = 0;
        blockDirection = 1;

        createBlocks();
        resetGame();

        gameStarted = false;
    }
}

function checkWin() {
    let remaining = 0;

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].visible === true) {
            remaining++;
        }
    }

    if (remaining > 0) return;

    gameStarted = false;
    gifts = [];

    if (currentLevel < 5) {
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

        createBlocks();
        resetGame();
    }
}

function drawBlocks() {
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];

        if (block.visible === false) {
            continue;
        }

        let x = block.x;

        if (currentLevel === 3) {
            x += blockMove;
        }

        if (currentLevel === 4) {
            if (block.hit === 1) {
                ctx.fillStyle = "lightgray";
            } else if (block.hit === 2) {
                ctx.fillStyle = "gold";
            } else {
                ctx.fillStyle = "firebrick";
            }
        } else {
            ctx.fillStyle = block.color;
        }

        ctx.fillRect(
            x,
            block.y,
            blockWidth,
            blockHeight
        );

        if (currentLevel === 4) {
            if (block.hit === 3) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "black";
            }

            ctx.fillText(
                "x" + block.hit,
                x + blockWidth / 2,
                block.y + blockHeight / 2
            );
        }
    }
}

function drawBalls() {
    ctx.fillStyle = "white";

    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];

        ctx.fillRect(
            ball.x - ball.radius,
            ball.y - ball.radius,
            ball.radius * 2,
            ball.radius * 2
        );
    }
}

function drawBar() {
    ctx.fillStyle = "white";

    ctx.fillRect(
        bar.x,
        bar.y,
        bar.width,
        bar.height
    );
}

function drawGifts() {
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < gifts.length; i++) {
        let gift = gifts[i];

        ctx.fillStyle = "gold";

        ctx.fillRect(
            gift.x,
            gift.y,
            gift.width,
            gift.height
        );

        ctx.fillStyle = "black";

        ctx.fillText(
            "x" + gift.type,
            gift.x + gift.width / 2,
            gift.y + gift.height / 2
        );
    }
}

function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, game.width, game.height);

    drawBlocks();
    drawGifts();
    drawBalls();
    drawBar();
}

function gameLoop() {
    if (gameStarted === true && isPaused === false) {
        moveBlocks();
        moveBalls();
        moveGifts();
        checkWin();
    }

    drawGame();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameStarted = true;
    isPaused = false;
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
        let level = Number(
            this.getAttribute("data-level")
        );

        chooseLevel(level);
    });
}

game.addEventListener("mousemove", function(event) {
    if (gameStarted === false || isPaused === true) {
        return;
    }

    let position = game.getBoundingClientRect();
    let mouseX = event.clientX - position.left;

    bar.x = mouseX - bar.width / 2;

    if (bar.x < 0) {
        bar.x = 0;
    }

    if (bar.x + bar.width > game.width) {
        bar.x = game.width - bar.width;
    }
});

chooseLevel(1);
gameLoop();