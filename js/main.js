'use strict'
// Pieces Types
const MINE = '💣'
const EMPTY = ' '
const SMILE = '🤩'
const SAD = '😩'
const FLAG = '🚩'

/// MODAL
var gGame
var gBoard
var gIsGameOn
var gLevel = { SIZE: 4, MINES: 2 }


var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    gBoard = buildBoard()
    placeMines()
    setMinesNegCount(gBoard)
    renderBoard(gBoard)
    setRightClickListner()
}


function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
            board[i][j] = cell
        }
    }
    console.table('board', board)

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const title = `cell: ${i}, ${j}`

            var className = ''
            // if (cell.isMine) className += "mine"
            // if (!cell.isMine) className += "shown"

            strHTML += `<td title="${title}" class="cell ${className}" 
            onclick="onCellClicked(this, ${i}, ${j})" data-i="${i}" data-j="${j}" oncontextmenu="onRightClick(this)">`

            // if (cell.isMine && !cell.isShown) strHTML += MINE
            // if (cell.minesAroundCount > 0 && !cell.isShown) strHTML += cell.minesAroundCount
            if (cell.minesAroundCount === 0 && !cell.isShown) strHTML += ''

            strHTML += '</td>'
        }
        strHTML += `</tr>`
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    console.table('board', board)
}

function setMinesNegCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countMinesNegsAround(board, i, j)
            }
        }
    }
}

/// Count mines around each cell 
function countMinesNegsAround(board, rowIdx, colIdx) {
    var MinesNegsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === rowIdx && j === colIdx) continue;
            var currCell = board[i][j]
            if (currCell.isMine) MinesNegsCount++
        }
    }
    return MinesNegsCount
}

function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    gGame.shownCount++
    if (gGame.shownCount === 1) {
        startTimer()
    }
    if (cell.isMine) {
        elCell.innerText = MINE
        elCell.classList.add('mine')
        console.log('game over')
        gameOver()
        return
    }
    if (!cell.isMine && cell.minesAroundCount > 0) {
        makeCellShown(elCell, cell)
        elCell.innerText = cell.minesAroundCount
    } else {
        makeCellShown(elCell, cell)
        revealAroundSafeCell(elCell, i, j)
    }

}

function onRightClick(elCell) {
   elCell.innerText = FLAG
}

function makeCellShown(elCell, cell) {
    elCell.isShown = true
    elCell.classList.add('shown')
}

function revealAroundSafeCell(elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (rowIdx === i && colIdx === j) continue;
            var currCell = gBoard[i][j]
            if (!currCell.isShown) currCell.isShown = true
            var elCurrCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCurrCell.classList.add('shown')
            if (currCell.minesAroundCount > 0) elCurrCell.innerText = currCell.minesAroundCount
        }
    }
}

function onSetLevels(size, mine) {

    gLevel.SIZE = size
    gLevel.MINES = mine
    gBoard = buildBoard()
    placeMines()
    setMinesNegCount(gBoard)
    renderBoard(gBoard)
}

function gameOver() {
    stopTimer()
    gGame.isOn = false
    var elCurrCell = document.querySelectorAll('.cell')
    elCurrCell.forEach(td => td.style.pointerEvents = "none")

}

function restart() {
    onInit()
}

function placeMines() {
    var numSuccessMines = 0
    while (numSuccessMines < gLevel.MINES) {
        var randomColNumber = getRandomInt(0, gLevel.SIZE)
        var randomRowNumber = getRandomInt(0, gLevel.SIZE)
        var cell = gBoard[randomRowNumber][randomColNumber]
        if (cell.isMine) {
            continue
        } else {
            cell.isMine = true
            numSuccessMines++
        }  
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}



// timer functions

var gStartTime
var gTimerInterval

function stopTimer() {
    clearInterval(gTimerInterval)
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(updateTimer, 1)
}

function updateTimer() {
    var currentTime = Date.now()
    var elapsedTime = currentTime - gStartTime
    var formattedTime = (elapsedTime / 100).toFixed(3)
    document.getElementById('timer').textContent = formattedTime
}

function clearTimer() {
    document.getElementById('timer').textContent = (0 / 1000).toFixed(3)
}