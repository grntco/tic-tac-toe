const gameboard = (() => {
    const arr = [...Array(9)].map(x => '');
    const gridItems = document.querySelectorAll('.grid-item');

    const render = function() {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                gridItems[i].textContent = arr[i];
            }
        }
    }

    return { arr, gridItems, render }; //Don't need to return arr, just doing so for now
})();

const createPlayer = (name, mark) => { 
    let points = 0;

    const placeMark = (e) => {
        console.log('Why is this working?')
        let index = [...gameboard.gridItems].indexOf(e.target);
        gameboard.arr.splice(index, 1, mark);
        gameboard.render();
        game.switchTurns();
    }

    gameboard.gridItems.forEach(item => {
        item.addEventListener('click', placeMark);
    });

    return { name, mark, placeMark }
};

const player1 = createPlayer('Grant', 'X');
const player2 = createPlayer('Hal', 'O');

const game = (() => {

    let activePlayer = player1;

    const switchTurns = () => {
        activePlayer = activePlayer === player1 ? player2 : player1
    }

    const getActivePlayer = () => activePlayer;

    return { switchTurns, getActivePlayer }
})();

console.log(game.getActivePlayer()); 
game.switchTurns();
console.log(game.getActivePlayer()); 
game.switchTurns();
console.log(game.getActivePlayer()); 




// game.play();