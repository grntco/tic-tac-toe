const gameboard = (() => {
    const arr = [...Array(9)].map(x => '');
    const gridItems = document.querySelectorAll('.grid-item');

    const render = function() {
        for (let i = 0; i < arr.length; i++) {
            gridItems[i].innerHTML = arr[i];
        }
    }

    const reset = function() {
        arr.fill('')
        render();
    }

    return { arr, gridItems, render, reset }; //Don't need to return arr, just doing so for now
})();

const createPlayer = (name, mark) => { 
    let points = 0;

    const placeMark = (e) => {
        if (!e.target.innerHTML) {
            let index = [...gameboard.gridItems].indexOf(e.target);
            gameboard.arr.splice(index, 1, game.getActivePlayer().mark);
            gameboard.render();
            if (!game.checkPlay(game.getActivePlayer().mark)) {
                game.switchTurns();
            }
        }
    }

    return { name, mark, points, placeMark }
};

const player1 = createPlayer('Grant', '<i class="fa-solid fa-x"></i>');
const player2 = createPlayer('Hal', '<i class="fa-solid fa-o"></i>');

const game = (() => {

    let activePlayer = player1;

    const switchTurns = () => {
        activePlayer = activePlayer === player1 ? player2 : player1
    }

    const getActivePlayer = () => activePlayer;

    const checkPlay = (mark) => {
        let board = gameboard.arr;

        const winningPatterns = [
            board[0] === mark && board[1] === mark && board[2] === mark,
            board[3] === mark && board[4] === mark && board[5] === mark,
            board[7] === mark && board[6] === mark && board[8] === mark,
            board[0] === mark && board[3] === mark && board[6] === mark,
            board[1] === mark && board[4] === mark && board[7] === mark,
            board[2] === mark && board[5] === mark && board[8] === mark,
            board[0] === mark && board[4] === mark && board[8] === mark,
            board[2] === mark && board[4] === mark && board[6] === mark
        ];

        let roundWon = winningPatterns.includes(true);
        let roundTie = winningPatterns.every(pattern => pattern === false) && board.every(mark => mark !== '');

        const isGameOver = () => {
            return activePlayer.points === 3;
        };

        const isRoundOver = () => {
            if (!roundWon && !roundTie) {
                return false
            } else {
                if (roundTie) {
                    console.log(`Tie round!`)
                } else if (roundWon) {
                    activePlayer.points += 1;
                    if (isGameOver()) {
                        console.log(`${activePlayer.name} wins the game!`);
                    } else {
                        console.log(`${activePlayer.name} wins this round! Their score is now ${activePlayer.points}`);
                    }
                }
                gameboard.reset();
                return true;
            }
        }

        return isRoundOver();
    }

    gameboard.gridItems.forEach(item => {
        item.addEventListener('click', activePlayer.placeMark);
    });

    return { switchTurns, getActivePlayer, checkPlay }
})();

// const displayController = () => {

// }