'use strict'
// Pieces Types
const MINE = '💣'
const FLAG = '🚩'
const FLOOR = '*'

/// MODAL

var gBoard
var gIsGameOn
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard()
    renderboeard(gBoard)
    // setMinesNegCount(gBoard)
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
            var className = 'cell'
            if (currCell.isMine) className += 'mine'
            if (currCell.isMarked) className += 'mark'
            if (currCell.isShown) className += 'shown'

            const title = `Cell: ${i}, ${j}`

            strHTML += `<td 
            data-i="${i}" data-j="${j}" 
            title="${title}"  
            class="cell ${className}" 
            onclick="onCellClicked(this, ${i}, ${j})" ></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setClasses() {

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
        revealSafeCell(gBoard, i, j)
    }

    if (cell.isMine) {
        elCell.classList.add('mine')
        elCell.innerText = MINE
        return
    }

    if (!cell.isMine && cell.minesAroundCount > 0) {
        elCell.classList.add('shown')
        elCell.innerText = countMinesNegsAround(gBoard, i, j)
    } else {
        elCell.classList.add('shown')
    }
}

function revealSafeCell(board, rowIdx, colIdx) {
    var elCurrClass = document.querySelectorAll('.cell')
    console.log('hi')
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === rowIdx && j === colIdx) continue;
            var elCurrClass = board[i][j]
            console.log(elCurrClass)

        }

    }
}






