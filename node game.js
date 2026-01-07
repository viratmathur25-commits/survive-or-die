// ==================================
// 🏕️ ULTIMATE SURVIVAL GAME (Node.js)
// Copy → Paste → Run
// ==================================

const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ----- GAME STATE -----
let state = {
  day: 1,
  health: 100,
  hunger: 100,
  water: 100,
  inventory: {
    food: 1,
    water: 1,
    wood: 0,
    weapon: false
  }
};

// ----- DISPLAY -----
function showStats() {
  console.clear();
  console.log("🏕️ ULTIMATE SURVIVAL GAME");
  console.log("==============================");
  console.log(`🌞 Day: ${state.day}`);
  console.log(`❤️ Health: ${state.health}`);
  console.log(`🍗 Hunger: ${state.hunger}`);
  console.log(`💧 Water: ${state.water}`);
  console.log("------------------------------");
  console.log("🎒 Inventory:");
  console.log(`Food: ${state.inventory.food}`);
  console.log(`Water: ${state.inventory.water}`);
  console.log(`Wood: ${state.inventory.wood}`);
  console.log(`Weapon: ${state.inventory.weapon ? "Yes" : "No"}`);
  console.log("==============================");
}

// ----- SAVE / LOAD -----
function saveGame() {
  fs.writeFileSync("save.json", JSON.stringify(state, null, 2));
  console.log("💾 Game Saved!");
}

function loadGame() {
  if (fs.existsSync("save.json")) {
    state = JSON.parse(fs.readFileSync("save.json"));
    console.log("📂 Game Loaded!");
  } else {
    console.log("❌ No save file found.");
  }
}

// ----- GAME OVER -----
function gameOver() {
  console.log("\n💀 GAME OVER 💀");
  console.log(`You survived ${state.day - 1} days.`);
  rl.close();
}

// ----- RANDOM EVENTS -----
function randomEvent() {
  const roll = Math.random();
  if (roll < 0.2) {
    console.log("🌧️ Storm! You lose water.");
    state.water -= 10;
  } else if (roll < 0.35) {
    console.log("🐗 Wild animal attack!");
    enemyEncounter();
  }
}

// ----- ENEMY -----
function enemyEncounter() {
  let enemyHealth = 30;
  console.log("🧟 An enemy appears!");

  while (enemyHealth > 0 && state.health > 0) {
    const damage = state.inventory.weapon ? 15 : 8;
    enemyHealth -= damage;
    state.health -= 10;
    console.log(`⚔️ You hit the enemy (-${damage})`);
  }

  if (state.health <= 0) {
    gameOver();
  } else {
    console.log("🏆 Enemy defeated!");
    state.inventory.food++;
  }
}

// ----- ACTIONS -----
function eat() {
  if (state.inventory.food > 0) {
    state.inventory.food--;
    state.hunger = Math.min(state.hunger + 25, 100);
    console.log("🍎 You ate food.");
  } else {
    console.log("❌ No food.");
  }
  nextDay();
}

function drink() {
  if (state.inventory.water > 0) {
    state.inventory.water--;
    state.water = Math.min(state.water + 25, 100);
    console.log("💧 You drank water.");
  } else {
    console.log("❌ No water.");
  }
  nextDay();
}

function gather() {
  console.log("🌲 You gathered resources...");
  state.inventory.wood++;
  if (Math.random() > 0.5) state.inventory.food++;
  if (Math.random() > 0.6) state.inventory.water++;
  nextDay();
}

function craft() {
  if (state.inventory.wood >= 3 && !state.inventory.weapon) {
    state.inventory.wood -= 3;
    state.inventory.weapon = true;
    console.log("🛠️ You crafted a weapon!");
  } else {
    console.log("❌ Not enough wood or already have weapon.");
  }
  nextDay();
}

// ----- DAY CYCLE -----
function nextDay() {
  state.hunger -= 10;
  state.water -= 10;

  if (state.hunger <= 0 || state.water <= 0) {
    state.health -= 15;
    console.log("⚠️ Starving or dehydrated!");
  }

  if (state.health <= 0) {
    gameOver();
    return;
  }

  randomEvent();
  state.day++;
  setTimeout(menu, 1000);
}

// ----- MENU -----
function menu() {
  showStats();
  rl.question(
    "\nChoose:\n" +
    "1️⃣ Eat\n" +
    "2️⃣ Drink\n" +
    "3️⃣ Gather\n" +
    "4️⃣ Craft Weapon\n" +
    "5️⃣ Save Game\n" +
    "6️⃣ Load Game\n" +
    "👉 ",
    choice => {
      switch (choice) {
        case "1": eat(); break;
        case "2": drink(); break;
        case "3": gather(); break;
        case "4": craft(); break;
        case "5": saveGame(); setTimeout(menu, 1000); break;
        case "6": loadGame(); setTimeout(menu, 1000); break;
        default: menu();
      }
    }
  );
}

// ----- START -----
console.log("🌍 Welcome to the Ultimate Survival Game!");
setTimeout(menu, 1000);
