// High Quality Standard Pieces Mapping (Direct Wikimedia Stable Files)
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
let activePlayer = 'W'; 
let userElo = 1200;

const boardEl = document.getElementById('chessboard');
const badgeEl = document.getElementById('evaluation-badge');
const evalJuice = document.getElementById('eval-juice');

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
                img.crossOrigin = "anonymous"; // Browser security fix
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
    
    if (selectedSquare) {
        const pRow = selectedSquare.row;
        const pCol = selectedSquare.col;
        boardState[row][col] = boardState[pRow][pCol];
        boardState[pRow][pCol] = '';
        selectedSquare = null;
        
        triggerMoveEvaluation();
        initBoard();
    } else {
        if(boardState[row][col]) {
            selectedSquare = {row, col};
            initBoard();
            e.currentTarget.classList.add('selected');
        }
    }
}

function triggerMoveEvaluation() {
    const qualities = [
        {text: 'Brilliant !!', class: 'brilliant', juice: '85%'},
        {text: 'Best Move', class: 'best', juice: '60%'},
        {text: 'Book Move', class: 'book', juice: '50%'}
    ];
    const picked = qualities[Math.floor(Math.random() * qualities.length)];
    badgeEl.textContent = picked.text;
    badgeEl.className = `badge ${picked.class}`;
    evalJuice.style.height = picked.juice;
    if(picked.class === 'brilliant') userElo += 15;
    document.getElementById('user-elo').textContent = userElo;
}

initBoard();
