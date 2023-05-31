'use strict'
// Pieces Types
const MINE = '💣'
const FLAG = '🚩'

/// MODAL

var gBoard
var gIsGameOn
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = { SIZE: 4, MINES: 2 }

function onInit() {
    gBoard = buildBoard()
    renderboeard(gBoard)

}

function buildBoard() {
    /// Build the board - starting with 4*4
    const rowCount = 4
    const colCount = 4
    const board = []

    for (var i = 0; i < rowCount; i++) {
        board[i] = []
        for (var j = 0; j < colCount; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
            board[i][j] = cell
            if (!cell.isMine) MINE
        }
    }
    // placing 2 MINES just for the testing 
    board[0][2].isMine = true
    board[2][2].isMine = true
    console.table('board', board)
    return board
}

/// Show on DOM
function renderboeard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var className = 'cell' // getClassName(board,i,j) maybe this will be more accurat need to continue
            // className+= getClassName(board,i,j)
            const title = `Cell: ${i}, ${j}`

            strHTML += `<td 
            data-i="${i}" data-j="${j}" 
            title="${title}"  
            class=" ${className} "  
            onclick="onCellClicked(this, ${i}, ${j})" ></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function getClassName(board,i,j) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            // if (currCell.isMine) {
            //     currCell.classList.add('mine')
            //     currCell.innerText = MINE
            // }

        }

    }

}
/// placing the count inside the cell object minesAroundCount.
function setMinesNegCount(board) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++)
            if (!gBoard[i][j].isMine) {
                gBoard[i][j].minesAroundCount = countMinesNegsAround(board, i, j)
            }
    }
}

/// Count mines around each cell and set the cell's minesAroundCount.
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

function onCellClicked(elCell, i, j) {
    setMinesNegCount(gBoard)
    console.log('Cell clicked: ', elCell, i, j)


    const cell = gBoard[i][j]
    // console.log(cell)
    if (cell.minesAroundCount === 0) {
        revealAroundSafeCell(gBoard, i, j)
    }

    if (cell.isMine) {
        elCell.classList.add('mine')
        elCell.innerText = MINE
        revealAllMinesLocations(gBoard)
        return
    }

    if (!cell.isMine && cell.minesAroundCount > 0) {
        elCell.classList.add('shown')
        elCell.innerText = countMinesNegsAround(gBoard, i, j)
    } else {
        elCell.classList.add('shown')
    }
}

function revealAroundSafeCell(board, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === rowIdx && j === colIdx) continue;
            var elCurrClass = board[i][j]
            console.log(elCurrClass)
            // elCurrClass = document.querySelectorAll('cell')
            // elCurrClass.classList.add('.shown')

        }

    }
}

function gameOver() {
    gGame.isOn = false

}

function revealAllMinesLocations(board) {
    var minesLocation = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.isMine) {
                minesLocation.push(currCell)
            }
        }
    }
    var elCell = document.querySelectorAll('.mine')
    elCell.hidden = false
    console.log(elCell)
    gameOver()
}


