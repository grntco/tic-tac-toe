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
        if (e.target.classList.contains('grid-item')) {
            if (!e.target.classList.contains('disabled')) {
                if (!e.target.innerHTML) {
                    let index = [...gameboard.gridItems].indexOf(e.target);
                    gameboard.arr.splice(index, 1, game.getActivePlayer().mark);
                    gameboard.render();
                    if (!game.checkPlay(game.getActivePlayer().mark)) {
                        game.switchTurns();
                    }
                }
            }
        }
    }

    return { name, mark, points, placeMark }
};

const game = (() => {

    const player1 = createPlayer('Player 1', '<i class="fa-solid fa-x"></i>');
    const player2 = createPlayer('Player 2', '<i class="fa-solid fa-o"></i>');

    const round = 0;

    // To start the game
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
                return false;
            } else {
                if (roundTie) {
                    displayController.scoreboardController().updateStatus(`Tie round.`);
                } else if (roundWon) {
                    activePlayer.points += 1;
                    if (isGameOver()) {
                        displayController.toggleGridItems();
                        displayController.playAgainBtn.classList.add('active');
                        displayController.scoreboardController().updateStatus(`${activePlayer.name} wins the game!`);
                    } else {
                        displayController.scoreboardController().updateStatus(`${activePlayer.name} wins this round.`);
                    }
                }
                game.round += 1;
                gameboard.reset();
                displayController.scoreboardController().updateDisplay();
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
    const toggleGridItems = () => {
        gameboard.gridItems.forEach(item => {
            item.classList.toggle('disabled');
        });
    }

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
    };

    const scoreboardController = () => {
        const scoreboard = document.getElementById('scoreboard');
        const player1Heading = document.getElementById('player1-heading');
        const player2Heading = document.getElementById('player2-heading');

        const displayNames = () => {
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

        const displayRoundNum = (num) => {
            const roundNum = document.getElementById('round-num');
            roundNum.textContent = `Round ${num}`;
        }

        const updateStatus = (str) => {
            const status = document.getElementById('status');
            status.textContent = str;
        }

        const updateDisplay = () => {
            displayScore();
            displayNames();
            displayRoundNum(game.round);
        }

        return { toggle, updateStatus, updateDisplay }
    }

    // const btnController = () => {
        
    // }

    const startBtn = document.getElementById('start-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    startBtn.addEventListener('click', function() {
        game.player1.name = formController().player1Name
        game.player2.name = formController().player2Name;
        toggleGridItems();
        formController().toggle();
        scoreboardController().toggle()
        scoreboardController().updateDisplay();
        startBtn.classList.remove('active');
    });

    document.addEventListener('keyup', function() {
        if (formController().checkNames()) {
            startBtn.classList.add('active');
        } else {
            startBtn.classList.remove('active');
        }
    });

    playAgainBtn.addEventListener('click', function() {
        game.player1.points = 0;
        game.player2.points = 0;
        game.round = 0;
        scoreboardController().updateStatus('');
        gameboard.reset();
        formController().toggle();
        scoreboardController().toggle();
        playAgainBtn.classList.remove('active');
        startBtn.classList.add('active');
    });

    return { toggleGridItems, formController, scoreboardController, playAgainBtn };
})();