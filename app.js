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

    return { arr, gridItems, render, reset }; //Should I return arr?
})();

const createPlayer = (name, mark) => { 
    let points = 0;

    const placeMark = (e) => {
        if (e.target.classList.contains('grid-item') && !e.target.innerHTML) {
            let index = [...gameboard.gridItems].indexOf(e.target);
            gameboard.arr.splice(index, 1, game.getActivePlayer().mark);
            gameboard.render();
            if (!game.checkPlay(game.getActivePlayer().mark)) {
                game.switchTurns();
            }
            game.round += 1;
        }
    }

    return { name, mark, points, placeMark }
};

const game = (() => {

    const round = 0;

    const player1 = createPlayer('G', '<i class="fa-solid fa-x"></i>');
    const player2 = createPlayer('H', '<i class="fa-solid fa-o"></i>');

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

    return { round, player1, player2, switchTurns, getActivePlayer, checkPlay }
})();

const displayController = (() => {
    const formController = () => {
        const form = document.getElementById('form');

        const player1Name = document.getElementById('player1-name-input').value;
        const player2Name = document.getElementById('player2-name-input').value;

        const toggle = () => {
            form.classList.toggle('active');
        }

        const checkNames = () => {
            return player1Name !== "" && player2Name !== "";
        }
        return { toggle, player1Name, player2Name, checkNames }
    }

    const scoreboardController = () => {
        const scoreboard = document.getElementById('scoreboard');
        const player1Heading = document.getElementById('player1-heading');
        const player2Heading = document.getElementById('player2-heading');

        displayNames = () => {
            player1Heading.textContent = `${formController().player1Name} (X)`
            player2Heading.textContent = `${formController().player2Name} (O)`
        }
        
        const toggle = () => {
            scoreboard.classList.toggle('active');
        }

        const displayScore = () => {
            const player1Score = document.getElementById('player1-score');
            const player2Score = document.getElementById('player2-score');

            player1Score.textContent = game.player1.points;
            player2Score.textContent = game.player2.points;
        }

        const displayRoundNum = () => {
            const roundNum = document.getElementById('round-num');
            roundNum.textContent += ` ${game.round}`;
        }

        const displayWinner = () => {
            const status = document.getElementById('status');
            // if (game.player1.points > game.player2.points)
        }

        const displayAllContent = () => {
            displayScore();
            displayNames();
            displayRoundNum();
        }

        return { toggle, displayAllContent }
    }

    const startBtn = document.getElementById('start-btn');

    const displayBtn = () => {
        if (formController().checkNames()) { 
            startBtn.classList.add('active');
        } else {
            startBtn.classList.remove('active');
        };
    }

    startBtn.addEventListener('click', function() {
        formController().toggle();
        scoreboardController().toggle()
        scoreboardController().displayContent();
        // display content
    });

    document.addEventListener('keyup', displayBtn);

    

    // const toggle = (elem) => {
    //     elem.classList.toggle('active');
    // }
    
    return { formController, scoreboardController };
})();