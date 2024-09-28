function saveCharacter() {
    if (!document.getElementById('name').value) {
        return;
    }
    const storageKey = makeStorageKey(document.getElementById('name').value);
    const form = document.getElementById("character");
    const jsonData = {};

    // Handle text inputs and selects
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
        if (form.elements[key].type !== 'checkbox') {
            jsonData[key] = value;
        }
    }

    // Handle color pickers
    const colorpickers = form.querySelectorAll('input[type="color"]');
    colorpickers.forEach(picker => {
        jsonData[picker.id] = picker.value;
    })

    // Handle checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        jsonData[checkbox.id] = checkbox.checked;
    });

    localStorage.setItem(storageKey, JSON.stringify(jsonData));
    populateCharacterSelect('character-select');
    hasUnsavedChanges = false;
}

function loadCharacter(characterName) {
    if (hasUnsavedChanges && !confirm("You have unsaved changes. Are you sure you want to load a different character?")) {
        return;
    }

    const storageKey = makeStorageKey(characterName);
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
        const jsonData = JSON.parse(storedData);
        const form = document.getElementById("character");

        // Populate form fields
        for (const [key, value] of Object.entries(jsonData)) {
            const element = form.elements[key];
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        }
        hasUnsavedChanges = false;
    } else {
        console.log(`No data found for character: ${characterName}`);
    }
}

function listCharacters() {
    const characters = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(storageKeyPrefix)) {
            const characterData = JSON.parse(localStorage.getItem(key));
            characters.push({
                key: key,
                name: characterData.name
            });
        }
    }
    return characters;
}

function deleteCharacter(characterName) {
    const storageKey = makeStorageKey(characterName);
    localStorage.removeItem(storageKey);
    console.log(`Character "${characterName}" has been deleted.`);
    // Refresh the character select dropdown
    populateCharacterSelect('character-select');
    clearForm();
    hasUnsavedChanges = false;
}

function confirmAndDeleteCharacter(selectId) {
    const select = document.getElementById(selectId);
    const selectedOption = select.options[select.selectedIndex];
    if (select.selectedIndex === 0) {
        alert("Select a character to delete.");
        return false;
    }

    if (confirm(`Are you sure you want to delete the character "${selectedOption.text}"? This action cannot be undone.`)) {
        deleteCharacter(selectedOption.text);
        return true;
    }
    return false;
}

function populateCharacterSelect(selectId) {
    const selectElement = document.getElementById(selectId);
    const characters = listCharacters();

    // Clear existing options
    selectElement.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a character';
    defaultOption.value = '';
    selectElement.add(defaultOption);

    // Add an option for each character
    characters.forEach(character => {
        const option = document.createElement('option');
        option.text = character.name;
        option.value = character.key;
        selectElement.add(option);
    });
}
