const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    Arrow: false
};

let player = {
    playing: false,
    speed: 5,
    score: 0
};

let enemyCarObj = {
    speed : 10
};

startScreen.addEventListener("click", startGame);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

function startGame() {
    // console.log("Game Started");

    startScreen.classList.add("hide"); // hide start scrren
    gameArea.classList.remove("hide"); // remove hide from game area

    player.playing = true;

    for (let index = 0; index < 10; index++) {
        let div = document.createElement("div");
        div.classList.add("line");
        div.y = index*150;
        div.style.top = (index * 150) + 'px';
        gameArea.appendChild(div);
    }

    let car = document.createElement("div"); // Create Car
    car.innerText = "car";
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // Create enemy cars
    for (let index = 0; index < 5; index++) {
        let enemyCar = document.createElement("div");
        enemyCar.classList.add("enemy_car");
        enemyCar.y = ((index+1)*600)*-1;
        enemyCar.style.top = enemyCar.y + 'px';
        enemyCar.style.left = Math.floor(Math.random()*400)+'px';
        enemyCar.style.backgroundColor = "red";
        gameArea.appendChild(enemyCar);
    }

    requestAnimationFrame(playGame); // Start animation
}

function endGame(){
    player.playing = false;
    score.innerHTML = "GAME OVER :( You Scored:"+Math.floor(player.score)
    startScreen.classList.remove("hide");
    startScreen.innerText = "Click Here To Play Again";
    gameArea.classList.add("hide");
    gameArea.innerHTML = "";
}

function pressOn(e) {
    e.preventDefault();
    //console.log(e.key) // Returns ArrowUp, ArrowDown etc
    keys[e.key] = true; // set key to true for the clicked button
    // player.speed++;
}

function pressOff(e) {
    e.preventDefault();
    //console.log(e.key) // Returns ArrowUp, ArrowDown etc
    keys[e.key] = false; // set key to true for the clicked button
    // player.speed = 1;
}

function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(function (item) {
        if(item.y >= 1500){
            item.y -= 1500
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function moveEnemyCars(car) {
    let enemies = document.querySelectorAll(".enemy_car");
    enemies.forEach(function (enemy) {
        if(detectCollision(car,enemy)){
            console.log("Wrecked")
            endGame();
        }
        if(enemy.y >= 1500){
            enemy.y = -600
            enemy.style.left = Math.floor(Math.random()*400)+'px';
        }
        enemy.y += enemyCarObj.speed;
        enemy.style.top = enemy.y + "px";
    });
}

function detectCollision(a,b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) || 
        (aRect.top > bRect.bottom) || 
        (aRect.right < bRect.left) || 
        (aRect.left > bRect.right)
    )
}

function playGame() {
    let car = document.querySelector(".car");

    // ANimate the white lines on road
    moveLines()

    //Animate enemy cars
    moveEnemyCars(car)

    let road = gameArea.getBoundingClientRect();

    if (player.playing) {
        // Handle key presses
        if (keys.ArrowUp && player.y > road.top) {
            player.y -= player.speed;
        }

        if (keys.ArrowDown && player.y < (road.bottom - 120)) {
            player.y += player.speed;
        }

        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }

        if (keys.ArrowRight && player.x < (road.width - 50)) {
            player.x += player.speed;
        }

        // Move Car
        car.style.left = player.x + 'px';
        car.style.right = player.x + 'px';

        car.style.top = player.y + 'px';
        car.style.down = player.y + 'px';

        requestAnimationFrame(playGame);

        //Update Players Score
        player.score += 0.1;
        score.innerText = 'Score: ' + Math.floor(player.score);
    }
}