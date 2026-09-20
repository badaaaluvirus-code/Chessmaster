// High Quality Standard Pieces Mapping
const piecesConfig = {
    'r': 'https://wikimedia.org',
    'n': 'https://wikimedia.org',
    'b': 'https://wikimedia.org',
    'q': 'https://wikimedia.org',
    'k': 'https://wikimedia.org',
    'p': 'https://wikimedia.org',
    'R': 'https://wikimedia.org',
    'N': 'https://wikimedia.org',
    'B': 'https://wikimedia.org',
    'Q': 'https://wikimedia.org',
    'K': 'https://wikimedia.org',
    'P': 'https://wikimedia.org'
};

const initialBoardSetup = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];

let boardState = JSON.parse(JSON.stringify(initialBoardSetup));
let selectedSquare = null;
let activePlayer = 'W'; // W = White, B = Black
let userElo = 1200;
let oppElo = 1500;
let premoveTarget = null;

const boardEl = document.getElementById('chessboard');
const badgeEl = document.getElementById('evaluation-badge');
const moveListEl = document.getElementById('move-list');
const evalJuice = document.getElementById('eval-juice');

// Generate Chessboard View
function initBoard() {
    boardEl.innerHTML = '';
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            const square = document.createElement('div');
            square.classList.add('square', (r + c) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = r;
            square.dataset.col = c;
            
            const piece = boardState[r][c];
            if(piece) {
                const img = document.createElement('img');
                img.src = piecesConfig[piece];
                square.appendChild(img);
            }
            
            square.addEventListener('click', handleSquareClick);
            boardEl.appendChild(square);
        }
    }
}

function handleSquareClick(e) {
    const row = parseInt(e.currentTarget.dataset.row);
    const col = parseInt(e.currentTarget.dataset.col);
    
    // Simple UI demonstration of Premove if it's not our turn
    if(activePlayer === 'B' && document.getElementById('game-mode').value === 'bot') {
        clearPremoves();
        e.currentTarget.classList.add('premove');
        premoveTarget = {row, col};
        return;
    }

    if (selectedSquare) {
        // Move Piece Logic
        const pRow = selectedSquare.row;
        const pCol = selectedSquare.col;
        const movingPiece = boardState[pRow][pCol];
        
        boardState[row][col] = movingPiece;
        boardState[pRow][pCol] = '';
        selectedSquare = null;
        
        triggerMoveEvaluation();
        activePlayer = activePlayer === 'W' ? 'B' : 'W';
        initBoard();
        
        // Simple Automated Bot Response Trigger
        if(document.getElementById('game-mode').value === 'bot' && activePlayer === 'B') {
            setTimeout(simulateBotMove, 1000);
        }
    } else {
        if(boardState[row][col]) {
            selectedSquare = {row, col};
            initBoard();
            e.currentTarget.classList.add('selected');
        }
    }
}

function clearPremoves() {
    document.querySelectorAll('.square').forEach(s => s.classList.remove('premove'));
}

// Randomly mimics high-fidelity engine move ratings from Chess.com
function triggerMoveEvaluation() {
    const qualities = [
        {text: 'Brilliant !!', class: 'brilliant', juice: '85%'},
        {text: 'Best Move', class: 'best', juice: '60%'},
        {text: 'Book Move', class: 'book', juice: '50%'},
        {text: 'Blunder ??', class: 'blunder', juice: '15%'}
    ];
    const picked = qualities[Math.floor(Math.random() * qualities.length)];
    badgeEl.textContent = picked.text;
    badgeEl.className = `badge ${picked.class}`;
    evalJuice.style.height = picked.juice;
    
    // Dynamic ELO system response representation
    if(picked.class === 'brilliant') userElo += 12;
    if(picked.class === 'blunder') userElo -= 15;
    document.getElementById('user-elo').textContent = userElo;
}

function simulateBotMove() {
    // Basic auto-response selector mimicking enemy engine interaction
    for(let r=2; r<5; r++) {
        for(let c=0; c<8; c++) {
            if(boardState[1][c] === 'p' && boardState[r][c] === '') {
                boardState[r][c] = 'p';
                boardState[1][c] = '';
                activePlayer = 'W';
                initBoard();
                return;
            }
        }
    }
}

document.getElementById('start-btn').addEventListener('click', () => {
    boardState = JSON.parse(JSON.stringify(initialBoardSetup));
    activePlayer = 'W';
    initBoard();
    badgeEl.textContent = "Game Live";
    badgeEl.className = "book";
    moveListEl.innerHTML = "<li>Match initialized. White to move.</li>";
});

// Initialize Board View on load
initBoard();
