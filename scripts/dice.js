import DiceBox from "https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js";

let Box = new DiceBox({
    assetPath: "assets/",
    origin: "https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/",
    container: "#dice-box",
    theme: "smooth",
    externalThemes: {
        smooth: "https://www.unpkg.com/@3d-dice/theme-smooth@0.2.1",
    },
    offscreen: true,
    scale: 16,
    throwForce: 5,
    gravity: 1,
    mass: 1,
    spinForce: 6,
});

// Used for remembering that the dice roller was initialized
let initialized = false;
let rolledDie = [];

async function rollDice() {
    document.body.style.cursor = 'wait'
    if (!initialized) {
        await Box.init()
        initialized = true;
    }
    Box.clear();
    clearResults();
    rolledDie.length = 0;
    if (rollAttributeDie("attribute-qty")) {
        rolledDie.push({dieType: "attribute", dieLabel: "Attribute", group: 0});
        rollDie("attribute-die-select", "attribute-qty", "attribute-color");
    }
    if (rollDifficultyDie("difficulty-qty")) {
        rolledDie.push({dieType: "difficulty", dieLabel: "Difficulty", group: rolledDie.length});
        rollDie("difficulty-die-select", "difficulty-qty", "difficulty-color");
    }
    if (rollAbilityDie("ability-die-check")) {
        rolledDie.push({dieType: "ability", dieLabel: "Ability", group: rolledDie.length});
        Box.add("1d6", {themeColor: document.getElementById("ability-color").value})
    }
}

function rollDie(dieSelectName, qtySelectName, dieColorPickerName) {
    const dieSelect = document.getElementById(dieSelectName)
    const qtySelect = document.getElementById(qtySelectName);
    const qty = qtySelect.options[qtySelect.selectedIndex].value;
    const die = dieSelect.options[dieSelect.selectedIndex].value;
    if (qty > 0) {
        Box.add(`${qty}${die}`, {themeColor: document.getElementById(dieColorPickerName).value});
    }
}

function rollAttributeDie(qtySelectName) {
    const qtySelect = document.getElementById(qtySelectName);
    const qty = qtySelect.options[qtySelect.selectedIndex].value;
    return qty > 0;
}

function rollDifficultyDie(qtyName) {
    const qtySelect = document.getElementById(qtyName);
    const qty = qtySelect.options[qtySelect.selectedIndex].value;
    return qty > 0;
}

function rollAbilityDie(checkboxName) {
    return document.getElementById(checkboxName).checked
}

const button = document.getElementById("rollem");
button.addEventListener("click", (e) => {
    rollDice();
});

Box.onRollComplete = (results) => {
    displayResults(results);
    document.body.style.cursor = 'default'
};

function displayResults(results) {
    var display = []
    var dieValues = []
    rolledDie.forEach((roll) => {
        results[roll.group].rolls.forEach((die) => {
            dieValues.push(die.value)
        });
        dieValues.sort(function(a, b){return b-a});
        display.push({roll: roll, values: Array.from(dieValues)})
        dieValues.length = 0;
    });

    display.forEach((toDisplay) => {
        var resultDisplayArea = document.getElementById(`${toDisplay.roll.dieType}-result`);
        resultDisplayArea.textContent = `${toDisplay.roll.dieLabel}: ${toDisplay.values.join(", ")}`
    });
}

function clearResults() {
    const resultArea = document.getElementById("results-area");
    const allElements = resultArea.querySelectorAll("*");
    allElements.forEach(element => {
       if (element.id.endsWith("-result")) {
           element.textContent = null;
       }
    });
}
