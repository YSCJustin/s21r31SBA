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
    let element_grid = [
        [],[],[],[],[],[],[],[],[]
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
                cell.style.backgroundColor='#d3def2'
            }
            element_grid[i][j]=cell
            container.appendChild(cell);
        }
    } 
    let locked_grid = sudoku_grid;

    let cells = document.getElementsByClassName("sudoku_cell");
    let active_cell = null;

    function locked(id){
        return (locked_grid[+id[4]][+id[5]] > 0);
    }
    function focuscolor(target,scenario){
        if(scenario === 1){ // number same
            if(locked(target.id)){
                target.style.backgroundColor = '#e7ffff'
            } else {
                target.style.backgroundColor = '#799bde';
            }
        }
        else if(scenario === 2){ // the target cell itself
             if(locked(target.id)){
                target.style.backgroundColor = '#85d1fa'
            } else {
                target.style.backgroundColor = '#6a8ce2';
                target.style.color = '#ffffff';
            }
        } else {
            if(locked(target.id)){
                target.style.backgroundColor = '#bfe3f6'
            } else {
                target.style.backgroundColor = '#9fb5ec';
            }
        }
        target.style.fontWeight = 'bold';
        
    }
    function unfocuscolor(target){
        if(!locked(target.id)){
            target.style.backgroundColor = 'aliceblue';
            target.style.color='black'
        } else {
            target.style.backgroundColor = '#d6e4f0';
        }
        target.style.fontWeight = 'normal';
    }

    function focus(cell){

        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(element_grid[i][j].textContent == cell.textContent && cell.textContent != ''){
                    focuscolor(element_grid[i][j],1);
                } else if(i >= Math.floor(cell.id[4]/3)*3 && i < Math.floor(cell.id[4]/3)*3+3 && j >= Math.floor(cell.id[5]/3)*3 && j < Math.floor(cell.id[5]/3)*3+3){
                    focuscolor(element_grid[i][j]);
                } else if(i == cell.id[4] || j == cell.id[5]){
                    focuscolor(element_grid[i][j]);
                } 
            }
        }
        focuscolor(cell,2);
     
    }
    function unfocus(cell){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(element_grid[i][j].textContent == cell.textContent && cell.textContent != ''){
                    unfocuscolor(element_grid[i][j]);
                } else if(i >= Math.floor(cell.id[4]/3)*3 && i < Math.floor(cell.id[4]/3)*3+3 && j >= Math.floor(cell.id[5]/3)*3 && j < Math.floor(cell.id[5]/3)*3+3){
                    unfocuscolor(element_grid[i][j]);
                } else if(i == cell.id[4] || j == cell.id[5]){
                    unfocuscolor(element_grid[i][j]);
                } 
            }
        }
    }

    for(let i = 0; i < cells.length; i++){

        cells[i].addEventListener("click", function(){
            let cell = cells[i];
            if(active_cell===null|| active_cell.id !== cell.id) {

                if(active_cell) unfocus(active_cell);
                focus(cell);
            }
            active_cell = cell;
            
        });

   }

   document.addEventListener("keydown", (event) => {
        if(!active_cell) return;
        if(locked_grid[+active_cell.id[4]][+active_cell.id[5]] === 0){
            if(event.key >= "1" && event.key <= "9"){
                if(active_cell.textContent !== ''){
                    for(let i = 0; i < 9; i++){
                        for(let j = 0; j < 9; j++){
                            if(i == active_cell.id[4] && j == active_cell.id[5]) continue;
                            if(element_grid[i][j].textContent == active_cell.textContent && active_cell.textContent != ''){
                               unfocuscolor(element_grid[i][j],1);
                        }
                    }
                    }
                }
                active_cell.textContent = event.key;
                for(let i = 0; i < 9; i++){
                    for(let j = 0; j < 9; j++){
                        if(i == active_cell.id[4] && j == active_cell.id[5]) continue;
                        if(element_grid[i][j].textContent == active_cell.textContent && active_cell.textContent != '' && !(i >= Math.floor(active_cell.id[4]/3)*3 && i < Math.floor(active_cell.id[4]/3)*3+3 && j >= Math.floor(active_cell.id[5]/3)*3 && j < Math.floor(active_cell.id[5]/3)*3+3)){
                            focuscolor(element_grid[i][j],1);
                    }
                  }
                }
                // focus(active_cell);
            } else if(event.key === " " || event.key === "Delete" || event.key === "Backspace"){
                unfocus(active_cell);
                active_cell.textContent = "";
                active_cell = null;
            }
        }
       
   })

});

