
var theCanvas = document.getElementById("brickCanvas"),
    ctx = theCanvas.getContext("2d");

theCanvas.width = 500;
theCanvas.height = 500;

var movingBlockW = 100;
var movingBlockH = 20;
var blockMarginBottom = 10;
var ballR = 8;
var playerLife = 3;
var level = 1;
var lastLevel = 3;
var leftButton = false, rightButton = false;
var point = 0;
const breakPoint = 10;
var gameOver = false;
let playAgainMessage = 'Game Over! Play again by losing all lives'
let losePlayAgain = 'Game Over! Please try again'

//To make moving brick block
const movingBlock = {
    x : (theCanvas.width/2) - (movingBlockW/2),
    y : (theCanvas.height/1) - blockMarginBottom - movingBlockH,
    width: movingBlockW,
    height: movingBlockH,
    dx: 5
}

//to draw the moving block
function drawMovingBlock (){
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fillRect(movingBlock.x, movingBlock.y, movingBlock.width, movingBlock.height);
    ctx.strokeStyle = "#696969";
    ctx.strokeRect(movingBlock.x, movingBlock.y, movingBlock.width, movingBlock.height);
}

//To control the moving brick
document.addEventListener("keydown", function(event){
    if(event.keyCode == 37){
        leftButton = true;
    }else if(event.keyCode == 39){
        rightButton = true;
    }
});

document.addEventListener("keyup", function(event){
    if(event.keyCode == 37){
        leftButton = false;
    }else if(event.keyCode == 39){
        rightButton = false;
    }
});

//Moving the block
function moveBlock (){
    if(rightButton && movingBlock.x + movingBlock.width < theCanvas.width){
        movingBlock.x += movingBlock.dx;
    } else if (leftButton && movingBlock.x > 0){
        movingBlock.x -= movingBlock.dx;
    }
}

//To make the ball
const ball = {
    x: theCanvas.width/2,
    y: movingBlock.y - ballR,
    r: ballR,
    velocity: 4,
    dx: 3*(Math.random()*2 - 1),
    dy: -3
}

//To draw the ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fillStyle = "#FA8072";
    ctx.fill();
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();
    ctx.closePath();
}

//Moving the ball
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

//Collision Detection of Canvas Wall and Ball
function ballWallColDetection(){
    if(ball.x + ball.r > theCanvas.width || ball.x - ball.r < 0){
        ball.dx = -ball.dx;
    }
    if(ball.y - ball.r < 0){
        ball.dy = -ball.dy;
    }
    if(ball.y + ball.r > theCanvas.height){
        playerLife --; //player lose life
        resetBall();
    }
}

//Collision of ball on the moving block
function ballBlockCollision(){
    if(ball.x > movingBlock.x && ball.x < (movingBlock.x + movingBlock.width)
       && ball.y > movingBlock.y && ball.y < (movingBlock.y + movingBlock.height)){
            let collisionPoint = ball.x - (movingBlock.x + (movingBlock.width/2));
            collisionPoint = collisionPoint/(movingBlock.width/2);

            let angle = collisionPoint * (Math.PI/3);
            ball.dx = ball.velocity * Math.sin(angle);
            ball.dy = -ball.velocity * Math.cos(angle);
    }
}



//to reset the ball back to the block after losing a life
function resetBall(){
    ball.x = theCanvas.width/2;
    ball.y = movingBlock.y - ballR;
    ball.dx = 3;
    ball.dy = -3;
}

//Load image through the loop
const backImage = new Image();
backImage.src = "light-blue-background.png";

//-------------------------------------------------------------------------

//breaking blocks
const breakingBlock = {
    row: 3,
    column: 6,
    width: 50,
    height: 20,
    offsetLeft: 30,
    offsetTop: 20,
    marginTop: 20,
}

breakingblock = [];
//for creating the breaking block
function createBreakingBlock() {
    for (r = 0; r < breakingBlock.row; r++) {
        breakingBlock[r] = [];
        for ( c = 0; c < breakingBlock.column; c++) {
            breakingBlock[r][c] = {
                x: c * (breakingBlock.offsetLeft + breakingBlock.width) + breakingBlock.offsetLeft,
                y: r * (breakingBlock.offsetLeft + breakingBlock.height) + breakingBlock.offsetTop +
                    breakingBlock.marginTop,
                status: true
            };
        }
    }
}
createBreakingBlock();

//Drawing breaking blocks
function drawBreakingBlock(){
    for (r = 0; r < breakingBlock.row; r++) {
        for (c = 0; c < breakingBlock.column; c++) {
            if(breakingBlock[r][c].status){
            ctx.fillStyle = "#00BFFF";
            ctx.fillRect(breakingBlock[r][c].x, breakingBlock[r][c].y, breakingBlock.width, breakingBlock.height);
            ctx.strokeStyle ="#000080";
            ctx.strokeRect(breakingBlock[r][c].x, breakingBlock[r][c].y, breakingBlock.width, breakingBlock.height);
            }
        }
    }
}

//Collision Detection of ball and breaking bricks
function ballBreakingBlockCollision(){
    for (r = 0; r < breakingBlock.row; r++) {
        for (c = 0; c < breakingBlock.column; c++) {
            block = breakingBlock[r][c];
            if (block.status) {
                if (ball.x + ball.r > block.x && ball.x - ball.r < block.x + breakingBlock.width &&
                    ball.y + ball.r > block.y && ball.y - ball.r < block.y + breakingBlock.height) {
                    block.status = false;
                    ball.dy = -ball.dy;
                    point += breakPoint;
                }
            }
        }
    }
}

//Show points, lives and level
function gameStats(text, textX,textY){
    ctx.fillStyle = "rgb(220,20,60)";
    ctx.font = "20px Times";
    ctx.fillText(text, textX, textY);

}

//Show the game is over after all life becomes 0
function endOfGame(){
    if(playerLife <= 0){
        gameOver = true;
        gameStats(losePlayAgain, 55, theCanvas.height/2);
        //Game reloads game after 5 seconds
        setTimeout(function(){location.reload()}, 5000);
    }
}

//Change level after clearing all blocks after one level
function changeLevel(){
    allBlocksGone = true;
    for(r = 0; r < breakingBlock.row; r++){
        for(c = 0; c < breakingBlock.column; c++){
            allBlocksGone = allBlocksGone && !breakingBlock [r][c].status;
        }
        if(allBlocksGone){
            if(level >= lastLevel){
                gameOver = true;
                gameStats(playAgainMessage, 55, theCanvas.height/2);
                //Game reloads after 5 seconds
                setTimeout(function(){location.reload()}, 5000)
                return;
            }
            breakingBlock.row++;
            createBreakingBlock();
            ball.velocity += 1;
            resetBall();
            level ++;
        }
    }
}

//-----------------------------------------------------------------------

//Main Function to draw the objects
function drawObjects(){
    drawMovingBlock();
    drawBall();
    drawBreakingBlock();
    gameStats('Points:', 20, 20);
    gameStats(point, 75, 20);
    gameStats('Lives:', 420, 20);
    gameStats(playerLife, 470, 20);
    gameStats('Level:', 220, 20);
    gameStats(level, 270, 20);
}

//Update the drawing object function
function update(){
    moveBlock();
    moveBall();
    ballWallColDetection();
    ballBlockCollision();
    ballBreakingBlockCollision();
    changeLevel();
    endOfGame();
}

//Loop the Whole Game
function loop(){
    ctx.drawImage(backImage, 0, 0, theCanvas.width, theCanvas.height);
    drawObjects();
    update();
    if (! gameOver) {
        requestAnimationFrame(loop);
    }
}
loop();