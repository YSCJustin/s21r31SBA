document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("sudoku_container");
    let sudoku_grid = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,5,6,7],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ]

    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            const cell = document.createElement("div");
            cell.classList.add("sudoku_cell");
            cell.id=`cell${i}${j}`
            if(j%3==2){
                cell.style.borderRight = '2px solid black';
            }
            if(i%3==2){
                cell.style.borderBottom = '2px solid black';
            }
            if(i==0){
                cell.style.borderTop = '2px solid black'
            }
            if(j == 0){
                cell.style.borderLeft = '2px solid black'
            }
            
            if(sudoku_grid[i][j] != 0){
                cell.textContent=sudoku_grid[i][j];
                cell.style.backgroundColor='#d6e4f0'
            }

            container.appendChild(cell);
        }
    } 
    let locked_grid = sudoku_grid;

    function locked(id){
        return (locked_grid[+id[4]][+id[5]] > 0);
    }
    let cells = document.getElementsByClassName("sudoku_cell");
    let active_cell = null;

    for(let i = 0; i < cells.length; i++){

        cells[i].addEventListener("click", function(){
            let cell = cells[i];
            
            if((active_cell === null||active_cell.id !== cell.id)){
                if(locked(cell.id)){
                    cell.style.backgroundColor = '#bfe3f6'
                } else {
                    cell.style.backgroundColor = '#5278ae';
                    cell.style.color = 'white';
                }
                cell.style.fontWeight = 'bold';
                if(active_cell !== null){
                    if(!locked(active_cell.id)){
                        active_cell.style.backgroundColor = 'aliceblue';
                        active_cell.style.color='black'
                    } else {
                        active_cell.style.backgroundColor = '#d6e4f0';
                    }
                    active_cell.style.fontWeight = 'normal';
                } 
                active_cell = cell;
            }
            
        });

   }

   document.addEventListener("keydown", (event) => {
        if(!active_cell) return;
        if(locked_grid[+active_cell.id[4]][+active_cell.id[5]] === 0){
            if(event.key >= "1" && event.key <= "9"){
                active_cell.textContent = event.key;
            } else if(event.key === " " || event.key === "Delete" || event.key === "Backspace"){
                active_cell.textContent = "";
            }
        }
   })

});

