const gameboard = (() => {
    const arr = [...Array(9)].map(x => '');
    const gridItems = document.querySelectorAll('.grid-item');


    const render = function(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                gridItems[i].textContent = arr[i];
            }
        }
    }



    return { arr, gridItems, render };
})();


const createPlayer = (mark) => {
    const setMark = (e) => {
        let index = [...gameboard.gridItems].indexOf(e.target);
        gameboard.arr.splice(index, 1, mark);
        gameboard.render(gameboard.arr);
        // console.log(gameboard.arr);
    }
    gameboard.gridItems.forEach(item => {
        item.addEventListener('click', setMark);
    })

    return { setMark }
};

const player1 = createPlayer('X');
// player1.setMark();

// const player2 = createPlayer();





























// GAMEBOARD MODULE NONSENSE
    // const gridItems = document.querySelectorAll('.grid-item');
    // const addMark = function(mark, item) {
    //     item.textContent = mark;
    // };
    // gridItems.forEach(item => {
    //     item.addEventListener('click', function(mark) {
    //         this.textContent = mark;
    //     });
    // })
    // DOM elements, connecting things, pushing onto array


function player() {
    // player stuff
    // return the player stuff you need
}


