function createMorseTable(data, targetId) {
    const target = document.getElementById(targetId);

    const table = document.createElement("table");

    for (const [character, code] of Object.entries(data)) {
        const row = document.createElement("tr");

        const characterCell = document.createElement("td");
        characterCell.textContent = character;

        const codeCell = document.createElement("td");
        codeCell.textContent = code;

        row.appendChild(characterCell);
        row.appendChild(codeCell);

        table.appendChild(row);
    }

    target.appendChild(table);
}

createMorseTable(morseTables.english, "english-table");
createMorseTable(morseTables.number, "number-table");