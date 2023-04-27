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
    } //this isn't rendering for some reason...

    return { arr, gridItems, render, reset }; //Don't need to return arr, just doing so for now
})();

const createPlayer = (name, mark) => { 
    let points = 0;

    const placeMark = (e) => {
        if (!e.target.innerHTML) {
            let index = [...gameboard.gridItems].indexOf(e.target);
            gameboard.arr.splice(index, 1, game.getActivePlayer().mark);
            gameboard.render();
            if (game.checkRoundOver(game.getActivePlayer().mark)) {
                game.checkRoundOver(game.getActivePlayer().mark).endRound();
            }
            game.switchTurns();
        }
    }

    return { name, mark, points, placeMark }
};

const game = (() => {

    const player1 = createPlayer('Grant', '<i class="fa-solid fa-x"></i>');
    const player2 = createPlayer('Hal', '<i class="fa-solid fa-o"></i>');

    let activePlayer = player1;

    const switchTurns = () => {
        activePlayer = activePlayer === player1 ? player2 : player1
    }

    const getActivePlayer = () => activePlayer;

    const checkRoundOver = (mark) => {
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


        let roundWin = winningPatterns.includes(true);
        let tie = winningPatterns.every(pattern => pattern === false) && board.every(mark => mark !== '')

        // console.log(roundWin);
        // console.log(tie);

        const endRound = () => {
            if (roundWin) {
                activePlayer.points += 1;
                console.log(`${activePlayer.name} wins this round! Their score is now ${activePlayer.points}`);
                setTimeout(() => {
                    gameboard.reset();
                }, 5000);
            } else if (tie) {
                console.log(`Tie game!`)
            }
        }        
        return { endRound }
        // return roundWin || tie;  
    }


    // const endRound = () => { 
    //     if (checkRoundOver(activePlayer.mark)) {
    //         printRoundWinner();
    //     }
    // }

    gameboard.gridItems.forEach(item => {
        item.addEventListener('click', activePlayer.placeMark);
    });

    const end = () => {
        if (activePlayer.points === 3) {
            console.log(`${activePlayer.name} wins the game!`)
        }
    } // ?? Is this where this should go ??

    return { switchTurns, getActivePlayer, checkRoundOver }
})();