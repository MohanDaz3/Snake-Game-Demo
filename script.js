const playBoard =document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// getting High score from the local storage.
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // passing a random 1-30 value as food position.
    foodX = Math.floor(Math.random()*30) + 1;
    foodY = Math.floor(Math.random()*30) + 1;

}

const GameOver = () => {
    // clearing the timer and reloadinig the pageon game over.
    clearInterval(setIntervalId);
    alert("Game Over!!!press ok to restart...");
    location.reload();
}

const changeDirection = e =>{
    // changing direction and value based on the keys pressed.
    if(e.key === "ArrowUp" && velocityY !=1){
        velocityX = 0;
        velocityY = -1;
    } else if(e.key ==="ArrowDown" && velocityY !=-1){
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX !=1){
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}

// calling ChangeDirection on each key click and passing key dataset value as an object.
controls.forEach(button => button.addEventListener("click", () => changeDirection({key:button.dataset.key})));

const initGame = () =>{
    if(gameOver)return GameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // checking if the snake hit the food.
    if(snakeX === foodX && snakeY === foodY){
        updateFoodPosition();
        snakeBody.push([foodY,foodX]); //pushing food position to snake bodys array.
        score++; //incrementing tghe score
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score",highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High-Score: ${highScore}`;
    }
    // updating the snakes head position based on the current velocity.
    snakeX += velocityX;
    snakeY += velocityY;

    // shifting forward the values of the elements in the snake body by one.
    for( let i = snakeBody.length -1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1];
    }
    
    snakeBody[0] = [snakeX,snakeY]; //setting first element of snakes body to current snake position.

    // checking if the snakes head is out of the wall,if so setting gameOver to true.
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY >30){
        return gameOver = true;
    }

    for( let i=0; i < snakeBody.length; i++){
        // adding a div for each part of snakes body.
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // checking if the snakes head touches the body,if so returning gameOver true.
        if(i !==0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup",changeDirection);