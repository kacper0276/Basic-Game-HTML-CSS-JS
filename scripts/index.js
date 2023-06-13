const gameboard = document.querySelector("#gameboard");
const player = document.querySelector("#player");
const cartridgeList = [];
const enemyList = [];

function movePlayer(direction) {
  const newPosition = player.offsetLeft + direction * 10; // offSetLeft zwraca odległość od swojego pojemnika
  const { left, right } = gameboard.getBoundingClientRect(); // Zwraca odległość od okna przeglądarki
  const minLeft = player.offsetWidth; // Szerokość elementu - offSetWidth
  const maxRight = right - left - minLeft;

  if (newPosition >= 0 && newPosition < maxRight) {
    player.style.left = `${newPosition}px`;
  }
}

function shoot() {
  const cartridge = document.createElement("div");
  cartridge.classList.add("cart");
  cartridge.style.left = `${player.offsetLeft + player.offsetWidth / 2}px`;
  cartridge.style.bottom = `${player.offsetHeight}px`;
  cartridgeList.push(cartridge);
  gameboard.appendChild(cartridge);
}

function bulletFlight() {
  for (let i = 0; i < cartridgeList.length; i++) {
    const actualBuller = cartridgeList[i];
    actualBuller.style.top = `${actualBuller.offsetTop - 10}px`;
    if (actualBuller.offsetTop <= 0) {
      cartridgeList.splice(i, 1);
      i--;
      actualBuller.remove();
    } else {
      checkCollision(actualBuller);
    }
  }
}

function createEnemy() {
  const changeToCreate = Math.round(Math.random());

  if (changeToCreate) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.top = 0;
    enemy.style.left = `${Math.floor(
      Math.random() * (gameboard.offsetWidth - 80)
    )}px`;
    enemyList.push(enemy);
    gameboard.appendChild(enemy);
  }
}

function moveEnemy() {
  for (let i = 0; i < enemyList.length; i++) {
    const actualEnemy = enemyList[i];
    actualEnemy.style.top = `${actualEnemy.offsetTop + 10}px`;

    if (actualEnemy.offsetTop >= gameboard.offsetHeight) {
      alert("Koniec gry");
    }
  }
}

function checkCollision(bullet) {
  for (let i = 0; i < enemyList.length; i++) {
    const actualEnemy = enemyList[i].getBoundingClientRect();
    const { left, right, top } = bullet.getBoundingClientRect();

    if (
      left >= actualEnemy.left &&
      right <= actualEnemy.right &&
      top < actualEnemy.bottom
    ) {
      const index = cartridgeList.indexOf(bullet);
      cartridgeList.splice(index, 1);
      bullet.remove();

      enemyList[i].remove();
      enemyList.splice(i, 1);
      break;
    }
  }
}

// Bind keyboard
window.addEventListener("keydown", bindKeyboard);

function bindKeyboard(e) {
  switch (e.key) {
    case "a":
      movePlayer(-1);
      break;
    case "d":
      movePlayer(1);
      break;

    case " ":
      shoot();
      break;
  }
}

// Intervals
setInterval(bulletFlight, 50);
createEnemy();
setInterval(createEnemy, 3000);
setInterval(moveEnemy, 500);
