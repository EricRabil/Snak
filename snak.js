const gridClasses = ["spot", "spot-empty"];
const boardElement = document.getElementsByClassName("board")[0];

class Square {
    /**
     * 
     * @param {Element} element 
     * @param {*} column 
     * @param {*} row 
     */
    constructor(element, column, row) {
        this.element = element;
        this.column = column;
        this.row = row;
    }
}

/**
 * @type {{[key: string]: {[key: string]: Square[]}}}
 */
const grid = {
    columns: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        [NaN]: []
    },
    rows: { 
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        [NaN]: []
    }
}

for (let i = 1; i <= 100; i++) {
    const gridEntryID = `grid-spot-${i}`;
    const element = document.createElement("span");
    
    let row;

    if (i < 10) row = 1;
    if (i < 20 && i > 10) row = 2;
    if (i <= 30 && i > 20) row = 3;
    if (i <= 40 && i > 30) row = 4;
    if (i <= 50 && i > 40) row = 5;
    if (i <= 60 && i > 50) row = 6;
    if (i <= 70 && i > 60) row = 7;
    if (i <= 80 && i > 70) row = 8;
    if (i <= 90 && i > 80) row = 9;
    if (i <= 100 && i > 90) row = 10;

    let iSplit = i.toString().split('');

    let column = parseInt((i).toString().split('').pop());
    column = i % 10 === 0 ? 10 : column;

    element.id = gridEntryID;
    element.classList.add(...gridClasses);

    const square = new Square(element, column, row);

    let rowArr = grid.rows[row] || [];
    let colArr = grid.columns[column] || [];

    rowArr[rowArr.length || 1] = square;
    colArr[colArr.length || 1] = square;

    boardElement.appendChild(element);
}

let filled = [grid.rows[4][5], grid.rows[5][5], grid.rows[6][5], grid.rows[7][5]];

for (let square of filled) {
    square.element.classList.remove("spot-empty");
    square.element.classList.add("spot-filled");
}

const UP = "UP", LEFT = "LEFT", RIGHT = "RIGHT", DOWN = "DOWN";

let nextMove = UP;

document.onkeydown = function(ev) {
    switch (ev.key) {
        case "ArrowDown":
            nextMove = DOWN;
        break;
        case "ArrowUp":
            nextMove = UP;
            break;
        case "ArrowLeft":
            nextMove = LEFT;
            break;
        case "ArrowRight":
            nextMove = RIGHT;
            break;
    }
}

let head = filled[0];

let interval;

function kill() {
    clearInterval(interval);
    const game = document.getElementsByClassName("game")[0];
    game.classList.add("seize");
    document.getElementById("snakprompt").innerText = "SNAK DIED.";
}

function calculateRow(oldRow, direction) {
    switch (direction) {
        case UP:
            return oldRow - 1;
        case DOWN:
            return oldRow + 1;
        default:
            return oldRow;
    }
}

function calculateColumn(oldColumn, direction) {
    switch (direction) {
        case RIGHT:
            return oldColumn + 1;
        case LEFT:
            return oldColumn - 1;
        default:
            return oldColumn;
    }
}

function move() {
    const genNewSquare = (square) => grid.columns[calculateColumn(square.column, nextMove)][calculateRow(square.row, nextMove)];

    let newHead = genNewSquare(head);
    
    // if (newHead.element.classList.contains("spot-filled")) return kill();

    const swap = (square, newSquare) => {
        newSquare.element.classList.remove("spot-empty");
        newSquare.element.classList.add("spot-filled");
        square.element.classList.remove("spot-filled");
        square.element.classList.add("spot-empty");
    }

    let newFilled = [];
    swap(head, newHead);
    newFilled.push(newHead);

    for (let square of filled) {
        if (square === newHead) continue;
        let newSquare = genNewSquare(square);
        console.log(`c${square.column}r${square.row} -> c${newSquare.column}r${newSquare.row}`);
        swap(square, newSquare);
        newFilled.push(newSquare);
    }

    filled = newFilled;
    head = newHead;
}

interval = setInterval(function() {
    switch (nextMove) {
        case UP:
            if (head.row === 1) return kill();
            break;
        case DOWN:
            if (head.row === 10) return kill();
            break;
        case LEFT:
            if (head.column === 1) return kill();
             break;
        case RIGHT:
            if (head.column === 10) return kill();
            break;
    }
    move();
}, 2000);

let secondInterval = setInterval(function() {
    prompt("can the candy man can?", "uazzzzz");
}, 15000);