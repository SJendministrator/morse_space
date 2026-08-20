function createMorseTable(data, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

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

// morseTables 객체 존재 여부 확인 후 생성
if (typeof morseTables !== "undefined" && morseTables.english) {
    createMorseTable(morseTables.english, "morse-table");
}


// ==============================
// 변수
// ==============================

let pressStartTime = null;
let currentMorse = "";
let decodedText = "";

const SHORT_LIMIT = 200;


// ==============================
// HTML 요소
// ==============================

const currentMorseElement = document.getElementById("current-morse");
const decodedTextElement = document.getElementById("decoded-text");
const durationElement = document.getElementById("duration");
const signalTypeElement = document.getElementById("signal-type");
const spaceStatusElement = document.getElementById("space-status");
const backspaceButton = document.getElementById("backspace");
const clearResultButton = document.getElementById("clear-result");


// ==============================
// Morse → 문자 변환
// ==============================

function decodeMorse(morse) {
    if (typeof morseTables === "undefined" || !morseTables.english) {
        return "?";
    }

    for (const [character, code] of Object.entries(morseTables.english)) {
        if (code === morse) {
            return character;
        }
    }

    return "?";
}


// ==============================
// 키 입력 시작
// ==============================

document.addEventListener("keydown", (event) => {
    // Spacebar 스크롤 방지
    if (event.code === "Space") {
        event.preventDefault();
    }

    // 1. Spacebar 입력 시작
    if (event.code === "Space" && !event.repeat) {
        pressStartTime = performance.now();
        if (spaceStatusElement) {
            spaceStatusElement.textContent = "Spacebar 입력 중";
        }
        return;
    }

    // 2. Comma (,) 입력 시 띄어쓰기 추가
    if (event.code === "Comma") {
        if (decodedText !== "" && !decodedText.endsWith(" ")) {
            decodedText += " ";
            if (decodedTextElement) {
                decodedTextElement.textContent = decodedText;
            }
        }
        return;
    }

    // 3. A 또는 Q → 현재 입력된 모스부호 확정 및 문자 변환
    if (event.code === "KeyA" || event.code === "KeyQ") {
        if (currentMorse === "") {
            return;
        }

        // Morse → 문자
        const character = decodeMorse(currentMorse);

        // 문자열에 추가
        decodedText += character;

        // UI 갱신
        if (decodedTextElement) {
            decodedTextElement.textContent = decodedText;
        }

        console.log(`완성된 Morse: ${currentMorse}`);
        console.log(`문자: ${character}`);
        console.log(`현재 결과: ${decodedText}`);

        // 현재 Morse 상태 초기화
        currentMorse = "";
        if (currentMorseElement) {
            currentMorseElement.textContent = "-";
        }
        if (signalTypeElement) {
            signalTypeElement.textContent = "문자 입력 완료";
        }
    }
});


// ==============================
// Spacebar 입력 종료
// ==============================

document.addEventListener("keyup", (event) => {
    if (event.code !== "Space" || pressStartTime === null) {
        return;
    }

    // 누른 시간 계산
    const pressDuration = performance.now() - pressStartTime;

    // 단음 / 장음 판정
    let symbol;
    if (pressDuration < SHORT_LIMIT) {
        symbol = ".";
        if (signalTypeElement) signalTypeElement.textContent = "단음 (.)";
    } else {
        symbol = "-";
        if (signalTypeElement) signalTypeElement.textContent = "장음 (-)";
    }

    // Morse에 추가
    currentMorse += symbol;

    // 화면 표시
    if (currentMorseElement) currentMorseElement.textContent = currentMorse;
    if (durationElement) durationElement.textContent = `${pressDuration.toFixed(2)} ms`;
    if (spaceStatusElement) spaceStatusElement.textContent = "Spacebar를 눌러주세요";

    // 시간 초기화
    pressStartTime = null;
});


// ==============================
// 버튼 이벤트
// ==============================

if (backspaceButton) {
    backspaceButton.addEventListener("click", () => {
        // 현재 입력 중인 Morse가 있다면 마지막 기호 삭제
        if (currentMorse !== "") {
            currentMorse = currentMorse.slice(0, -1);
            if (currentMorseElement) {
                currentMorseElement.textContent = currentMorse || "-";
            }
            return;
        }

        // 완성된 문자 하나 삭제
        if (decodedText !== "") {
            decodedText = decodedText.slice(0, -1);
            if (decodedTextElement) {
                decodedTextElement.textContent = decodedText || "-";
            }
        }
    });
}

if (clearResultButton) {
    clearResultButton.addEventListener("click", () => {
        decodedText = "";
        currentMorse = "";

        if (decodedTextElement) decodedTextElement.textContent = "-";
        if (currentMorseElement) currentMorseElement.textContent = "-";
        if (durationElement) durationElement.textContent = "-";
        if (signalTypeElement) signalTypeElement.textContent = "-";
        if (spaceStatusElement) spaceStatusElement.textContent = "Spacebar를 눌러주세요";
    });
}