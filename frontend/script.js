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

createMorseTable(morseTables.english, "morse-table");


let pressStartTime = null;
let currentMorse = "";

const SHORT_LIMIT = 250;

document.addEventListener("keydown", (event) => {
    if (event.code !== "Space" || event.repeat) {
        return;
    }

    pressStartTime = performance.now();
});

document.addEventListener("keyup", (event) => {
    if (event.code !== "Space" || pressStartTime === null) {
        return;
    }

    const pressDuration = performance.now() - pressStartTime;

    let symbol;

    if (pressDuration < SHORT_LIMIT) {
        symbol = ".";
    } else {
        symbol = "-";
    }

    currentMorse += symbol;

    console.log(`입력 시간: ${pressDuration.toFixed(2)}ms`);
    console.log(`판정: ${symbol}`);
    console.log(`현재 Morse: ${currentMorse}`);

    pressStartTime = null;
});