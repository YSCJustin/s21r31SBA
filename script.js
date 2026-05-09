
function valid(grid,r,c,num){
    for(let i = 0; i < 9; i++){
        if(grid[i][c] === num){
            return false;
        }
    }
    for(let j = 0; j < 9; j++){
        if(grid[r][j] === num){
            return false;
        }
    }
    for(let i = Math.floor(r/3)*3; i < Math.floor(r/3)*3+3; i++){
        for(let j = Math.floor(c/3)*3; j < Math.floor(c/3)*3+3; j++){
            if(grid[i][j] === num){
                return false;
            }
        }
    }
    return true;
}

function find_empty(grid){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(grid[i][j]===0){
                return [i,j];
            }
        }
    }
    return null;
}

function shuffle(){
    let nums=[]; for(let i = 1; i <= 9; i++) nums.push(i);
    for(let i = nums.length-1; i > 0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [nums[i],nums[j]]=[nums[j],nums[i]]
    }
    return nums;
}


function solve(grid){
    const empty = find_empty(grid);

    if(!empty) return true;

    const [r,c] = empty;
    const nums = shuffle();
    for(const num of nums){
        if(!valid(grid,r,c,num)) continue;
        grid[r][c] = num;
        if(solve(grid)){
            return true;
        }

         grid[r][c]=0;
    }
    return false;

}

function generate_grid(difficulty){
    let grid = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ];
    solve(grid)
    return grid;
}

// Game statistics





// Handling the grid


document.addEventListener("DOMContentLoaded", function() {
    const fail_count = document.getElementById("failcount");
    let fails = 0,score = 0;


    const container = document.getElementById("sudoku_container");
    // let sudoku_grid = [
    //     [0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0]
    // ]
    const sudoku_grid = generate_grid();
    let locked_grid = structuredClone(sudoku_grid);
    locked_grid[6][6] = locked_grid[6][7] = locked_grid[6][8] = locked_grid[7][6]=locked_grid[7][7]=locked_grid[7][8]=locked_grid[8][6]=locked_grid[8][7]=locked_grid[8][8]= 0
    let play_grid = structuredClone(sudoku_grid);
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
            
            if(locked_grid[i][j] != 0){
                cell.textContent=sudoku_grid[i][j];
                cell.style.backgroundColor='#d3def2'
            }
            element_grid[i][j]=cell
            container.appendChild(cell);
        }
    } 

    let cells = document.getElementsByClassName("sudoku_cell");
    let active_cell = null;

    function locked(id){
        return (locked_grid[+id[4]][+id[5]] > 0);
    }
    function check_wrong(target){
        return (target.textContent != sudoku_grid[target.id[4]][target.id[5]] && target.textContent != '')
    }

    function focuscolor(target,scenario){

        if(scenario === 1){ // number same
             if(locked(target.id)){
                target.style.backgroundColor = '#aafafa'
            } else {
                if(check_wrong(target)){
                    target.style.backgroundColor = '#f28b83'
                    target.style.color = '#ffffff';
                } else target.style.backgroundColor = '#799bde';
            }
        }
        else if(scenario === 2){ // the target cell itself
             if(locked(target.id)){
                target.style.backgroundColor = '#85d1fa'
            } else {
                if(check_wrong(target)){
                    target.style.backgroundColor = '#f76a60'
                } else  target.style.backgroundColor = '#6a8ce2';
                target.style.color = '#ffffff';
            }
        } else {
            if(locked(target.id)){
                target.style.backgroundColor = '#bfe3f6'
            } else {
                if(check_wrong(target)){
                    target.style.backgroundColor = '#f28b83'
                    target.style.color = '#ffffff';
                } else  target.style.backgroundColor = '#9fb5ec';
            }
        }
        target.style.fontWeight = 'bold';
        
    }
    function unfocuscolor(target){
        // if(target.textContent == sudoku_grid[target.id[4]][target.id[5]]) return;
        if(!locked(target.id)){
            if(check_wrong(target)){
                target.style.backgroundColor = '#f28b83'
                target.style.color = '#ffffff';
            } else  {
                target.style.backgroundColor = 'aliceblue';
                target.style.color='black'
            }
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
                if(cell.textContent !== null && element_grid[i][j].textContent == cell.textContent){
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
            if(event.key >= "1" && event.key <= "9" && active_cell.textContent !== event.key){

                if(active_cell.textContent !== ''){
                    //remove colour from previous same number cells
                    for(let i = 0; i < 9; i++){
                        for(let j = 0; j < 9; j++){
                            if(i == active_cell.id[4] && j == active_cell.id[5]) continue;
                            if(element_grid[i][j].textContent == active_cell.textContent && active_cell.textContent != ''){ 
                                unfocuscolor(element_grid[i][j]);
                                if(i == active_cell.id[4] || j == active_cell.id[5]){
                                    focuscolor(element_grid[i][j]);
                                }
                            }
                            if((i >= Math.floor(active_cell.id[4]/3)*3 && i < Math.floor(active_cell.id[4]/3)*3+3 && j >= Math.floor(active_cell.id[5]/3)*3 && j < Math.floor(active_cell.id[5]/3)*3+3)){
                                focuscolor(element_grid[i][j]);
                            }
                            
                    }
                    }
                }
                active_cell.textContent = event.key;
                if(check_wrong(active_cell)) {
                    fails++;
                    fail_count.textContent=fails;
                }


                for(let i = 0; i < 9; i++){
                    for(let j = 0; j < 9; j++){
                        if(i == active_cell.id[4] && j == active_cell.id[5]) continue;
                        if(element_grid[i][j].textContent == active_cell.textContent && active_cell.textContent != ''){
                            focuscolor(element_grid[i][j],1);
                    }
                  }
                }

                focuscolor(active_cell,2);
            } 
        }
        if(event.key === " " || event.key === "Delete" || event.key === "Backspace"){
            unfocus(active_cell);
            if(locked_grid[active_cell.id[4]][active_cell.id[5]] === 0){
                active_cell.textContent = "";
            }
            unfocuscolor(active_cell);
            active_cell = null;
        } else if(event.key === "Escape"){
            unfocus(active_cell);
            active_cell = null;
        } else if(event.key.includes("Arrow")){
            if(event.key.includes("Up")){
                if(active_cell.id[4]-1 >= 0){
                    unfocus(active_cell);
                    active_cell = element_grid[active_cell.id[4]-1][active_cell.id[5]];
                    focus(active_cell);
                }
            } else if(event.key.includes("Down")){
                if((+active_cell.id[4])+1 < 9){
                    unfocus(active_cell);
                    active_cell = element_grid[+active_cell.id[4]+1][active_cell.id[5]];
                    focus(active_cell);
                }
            } else if(event.key.includes("Left")){
                if(active_cell.id[5]-1 >= 0){
                    unfocus(active_cell);
                    active_cell = element_grid[active_cell.id[4]][active_cell.id[5]-1];
                    focus(active_cell);
                }
            } else if(event.key.includes("Right")){
                if((+active_cell.id[5])+1 < 9){
                    unfocus(active_cell);
                    active_cell = element_grid[active_cell.id[4]][+active_cell.id[5]+1];
                    focus(active_cell);
                }
            }
        }
       
   })

});

