const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const botPlayButton = document.getElementById("bot-play"); // Bot'a karşı oyna butonu
const playerVsPlayerButton = document.getElementById("player-vs-player"); // Oyuncuya karşı oyna butonu
let currentPlayer = "X";
let gameActive = false; // Oyun başlangıçta aktif değil
let gameState = ["", "", "", "", "", "", "", "", ""];
let botEnabled = false; // Bot modu kontrolü

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Hücre tıklanması engellenmeli, oyun modu seçildiğinde aktif olacak
function handleCellClick(event) {
    if (!gameActive) return; // Eğer oyun başlamamışsa işlem yapılmasın
    const cell = event.target;
    const cellIndex = cell.getAttribute("data-index");

    // Eğer hücrede bir şey varsa ya da oyun bitmişse işlem yapma
    if (gameState[cellIndex] !== "" || !gameActive || (botEnabled && currentPlayer === "O")) return;

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    checkResult();

    // Oyuncu değişimi
    if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `${currentPlayer}'nin sırası`;

        if (botEnabled && currentPlayer === "O") {
            botMove(); // Bot'un hamlesi
        }
    }
}

function botMove() {
    // Bot'un hamlesi: Boş bir hücreyi rastgele seç
    const emptyCells = gameState.map((value, index) => value === "" ? index : null).filter(item => item !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    gameState[randomIndex] = "O";
    cells[randomIndex].textContent = "O";

    checkResult();

    // Oyuncu değişimi
    if (gameActive) {
        currentPlayer = "X";
        statusText.textContent = `${currentPlayer}'nin sırası`;
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} kazandı!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusText.textContent = "Berabere!";
        gameActive = false;
        return;
    }
}

function resetGame() {
    currentPlayer = "X";
    gameActive = false; // Oyun başlangıçta aktif değil
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = "";
    cells.forEach(cell => cell.textContent = "");
    botEnabled = false; // Bot'u devre dışı bırak
    botPlayButton.style.display = "inline-block"; // Bot butonunu yeniden göster
    playerVsPlayerButton.style.display = "inline-block"; // Oyuncuya karşı butonunu göster
}

// Bot'a karşı oynama modunu başlat
function startBotMode() {
    resetGame(); // Bot'a karşı oynama seçildiğinde oyunu sıfırla
    botEnabled = true;
    currentPlayer = "X"; // Başlangıçta kullanıcı oynuyor
    statusText.textContent = `${currentPlayer}'nin sırası`;
    gameActive = true; // Oyunu başlat
    botPlayButton.style.display = "none"; // Bot butonunu gizle
    playerVsPlayerButton.style.display = "inline-block"; // Oyuncuya karşı butonunu göster
}

// Oyuncuya karşı oynama modunu başlat
function startPlayerVsPlayerMode() {
    resetGame(); // Oyuncuya karşı oynama seçildiğinde oyunu sıfırla
    botEnabled = false;
    currentPlayer = "X";
    statusText.textContent = ""; // Başlangıçta "Oyuncuya Karşı Oyna" yazısı gösterilmeyecek
    gameActive = true; // Oyunu başlat
    botPlayButton.style.display = "inline-block"; // Bot butonunu göster
    playerVsPlayerButton.style.display = "none"; // Oyuncuya karşı butonunu gizle
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
botPlayButton.addEventListener("click", startBotMode);
playerVsPlayerButton.addEventListener("click", startPlayerVsPlayerMode);
