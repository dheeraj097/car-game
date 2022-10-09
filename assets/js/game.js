const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const bgm = document.getElementById("car-bgm");
const carHit = document.getElementById("crash");

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

let player = {
  playing: false,
  speed: 5,
  score: 0,
};

let enemyCarObj = {
  speed: 10,
};

// event listeners
startScreen.addEventListener("click", startGame);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

function startGame() {
  player.score = 0;
  // console.log("Game Started");
  gameArea.innerHTML = "";
  startScreen.classList.add("hide"); // hide start scrren
  gameArea.classList.remove("hide"); // remove hide from game area

  player.playing = true;

  // Play engine on sound
  let audio = document.getElementById("car-start");
  audio.play();
  let audio2 = document.getElementById("car-driving");
  audio2.play();
  bgm.volume = 0.3;
  bgm.play();

  for (let index = 0; index < 10; index++) {
    let div = document.createElement("div");
    div.classList.add("line");
    div.y = index * 150;
    div.style.top = index * 150 + "px";
    gameArea.appendChild(div);
  }

  let car = document.createElement("div"); // Create Car
  // car.innerText = "car";
  car.setAttribute("class", "car");
  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  // Create enemy cars
  for (let index = 0; index < 5; index++) {
    let enemyCar = document.createElement("div");
    enemyCar.classList.add("enemy_car");
    enemyCar.y = (index + 1) * 600 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.left = Math.floor(Math.random() * 400) + "px";
    // enemyCar.style.backgroundColor = "red";
    gameArea.appendChild(enemyCar);
  }

  countDown();
}

function countDown() {
  const countDownNumber = document.getElementById("count-down-numbers");
  countDownNumber.classList.remove("hide");
  countDownNumber.innerHTML = 3;
  var timer = setInterval(function () {
    let num = countDownNumber.innerHTML;
    if (parseInt(num) > 0) {
      countDownNumber.innerHTML = parseInt(num) - 1;
    } else {
      clearTimeout(timer);
      countDownNumber.classList.add("hide");
      setTimeout(requestAnimationFrame(playGame), 10000); // Start animation
    }
  }, 1000);
}

function endGame() {
  player.playing = false;

  let audio2 = document.getElementById("car-driving");
  audio2.pause();

  score.innerHTML = "GAME OVER :( You Scored:" + Math.floor(player.score);
  startScreen.classList.remove("hide");
  startScreen.innerText = "Click Here To Play Again or Press Space Bar";

  enemyCarObj.speed = 10;
  // gameArea.classList.add("hide");
}

function pressOn(e) {
  //   e.preventDefault();
  if (e.code === "Space") {
    startGame();
  }
  //   console.log(e.key); // Returns ArrowUp, ArrowDown etc
  keys[e.key] = true; // set key to true for the clicked button
  // player.speed++;
}

function pressOff(e) {
  e.preventDefault();
  //console.log(e.key) // Returns ArrowUp, ArrowDown etc
  keys[e.key] = false; // set key to false for the clicked button
  // player.speed = 1;
}

function moveLines() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (item) {
    if (item.y >= 1500) {
      item.y -= 1500;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function moveEnemyCars(car) {
  let enemies = document.querySelectorAll(".enemy_car");
  enemyCarObj.speed += 0.001;
  enemies.forEach(function (enemy) {
    if (detectCollision(car, enemy)) {
      console.log("Wrecked");
      carHit.volume = "0.5";
      carHit.play();
      endGame();
    }
    if (enemy.y >= 1500) {
      enemy.y = -600;
      enemy.style.left = Math.floor(Math.random() * 400) + "px";
    }
    enemy.y += enemyCarObj.speed;
    enemy.style.top = enemy.y + "px";
  });
}

function detectCollision(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function playGame() {
  let car = document.querySelector(".car");

  // ANimate the white lines on road
  moveLines();

  //Animate enemy cars
  moveEnemyCars(car);

  let road = gameArea.getBoundingClientRect();

  if (player.playing) {
    // Handle key presses
    if (keys.ArrowUp && player.y > road.top) {
      player.y -= player.speed;
    }

    if (keys.ArrowDown && player.y < road.bottom - 120) {
      player.y += player.speed;
    }

    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }

    if (keys.ArrowRight && player.x < road.width - 50) {
      player.x += player.speed;
    }

    // Move Car
    car.style.left = player.x + "px";
    car.style.right = player.x + "px";

    car.style.top = player.y + "px";
    car.style.down = player.y + "px";

    //Update Players Score
    player.score += 0.1;
    score.innerText = "Score: " + Math.floor(player.score);

    requestAnimationFrame(playGame);
  }
}
