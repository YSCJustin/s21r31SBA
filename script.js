document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("sudoku_container");

    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            const cell = document.createElement("div");
            cell.classList.add("sudoku_cell");
            cell.id=`cell_${i+j+1}`
            container.appendChild(cell);
        }
    } 

   let cells = document.getElementsByClassName("sudoku_cell");
   let active_cell = null;
    for(let i = 0; i < cells.length; i++){

        cells[i].addEventListener("click", function(){
            let cell = cells[i];

            if(active_cell === null||active_cell.id !== cell.id){
                cell.style.backgroundColor = 'red';
                if(active_cell !== null){
                    active_cell.style.backgroundColor = 'aliceblue';
                } 
                active_cell = cell;
            }
            
        });

   }









});

