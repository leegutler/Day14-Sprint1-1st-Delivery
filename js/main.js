'use strict'
// Pieces Types
const MINE = '💣'
// const FLAG = '🚩'
const SMILE = '🤩'
const SAD = '😩'

/// MODAL

var gBoard
var gIsGameOn
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gBoard = buildBoard()
    renderboeard(gBoard)

}

function buildBoard() {
    /// Build the board - starting with 4*4
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
            // if (!cell.isMine) cell = MINE

        }
    }
    // placing 2 MINES 
    board[0][2].isMine = true
    board[2][2].isMine = true
    console.table('board', board)
    setMinesNegCount(board)
    return board
}

/// Show on DOM
function renderboeard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var className 
            const title = `Cell: ${i}, ${j}`
            var innerContnt = ''
            if (currCell.isMine) innerContnt += MINE
            if (currCell.minesAroundCount === 0 ) innerContnt += ''
            if (currCell.minesAroundCount > 0 ) innerContnt += ''


            strHTML += `<td 
            data-i="${i}" data-j="${j}" 
            title="${title}"  
            class="cell ${className}"  
            onclick="onCellClicked(this, ${i}, ${j})" >${innerContnt}</td > `
        }
        strHTML += '</tr>'
    }

    const elSmile = document.querySelector('.smile')
    elSmile.innerText = SMILE


    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++)
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countMinesNegsAround(board, i, j)
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
            // console.log('currCell',currCell)
            if (currCell.isMine) MinesNegsCount++
        }
    }
    return MinesNegsCount
}

function onCellClicked(elCell, cellI, cellJ) {
    // startTimer()
    // console.log('Cell clicked: ', elCell, cellI, cellJ)
    var elCell = document.querySelector('.cell')

    if (elCell.minesAroundCount > 0) {
        elCell.isShown = true
        elCell.classList.remove('.shown')
        revealAroundSafeCell(gBoard, cellI, cellJ)
    }



    // if (gBoard[cellI][cellJ].minesAroundCount === 0) {
    //     gBoard[cellI][cellJ].isShown = true
    //     elCell.classList.add('shown')
    //     revealAroundSafeCell(gBoard, cellI, cellJ)

    // }

    // if (gBoard[cellI][cellJ].isMine) {
    //     console.log(gBoard[cellI][cellJ])
    //     elCell.classList.add('mine')
    //     elCell.classList.remove('shown')
    //     elCell.innerText = MINE
    //     revealAllMinesLocations(gBoard)

    // }
    console.log(gBoard)
}

function revealAroundSafeCell(board, rowIdx, colIdx) {
    // console.log(rowIdx, colIdx)
    // var safeCells = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === rowIdx && j === colIdx) continue;
            var currCell = board[i][j]

            if (!currCell.isShown) {
                currCell.isShown = true
                currCell = document.querySelector(`[data - i="${i}"][data - j="${j}"]`)
                console.log(currCell)

                currCell.classList.add('shown')
                currCell.innerText = countMinesNegsAround(gBoard, i, j)
            }
        }
    }
}

function revealAllMinesLocations(board) {
    var minesLocation = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var currCell = board[i][j]
            if (currCell.isMine) {
                minesLocation.push(currCell)
                currCell = document.querySelector(`[data - i= "${i}"][data - j="${j}"]`)
                currCell.classList.add('mine')
                currCell.innerText = MINE
            }
        }
    }

    console.log('game over')
    gameOver()
}

function onSetLevels(size, mine) {

    gLevel.SIZE = size
    gLevel.MINES = mine
    gBoard = buildBoard()
    renderboeard(gBoard)
    console.log(gLevel)

}

function gameOver() {
    gGame.isOn = false

}




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
    var formattedTime = (elapsedTime / 10000).toFixed(1)
    Math.floor(formattedTime)
    document.getElementById('timer').textContent = formattedTime
}

function clearTimer() {
    document.getElementById('timer').textContent = (0 / 10000).toFixed(1)
}