function init() {
    //---------- grab contents form HTML
    const grid = document.querySelector('.grid')
    const navBtn = document.querySelector('.menu-logo')
    const nav = document.querySelector('nav')
    const playersHighlight = document.querySelectorAll('.score-board p')
    const xScoreText = document.querySelector('#x-score')
    const oScoreText = document.querySelector('#o-score')
    const newGame = document.querySelector('#new-game')
    const xWild = document.querySelector('#x-wild')
    const oWild = document.querySelector('#o-wild')
    const cardsToUse = document.querySelectorAll('.use-wild-card')
    const resetBtn = document.querySelector('#clear-score')
    const messageBoard = document.querySelector('.message-board')
    const messageText = document.querySelector('.message')
    //---------------- 
    //-----Big board
    const collection = []
    const cellsArray = []
    let boardTurnIndex = -1
    let playerXChoicesBig = []
    let playerOChoicesBig = []
    let playerXWins = []
    let playerOWins = []
    const boardCleard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    let winningBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    let currentChoicesBig = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [0, 1, 2, 3, 4, 5, 6, 7, 8]
    ]
    ///---------------- 
    let playerMode = 0
    const playerVSplayer = 0
    const playerVSai = 1
    const aiVSai = 2
    let difficulty = 0
    const STUPID = 0
    const EASY = 1
    const HARD = 2
    const gridCellCount = 9
    const cells = []
    let playerXturn = true
    let cpuMark = 'O'
    const playerOMark = 'O'
    const playerXMark = 'X'
    const markX = 'X'
    const markO = 'O'
    const draw = 'draw'
    let xScore = 0
    let oScore = 0
    let playerXChoices = []
    let playerOChoices = []
    let currentChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const winningComb = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8]]
    let waitConst
    let gameStarted = false
    let wildMode = false
    const emptyCard = 0
    const extraRoundCard = 1
    const overwriteCard = 2
    const swapCard = 3
    const switchCard = 4
    let useExtraRound = false
    let PlayerXWildcard
    let PlayerOWildcard
    let swapEnable = false
    let overwriteEnabled = false
    let gameMode
    const game3x3 = 0
    const game9x9 = 1
    // /----------- create grid
    function creatGrid() {
        for (let i = 0; i < gridCellCount; i++) {
            const cell = document.createElement('div')
            cell.dataset.ID = i
            cells.push(cell)
            grid.appendChild(cell)
        }
    }
    function creatGridBig() {
        for (let j = 0; j < gridCellCount; j++) {
            const cellsBox = document.createElement('div')
            cellsBox.classList.add('boxBig')
            cellsBox.dataset.ID = j
            collection.push(cellsBox)
            grid.appendChild(cellsBox)
        }
        collection.forEach((cellsBox) => {
            const cells = []
            for (let i = 0; i < gridCellCount; i++) {
                const cell = document.createElement('div')
                cell.dataset.ID = i
                cell.classList.add('cellBox' + i)
                cells.push(cell)
                cellsBox.appendChild(cell)
            }
            cellsArray.push(cells)
        })
    }
    function makeList(num = gridCellCount) {
        const list = []
        for (let i = 0; i < num; i++) {
            list.push(new Array())
        }
        return list
    }
    ///------------ wild cards
    function extraRound(PlayerWildcard) {
        useExtraRound = true
        changeCardToEmpty()
    }
    function overwrite() {
        overwriteEnabled = true
        changeCardToEmpty()
    }
    function switchChoices() {
        changeCardToEmpty()
        if (gameMode == game3x3) {
            const tempArray = playerXChoices
            playerXChoices = playerOChoices
            playerOChoices = tempArray
            playerXChoices.forEach((value) => {
                cells[value].classList.add(playerXMark)
                cells[value].classList.remove(playerOMark)
            })
            playerOChoices.forEach((value) => {
                cells[value].classList.add(playerOMark)
                cells[value].classList.remove(playerXMark)
            })
        } else if (gameMode == game9x9) {
            winningBoard.forEach((box, boxIndex) => {
                if (!isNaN(box)) {
                    const tempArray = playerXChoicesBig[boxIndex]
                    playerXChoicesBig[boxIndex] = playerOChoicesBig[boxIndex]
                    playerOChoicesBig[boxIndex] = tempArray
                    playerXChoicesBig[boxIndex].forEach((value) => {
                        cellsArray[boxIndex][value].classList.add(playerXMark)
                        cellsArray[boxIndex][value].classList.remove(playerOMark)
                    })
                    playerOChoicesBig[boxIndex].forEach((value) => {
                        cellsArray[boxIndex][value].classList.add(playerOMark)
                        cellsArray[boxIndex][value].classList.remove(playerXMark)
                    })
                }
            })
        }

        changePlayerTurn()
        if (playerMode !== playerVSplayer) cpuMakeChoice()
    }
    function changeCardToEmpty() {
        if (playerXturn) {
            PlayerXWildcard = 0
            xWild.textContent = ''
        }
        else {
            PlayerOWildcard = 0
            oWild.textContent = ''
        }
    }

    function getWildCard() {
        let result
        function drawACard() {
            const index = Math.floor(Math.random() * 7) + 1
            if (index % 3 == 0)
                return [extraRoundCard, 'Extra turn']
            if (index % 5 == 0)
                return [overwriteCard, 'Overwrite']
            // if (index % 7 == 0)
            //     return [swapCard, 'Swap a card']
            if (index % 7 == 0)
                return [switchCard, 'Swap all cards']
            return [emptyCard, 'Empty 👽']

        }
        result = drawACard()
        PlayerXWildcard = result[0]
        let textX = result[1]
        result = drawACard()
        PlayerOWildcard = result[0]
        let textO = result[1]
        xWild.textContent = `X wild card: ${textX}`
        oWild.textContent = `O wild card: ${textO}`
    }
    function useCard(event) {
        const idCard = event.target.dataset.id
        if (playerXturn && idCard == markX && PlayerXWildcard !== 0) {
            if (PlayerXWildcard == 1)
                return extraRound()
            if (PlayerXWildcard == 2)
                return overwrite()
            if (PlayerXWildcard == 3)
                return //console.log('swap not implmented yet');
            if (PlayerXWildcard == 4)
                return switchChoices()
        } else if (!playerXturn && idCard && PlayerOWildcard != 0) {
            if (PlayerOWildcard == 1)
                return extraRound()
            if (PlayerOWildcard == 2)
                return overwrite()
            if (PlayerOWildcard == 3)
                return //console.log('swap not implmented yet');
            if (PlayerOWildcard == 4) {
                return switchChoices()
            }
        }
    }







    //------------------ logics
    function stupid() {
        const avail = emptySpots(currentChoices)[0]
        const index = Math.floor(Math.random() * avail.length)
        return avail[index]
    }
    function easyLogic(playerChoices, opponentChoices) {
        const chances = easyExtended(playerChoices, opponentChoices)
        const opponentChances = easyExtended(opponentChoices, playerChoices)
        if (chances[0].length > 0) {
            return weightElement(chances[0])
        } else if (opponentChances[0].length > 0) {
            return weightElement(opponentChances[0])
        }
        else if (chances[1].length > 0) {
            return weightElement(chances[1])
        }
        else if (opponentChances[1].length > 0) {
            return weightElement(opponentChances[1])
        }
        else if (chances[2].length > 0) {
            return weightElement(chances[2])
        }
        else if (opponentChances[2].length > 0) {
            return weightElement(opponentChances[2])
        }
       
        function easyExtended(playerChoices, opponentChoices) {
            const array0 = []
            const array0125 = []
            const array025 = []
            const array05 = []
            const availableChoices = emptySpots(currentChoices)[0]
            let counter = 0
            winningComb.forEach((item, key) => {
                let calcChance = 1
                const availElements = []
                item.forEach(element => {
                    if (opponentChoices.includes(element)) calcChance *= 0
                    if (playerChoices.includes(element)) calcChance *= 1
                    if (availableChoices.includes(element)) {
                        availElements.push(element)
                        calcChance *= 0.5
                    }
                })
                switch (calcChance) {
                    case 0.5:
                        array05.push(availElements)
                        break;
                    case 0.25:
                        array025.push(availElements)
                        break;
                    case 0.125:
                        array0125.push(availElements)
                        break;
                    case 0:
                        array0.push(availElements)
                        break;
                }
                counter++
            })
            return [array05, array025, array0125]
        }
        function weightElement(lists) {
            const movesList = []
            lists.forEach((list) => {
                list.forEach((value) => {
                    const dict = {}
                    dict.value = value
                    if (value == 4) {
                        dict.score = 1
                    }
                    else if ([0, 2, 6, 8].includes(value)) {
                        dict.score = 0.5
                    }
                    else {
                        dict.score = 0.25
                    }
                    movesList.push(dict)
                })
            })
            let bestScore = -1
            let key
            movesList.forEach((item, index) => {
                if (item.score > bestScore) {
                    bestScore = item.score
                    key = index
                }
            })
            return movesList[key].value

        }
    }
    function logic(player, currentList) {
        availableSpots = emptySpots(currentList)[0]
        const xChoices = emptySpots(currentList)[1]
        const oChoices = emptySpots(currentList)[2]


        if (isWinner(xChoices)) {
            if (cpuMark === playerXMark) {
                return { score: 1 }
            } else return { score: -1 }
        }
        if (isWinner(oChoices)) {
            if (cpuMark === playerOMark) {
                return { score: 1 }
            } else return { score: -1 }
        }
        if (availableSpots.length === 0) return { score: 0 }

        const movesList = []
        availableSpots.forEach(index => {
            let move = {}
            move.index = currentList[index]
            currentList[index] = player
            if (player === playerXMark) move.score = logic(playerOMark, currentList).score
            else move.score = logic(playerXMark, currentList).score
            currentList[index] = move.index
            movesList.push(move)
        })

        let bestMove;
        if (player === cpuMark) {
            let bestScore = -2
            movesList.forEach((move, index) => {
                if (move.score > bestScore) {
                    bestScore = move.score
                    bestMove = index
                }
            })
        } else {
            let bestScore = 2
            movesList.forEach((move, index) => {
                if (move.score < bestScore) {
                    bestScore = move.score
                    bestMove = index
                }
            })
        }
        return movesList[bestMove];
    }
    function cpuMakeChoice() {
        let index
        if (gameMode == game3x3) {
            let cpuChoices
            let opponentChoices
            if (cpuMark == playerXMark) {
                cpuChoices = playerXChoices
                opponentChoices = playerOChoices
            }
            else {
                cpuChoices = playerOChoices
                opponentChoices = playerXChoices
            }
            if (difficulty == STUPID) {
                index = stupid()
            } else if (difficulty == EASY) {
                index = easyLogic(cpuChoices, opponentChoices)
            }
            else {
                index = logic(cpuMark, currentChoices).index
            }
            updateChoice(cpuMark, index, cpuChoices)
        } else if (gameMode == game9x9) {
            let idx
            let avail
            if (playerMode == aiVSai)
                if (cpuMark == playerXMark) cpuChoices = playerXChoicesBig
                else cpuChoices = playerOChoicesBig
            else cpuChoices = playerOChoicesBig
            if (boardTurnIndex !== -1) idx = boardTurnIndex
            else if (boardTurnIndex === -1) {
                const idxs = []
                winningBoard.forEach(item => {
                    if (!isNaN(item)) idxs.push(item)
                })
                idx = Math.floor(Math.random() * idxs.length)
            }
            avail = emptySpots(currentChoicesBig[idx])[0]
            index = avail[Math.floor(Math.random() * avail.length)]
            updateChoice(cpuMark, index, cpuChoices, idx)
        }
    }

    //-----------delay ai choices
    function newWait() {
        setTimeout(cpuMakeChoice, 1000)
    }

    ///---------running the game
    function updateChoice(player, index, choices, parrentId = null) {
        if (!useExtraRound)
            changePlayerTurn()
        else useExtraRound = false
        if (parrentId == null) {
            if (overwriteEnabled) {
                overwriteEnabled = false
                cells[index].classList.remove(markX)
                cells[index].classList.remove(markO)
                if (player == playerXMark) {
                    playerOChoices.splice(index, 1)
                } else {
                    playerXChoices.splice(index, 1)
                }
            }
            cells[index].classList.add(player)
            currentChoices[index] = player
            choices.push(index)
            if (isWinner(choices)) {
                gameEnd(player)
            } else if (emptySpots(currentChoices)[0].length === 0) {
                gameEnd(draw)
            }
            else if (playerMode == playerVSai && !playerXturn) {
                newWait()
            } else if (playerMode == aiVSai) {
                cpuChangeTurn()
                newWait()
            }
        } else {
            if (overwriteEnabled) {
                if (winningBoard.includes(parrentId)) {
                    overwriteEnabled = false
                    cellsArray[parrentId][index].classList.remove(markX)
                    cellsArray[parrentId][index].classList.remove(markO)
                    if (player == playerXMark) {
                        playerOChoicesBig[parrentId].splice(index, 1)
                        cellsArray[parrentId][index].classList.add(markX)
                    } else {
                        playerOChoicesBig[parrentId].splice(index, 1)
                        cellsArray[parrentId][index].classList.add(markO)
                    }
                }
            }
            collection[parrentId].classList.remove('turnC')
            cellsArray[parrentId][index].classList.add(player)
            currentChoicesBig[parrentId][index] = player
            choices[parrentId].push(index)
            if (isCleared(choices, parrentId, player)) {
                gameEnd(player)
            } else {
                let checkClear = true
                winningBoard.forEach(element => {
                    if (!isNaN(element)) checkClear = false
                })
                if (checkClear)
                    gameEnd(draw)
                else {
                    if (winningBoard.includes(index)) {
                        boardTurnIndex = index
                        collection[index].classList.add('turnC')
                    }
                    else boardTurnIndex = -1
                    if (playerMode == playerVSai && !playerXturn)
                        newWait()
                    else if (playerMode == aiVSai) {
                        cpuChangeTurn()
                        newWait()
                    }
                }
            }
        }
    }
    function changePlayerTurn() {
        playerXturn = !playerXturn
        turnColor()
    }
    function turnColor() {
        playersHighlight.forEach((letter) => letter.style.borderBottom = '')
        if (playerXturn) {
            playersHighlight[0].style.borderBottom = "thick solid #ce0e38"
            playersHighlight[1].style.borderBottom = "2px solid #23a6d5;"
        } else {
            playersHighlight[1].style.borderBottom = "thick solid #ce0e38"
            playersHighlight[0].style.borderBottom = "2px solid #23a6d5;"
        }
    }
    function cpuChangeTurn() {
        if (playerXturn) cpuMark = playerXMark
        else cpuMark = playerOMark
    }
    function gameEnd(mark) {
        gameStarted = false
        if (mark === playerXMark) {
            xScore++
            message(`Player -${mark}- won the game 🎆🎁👏`)
        } else if (mark === playerOMark) {
            oScore++
            message(`Player -${mark}- won the game 🎆🎁👏`)
        } else if (mark == draw) {
            message(`It is a draw 🤢🔺🔻`)
        }
        xScoreText.textContent = xScore
        oScoreText.textContent = oScore
    }
    function isWinner(choicesList) {
        for (let item = 0; item < winningComb.length; item++) {
            let count = 0
            for (let element = 0; element < winningComb[item].length; element++) {
                if (!(choicesList.includes(winningComb[item][element]))) break
                else count++
            }
            if (count === 3) return true
        }
        return false
    }
    //--------winner bg board
    // winner Boards-----------
    function isCleared(playerChoicesList, parentID, mark) {
        if (smallBoxWinner(playerChoicesList[parentID])) {
            if (mark === playerXMark) {
                playerXWins.push(parentID)
                winningBoard[parentID] = 'X'
                collection[parentID].classList.add(mark)
                return (smallBoxWinner(playerXWins))
            } else if (mark === playerOMark) {
                playerOWins.push(parentID)
                winningBoard[parentID] = 'O'
                collection[parentID].classList.add(mark)
                return (smallBoxWinner(playerOWins))
            }
        } else {
            let checkClear = true
            currentChoicesBig[parentID].forEach(element => {
                if (!isNaN(element)) checkClear = false
            })
            if (checkClear) winningBoard[parentID] = 'D'
            return false
        }
    }

    function smallBoxWinner(choicesList) {
        for (let item = 0; item < winningComb.length; item++) {
            let count = 0
            for (let element = 0; element < winningComb[item].length; element++) {
                if (!(choicesList.includes(winningComb[item][element]))) break
                else count++
            }
            if (count === 3) return true
        }
        return false
    }

    function emptySpots(choices) {
        const avail = []
        const xChoice = []
        const oChoice = []
        choices.forEach((item, key) => {
            if (item === 'X') xChoice.push(+key)
            else if (item === 'O') oChoice.push(+key)
            else avail.push(+item)
        });
        return [avail, xChoice, oChoice]
    }
    function emptySpotsBig(choices) {
        const avail = makeList()
        const playerChoice = makeList()
        const cpuChoices = makeList()
        choices.forEach((item, key) => {
            item.forEach((element, id) => {
                if (element === 'X') playerChoice[+key].push(+id)
                else if (element === 'O') cpuChoices[+key].push(+id)
                else avail[+key].push(+element)
            })

        });
        return [avail, playerChoice, cpuChoices]
    }
    function message(txt) {
        messageText.textContent = txt
        messageBoard.classList.remove('hidden')
    }
    ///---------------------grids clicked
    function handleClick(event) {
        if (gameStarted && !(playerMode == aiVSai)) {
            const id = +event.target.dataset.ID
            if (((!isNaN(currentChoices[id]) || overwriteEnabled)) && playerXturn) {
                updateChoice(playerXMark, id, playerXChoices)
            } else if (playerMode == playerVSplayer && ((!isNaN(currentChoices[id]) || overwriteEnabled)) && !playerXturn) {
                updateChoice(playerOMark, id, playerOChoices)
            }
        }
    }
    function handleClickBig(event) {
        if (gameStarted && !(playerMode == aiVSai)) {
            const id = +event.target.dataset.ID
            const parrentId = +event.target.parentNode.dataset.ID;
            if ((!isNaN(winningBoard[parrentId])) &&
                ((boardTurnIndex == -1) || (boardTurnIndex == parrentId)) &&
                ((!isNaN(currentChoicesBig[parrentId][id])) || overwriteEnabled)) {
                if (playerXturn) {
                    updateChoice(playerXMark, id, playerXChoicesBig, parrentId)
                }
                else if (playerMode == playerVSplayer && (!playerXturn))
                    updateChoice(playerOMark, id, playerOChoicesBig, parrentId)

            }
        }
    }
    ///--------------------start and restart the game 
    function hideGrids() {
        cells.forEach((cell) => cell.style.display = "none")
        cellsArray.forEach((cells) => {
            cells.forEach(cell => cell.style.display = "none")
        })
        collection.forEach((bigBox) => bigBox.style.display = "none")
    }
    function showGrids() {
        if (gameMode == game3x3)
            cells.forEach((cell) => cell.style.display = "flex")
        else {
            collection.forEach((bigBox) => bigBox.style.display = "flex")
            cellsArray.forEach((cells) => {
                cells.forEach(cell => cell.style.display = "flex")
            })
        }
    }
    function makeNewGame() {
        hideGrids()
        playerXChoices = []
        playerOChoices = []
        playerXChoicesBig = makeList()
        playerOChoicesBig = makeList()
        currentChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        winningBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        currentChoicesBig = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 1, 2, 3, 4, 5, 6, 7, 8]
        ]
        boardTurnIndex = -1
        playerXWins = []
        playerOWins = []
        cells.forEach((cell) => {
            cell.classList.remove(playerOMark)
            cell.classList.remove(playerXMark)
        })
        cellsArray.forEach((cells) => {
            cells.forEach(cell => {
                cell.classList.remove(playerOMark)
                cell.classList.remove(playerXMark)
            })
        })
        collection.forEach(box => {
            box.classList.remove('turnC')
            box.classList.remove(markX)
            box.classList.remove(markO)
        })
        xWild.textContent = `X wild card: `
        oWild.textContent = `O wild card: `
        showGrids()
    }
    function resetScore() {
        xScore, oScore = 0
        makeNewGame()
        startTheGame = false

    }
    function startTheGame() {
        cpuMark = playerOMark
        playerMode = document.querySelector('#player-mode').selectedIndex
        difficulty = document.querySelector('#diffculty-mode').selectedIndex
        wildMode = document.querySelector('#wild').checked
        gameMode = document.querySelector('#game-mode').selectedIndex
        makeNewGame()
        if (wildMode) getWildCard()
        lot()
        turnColor()
        gameStarted = true
        if (playerMode == playerVSai && !playerXturn) {
            cpuMakeChoice()
        } else if (playerMode == aiVSai) {
            cpuChangeTurn()
            cpuMakeChoice()
        }
    }

    function lot() {
        if (Math.floor(Math.random() * Math.random() * 1000) % 2) {
            playerXturn = true
            message(`Player ${playerXMark} goes first`)
        } else {
            playerXturn = false
            message(`Player ${playerOMark} goes first`)
        }
        setTimeout(() => { messageBoard.classList.add('hidden') }, 1500)
    }
    //--------------- close open sidebar
    function closeSidebar() {
        nav.classList.toggle('close')
    }
    //--------------- events listener
    creatGrid()
    creatGridBig()
    hideGrids()
    playerXChoicesBig = makeList()
    playerOChoicesBig = makeList()
    newGame.addEventListener('click', startTheGame)
    cells.forEach(cell => { cell.addEventListener('click', handleClick) })
    cellsArray.forEach((cells) => {
        cells.forEach(cell => { cell.addEventListener('click', handleClickBig) })
    })
    cardsToUse.forEach(card => { card.addEventListener('click', useCard) })
    resetBtn.addEventListener('click', resetScore)
    navBtn.addEventListener('click', closeSidebar)

}
window.addEventListener('DOMContentLoaded', init)
