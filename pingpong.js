const game = document.querySelector(".game");
const gameContext = game.getContext("2d");
const playButton = document.querySelector(".play-btn");
const levelButtons = document.querySelectorAll(".lvl-btn");

let gameStarted = false;
let currentLevel = 1;
let balls = [];
let blocks = [];
let gifts = [];
let maximumBalls = 18;
let maximumGifts = 2;
let ballSpeed = 2;
let blockRow = 6;
let blockColumn = 14;
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

/**
 * Tạo các vị trí trống để làm đường đi cho Level 4.
 */
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

/**
 * Tạo gạch cho các level, Level 4 có gạch x1, x2, x3 và đường trống.
 */
function createBlocks() {
    blocks = [];

    let rows = blockRow;

    if (currentLevel === 4) {
        rows = 9;
    }

    let totalWidth = blockColumn * blockWidth + (blockColumn - 1) * blockGap;
    let startX = (game.width - totalWidth) / 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < blockColumn; col++) {
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
                    col === blockColumn - 1;

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

/**
 * Tạo hàng gạch, tốc độ bóng và độ rộng thanh đỡ cho Level 1 đến Level 5.
 */
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
        bar.width = 110;
    } else if (level === 3) {
        blockRow = 8;
        ballSpeed = 3;
        bar.width = 110;
    } else if (level === 4) {
        blockRow = 9;
        ballSpeed = 3;
        bar.width = 110;
    } else if (level === 5) {
        blockRow = 10;
        ballSpeed = 4;
        bar.width = 110;
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
    drawGame();
}

/**
 * Đưa bóng và thanh đỡ về vị trí ban đầu.
 */
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

/**
 * LV3 các khối gạch di chuyển qua lại.
 */
function moveBlocks() {
    if (currentLevel !== 3) {
        return;
    }

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

/**
 * Tạo quà x2 hoặc x3 từ Level 2 đến Level 5.
 */
function createGift(x, y) {
    if (currentLevel < 2) {
        return;
    }

    if (gifts.length >= maximumGifts) {
        return;
    }

    if (Math.random() > 0.1) {
        return;
    }

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

/**
 * Nhân số lượng bóng khi ăn quà x2 hoặc x3.
 */
function multiplyBalls(number) {
    if (balls.length === 0) {
        return;
    }

    let oldCount = balls.length;

    for (let i = 0; i < oldCount; i++) {
        if (balls.length >= maximumBalls) {
            return;
        }

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

        if (number === 3 && balls.length < maximumBalls) {
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

/**
 * Qùa từ trên rơi xuống, xem thanh đỡ có ăn đc quà hay ko.
 */
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

/**
 * Kiểm tra bóng va chạm với tường trái, phải và phía trên.
 */
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

/**
 * Kiểm tra bóng va chạm với thanh đỡ.
 */
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

/**
 * Kiểm tra bóng va chạm với gạch.
 */
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

/**
 *Xử lý khi bóng rơi khỏi màn hình.
 */
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

/**
 * Kiểm tra đã phá hết gạch chưa và chuyển sang level tiếp theo.
 */
function checkWin() {
    let remaining = 0;

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].visible === true) {
            remaining++;
        }
    }

    if (remaining > 0) {
        return;
    }

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

/**
 * Vẽ toàn bộ gạch lên Canvas, Level 4 xuất hiện thêm gạch có x1 x2 x3 lần đập.
 *
 */
function drawBlocks() {
    gameContext.font = "bold 13px Arial";
    gameContext.textAlign = "center";
    gameContext.textBaseline = "middle";

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
                gameContext.fillStyle = "lightgray";
            } else if (block.hit === 2) {
                gameContext.fillStyle = "gold";
            } else {
                gameContext.fillStyle = "firebrick";
            }
        } else {
            gameContext.fillStyle = block.color;
        }

        gameContext.fillRect(
            x,
            block.y,
            blockWidth,
            blockHeight
        );

        if (currentLevel === 4) {
            if (block.hit === 3) {
                gameContext.fillStyle = "white";
            } else {
                gameContext.fillStyle = "black";
            }

            gameContext.fillText(
                "x" + block.hit,
                x + blockWidth / 2,
                block.y + blockHeight / 2
            );
        }
    }
}

/**
 * Vẽ tất cả bóng lên Canvas.
 */
function drawBalls() {
    gameContext.fillStyle = "white";

    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];

        gameContext.fillRect(
            ball.x - ball.radius,
            ball.y - ball.radius,
            ball.radius * 2,
            ball.radius * 2
        );
    }
}

/**
 * Vẽ thanh đỡ lên Canvas.
 */
function drawBar() {
    gameContext.fillStyle = "white";

    gameContext.fillRect(
        bar.x,
        bar.y,
        bar.width,
        bar.height
    );
}

/**
 * Vẽ quà x2 và x3 lên Canvas.
 */
function drawGifts() {
    gameContext.font = "bold 14px Arial";
    gameContext.textAlign = "center";
    gameContext.textBaseline = "middle";

    for (let i = 0; i < gifts.length; i++) {
        let gift = gifts[i];

        gameContext.fillStyle = "gold";

        gameContext.fillRect(
            gift.x,
            gift.y,
            gift.width,
            gift.height
        );

        gameContext.fillStyle = "black";

        gameContext.fillText(
            "x" + gift.type,
            gift.x + gift.width / 2,
            gift.y + gift.height / 2
        );
    }
}

/**
 * Vẽ lại toàn bộ màn hình game.
 */
function drawGame() {
    gameContext.fillStyle = "black";
    gameContext.fillRect(0, 0, game.width, game.height);

    drawBlocks();
    drawGifts();
    drawBalls();
    drawBar();
}

/**
 *Cập nhật và vẽ game liên tục.
 */
function gameLoop() {
    if (gameStarted === true) {
        moveBlocks();
        moveBalls();
        moveGifts();
        checkWin();
    }

    drawGame();
    requestAnimationFrame(gameLoop);
}

/**
 * Bắt đầu hoặc tiếp tục trò chơi.
 */
function startGame() {
    gameStarted = true;
}

playButton.addEventListener("click", function() {
    startGame();
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
    if (gameStarted === false) {
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