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
    let round = 0;
    let status = '';

    const reset = () => {
        player1.points = 0;
        player2.points = 0;
        game.round = 0;
        game.status = '';
    }

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
                    game.status = 'Tie round';
                } else if (roundWon) {
                    activePlayer.points += 1;
                    if (isGameOver()) {
                        displayController.toggleGridItems();
                        displayController.playAgainBtn.classList.add('active');
                        game.status = `${activePlayer.name} wins the game!`;
                    } else {
                        game.status = `${activePlayer.name} wins this round.`;
                    }
                }
                game.round += 1;
                gameboard.reset();
                displayController.scoreboardController().update();
                return true;
            }
        }

        return isRoundOver();
    }

    gameboard.gridItems.forEach(item => {
        item.addEventListener('click', activePlayer.placeMark);
    });

    return { reset, round, player1, player2, switchTurns, getActivePlayer, checkPlay }
})();

const displayController = (() => {
    const toggleGridItems = () => {
        gameboard.gridItems.forEach(item => {
            item.classList.toggle('disabled');
        });
    }

    const formController = () => {
        const form = document.getElementById('form');

        game.player1.name = document.getElementById('player1-name-input').value;
        game.player2.name = document.getElementById('player2-name-input').value;

        const checkNames = () => {
            return game.player1.name !== "" && game.player2.name !== "";
        }

        return { form, checkNames }
    };

    const scoreboardController = () => {
        const scoreboard = document.getElementById('scoreboard');

        const _displayNames = () => {
            const player1Heading = document.getElementById('player1-heading');
            const player2Heading = document.getElementById('player2-heading');

            player1Heading.textContent = `${game.player1.name} (X)`;
            player2Heading.textContent = `${game.player2.name} (O)`;
        }

        const _displayScore = () => {
            const player1Score = document.getElementById('player1-score');
            const player2Score = document.getElementById('player2-score');

            player1Score.textContent = game.player1.points;
            player2Score.textContent = game.player2.points;
        }

        const _displayRoundNum = () => {
            const roundNum = document.getElementById('round-num');
            roundNum.textContent = `Round ${game.round}`;
        }

        const _displayGameStatus = () => {
            const gameStatus = document.getElementById('game-status');
            gameStatus.textContent = game.status;
        }

        const update = () => {
            _displayScore();
            _displayNames();
            _displayRoundNum();
            _displayGameStatus();
        }

        return { scoreboard, update }
    }

    // const btnController = () => {
        
    // }

    const startBtn = document.getElementById('start-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    startBtn.addEventListener('click', function() {
        toggleGridItems();
        formController().form.classList.toggle('active');
        scoreboardController().scoreboard.classList.toggle('active');
        scoreboardController().update();
        startBtn.classList.remove('active');
    });

    document.addEventListener('keyup', function() {
        if (formController().checkNames() && !playAgainBtn.classList.contains('active')) {
            startBtn.classList.add('active');
        } else {
            startBtn.classList.remove('active');
        }
    });

    playAgainBtn.addEventListener('click', function() {
        game.reset();
        gameboard.reset();
        formController().form.classList.toggle('active');
        scoreboardController().scoreboard.classList.toggle('active');
        playAgainBtn.classList.remove('active');
        startBtn.classList.add('active');
    });

    return { toggleGridItems, formController, scoreboardController, playAgainBtn };
})();