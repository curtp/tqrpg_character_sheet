
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(50, textarea.scrollHeight) + 'px';
}

function clearForm() {
    const form = document.getElementById("character");
    Array.from(form.elements).forEach(element => {
        if (element.type !== 'submit' && element.type !== 'button') {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else if (element.className === 'attribute-select') {
                element.selectedIndex = 0;
            } else {
                element.value = '';
            }
        }
    });
    hasUnsavedChanges = false;
}


function attachCharacterSelectListener(selectId) {
    const selectElement = document.getElementById(selectId);
    selectElement.addEventListener('change', function() {
        if (this.value) {
            // Extract the character name from the storage key
            const characterName = this.value.replace(storageKeyPrefix, '');
            loadCharacter(characterName);
        }
    });
}

function attachFormChangeListeners() {
    const form = document.getElementById("character");
    Array.from(form.elements).forEach(element => {
        element.addEventListener('change', () => {
            hasUnsavedChanges = true;
        });
        if (element.type === 'text' || element.type === 'textarea') {
            element.addEventListener('input', () => {
                hasUnsavedChanges = true;
            });
        }
    });
}

function prepNameForKey(name) {
    return name.toLowerCase().replace(/\s/g, "");
}

function setAttributeDieSizeInDiceModal(attributeName) {
    const currentDieSelect = document.getElementById(attributeName);
    const dieModalSelect = document.getElementById("attribute-die-select");
    const option = currentDieSelect.options[currentDieSelect.selectedIndex];
    dieModalSelect.options[dieModalSelect.options.length] = new Option(`${capitalizeFirstLetter(attributeName)} (${option.value})`, option.value);
}

function openDiceTray() {
    // Remove all die from the attribute die select
    const select = document.getElementById("attribute-die-select");
    while (select.options.length > 0) {
        select.remove(0);
    }

    // Display the current dice sizes in the dice roller modal
    setAttributeDieSizeInDiceModal("mind");
    setAttributeDieSizeInDiceModal("body");
    setAttributeDieSizeInDiceModal("will");

    const modal = document.getElementById("diceModal");
    modal.style.display = "block";
}

function closeDiceTray() {
    const modal = document.getElementById("diceModal");
    modal.style.display = "none";
}

function capitalizeFirstLetter(string) {
    return string.toLowerCase().charAt(0).toUpperCase() + string.slice(1);
}

let hasUnsavedChanges = false;
const storageKeyPrefix = "TQRPG_Character_";

// Add event listeners for auto-resizing textareas
document.getElementById('description').addEventListener('input', function() {
    autoResize(this);
});
document.getElementById('gear').addEventListener('input', function() {
    autoResize(this);
});

// Setup the events for listing and loading characters
document.addEventListener('DOMContentLoaded', function() {
    populateCharacterSelect('character-select');
    attachCharacterSelectListener('character-select');
    attachFormChangeListeners();
});

// Initialize textareas
autoResize(document.getElementById('description'));
autoResize(document.getElementById('gear'));