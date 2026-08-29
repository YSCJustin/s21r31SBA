
function valid(grid,r,c,num,special){
    for(let i = 0; i < 9; i++){
        if(grid[i][c] === num){
            if(!special || i !== r) return false;
        }
    }
    for(let j = 0; j < 9; j++){
        if(grid[r][j] === num){
             if(!special || j !== c) return false;
        }
    }
    for(let i = Math.floor(r/3)*3; i < Math.floor(r/3)*3+3; i++){
        for(let j = Math.floor(c/3)*3; j < Math.floor(c/3)*3+3; j++){
            if(grid[i][j] === num){
                 if(!special || (i !== r&& j !== c))return false;
            }
        }
    }
    return true;
}

function fetch_candidiates(grid,r,c){
    const candidiates = [];
    for(let num=1; num <= 9; num++){
        if(valid(grid,r,c,num)){
            candidiates.push(num);
        }
    }
    return candidiates;
}

function find_empty(grid,scenario){
    if(scenario === 1){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(grid[i][j]===0){
                    return [i,j];
                }
            }
        }
        return null;  
    } else {
        let min = 10;
        let best = null;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(grid[i][j]===0){
                    const candidiates = fetch_candidiates(grid,i,j);
                    if(candidiates.length === 0){
                        return [-1,-1];
                    }
                    if(candidiates.length < min) {
                        min = candidiates.length;
                        best = [i,j];
                        if(min === 0) return null;
                    }
                }
            }
        }
        return best;
    }
}

function shuffle(){

    let nums=[]; for(let i = 1; i <= 9; i++) nums.push(i);
    for(let i = nums.length-1; i > 0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [nums[i],nums[j]]=[nums[j],nums[i]]
    }
    return nums;
}

function random_cells(){
    let nums = [];
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            nums.push({i,j});
        }
    }
    for(let i = nums.length-1; i > 0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [nums[i],nums[j]]=[nums[j],nums[i]]
    }
    return nums;
}


function solve(grid){
    const empty = find_empty(grid,1);

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

function unique(sudoku_grid){
    let grid=structuredClone(sudoku_grid);
    let cnt = 0;
    function backtrack(){
        if(cnt>=2) return;
        const empty = find_empty(grid,2);
        if(empty && empty[0]==-1) {
            return;
        } 
        if(!empty){
            cnt++;
            return;
        }
        const [r,c] = empty;
        for(let num = 1; num<= 9 && cnt<2; num++){
            if(!valid(grid,r,c,num)) continue;
            grid[r][c] = num;
            backtrack();
            grid[r][c]=0;
        }
    }
    backtrack();
    return (cnt===1);
}

function generate_grid_solved(){
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

function generate_grid(sudoku_grid,difficulty){
    let grid = structuredClone(sudoku_grid);
    let random = random_cells();
    let cnt = 0;
    for(let i = 0; cnt<difficulty&&i<81; i++){
        let temp = grid[random[i].i][random[i].j]
        grid[random[i].i][random[i].j] = 0;
        if(unique(grid)){
            cnt++
        } else grid[random[i].i][random[i].j]=temp;
    }
    return grid;
}

// game features

function get_hint(play_grid,locked_grid){
    let best = null, bcount = Infinity, cand = [];
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(play_grid[i][j] !== 0 || locked_grid[i][j] !== 0) continue;
            const candidates = fetch_candidiates(play_grid,i,j);
            if(candidates.length > 0 && candidates.length < bcount){
                cand = candidates;
                bcount = candidates.length;
                best = [i,j];
            }
        }
    }
    return [best, bcount, cand];
}


// Handling the grid


function solved(sudoku_grid,play_grid){
    let solved = true;
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(sudoku_grid[i][j] !== play_grid[i][j]){
                solved=false;
                break;
            }
        }
        if(!solved) break;
    }
    return solved;
}




document.addEventListener("DOMContentLoaded", function() {
    
    const fail_count = document.getElementById("failcount");
    const timer = document.getElementById("timer");
    const pausebutton = document.getElementById("pause");
    const hintbutton = document.getElementById("hintbutton");
    const hint_count = document.getElementById("hintcount");
    const taunt = document.getElementById("taunt");
    const param = new URLSearchParams(window.location.search);
    const difficulty = param.get("difficulty");
    const strict = param.get("strict")
    const difftext = document.getElementById("diff");
    let game_end = false, paused = false, inputted = false;
    let ptime = 0, ms_total = 0, ms = 0, sec = 0, min = 0, fails = 0,score = 0,hints=0;
    let hints_used = [];
    let start_time = Date.now();

    let timerf=setInterval(time,500);
    function time(){
        ms_total=Date.now()-start_time+ptime;
        sec = Math.floor(ms_total/1000)%60, min = Math.floor(ms_total/60000);
        timer.textContent=`${min<10?`0${min}`:min}:${sec<10?`0${sec}`:sec}`;
    }
    const container = document.getElementById("sudoku_container");

    let sudoku_grid;
    let locked_grid;
    if(difficulty === "easy"){
        difftext.textContent="Sudoku (Easy";
        sudoku_grid = generate_grid_solved()
        locked_grid= generate_grid(sudoku_grid,Math.floor(Math.random()*(45-32+1))+32);
    } else if(difficulty === "medium"){
        difftext.textContent="Sudoku (Medium";
        sudoku_grid = generate_grid_solved()
        locked_grid= generate_grid(sudoku_grid,Math.floor(Math.random()*(55-46+1))+46);
    } else if(difficulty === "hard"){
        if(param.get("harder") === "true"){
            difftext.textContent="Sudoku (Harder";
            taunt.remove();
            let hardest = [
                [1,0,0,0,0,7,0,9,0],
                [0,3,0,0,2,0,0,0,8],
                [0,0,9,6,0,0,5,0,0],
                [0,0,5,3,0,0,9,0,0],
                [0,1,0,0,8,0,0,0,2],
                [6,0,0,0,0,4,0,0,0],
                [3,0,0,0,0,0,0,1,0],
                [0,4,0,0,0,0,0,0,7],
                [0,0,7,0,0,0,3,0,0]
            ]

            let hsolved = [
                [1,0,0,0,0,7,0,9,0],
                [0,3,0,0,2,0,0,0,8],
                [0,0,9,6,0,0,5,0,0],
                [0,0,5,3,0,0,9,0,0],
                [0,1,0,0,8,0,0,0,2],
                [6,0,0,0,0,4,0,0,0],
                [3,0,0,0,0,0,0,1,0],
                [0,4,0,0,0,0,0,0,7],
                [0,0,7,0,0,0,3,0,0]
            ]
            solve(hsolved)
            locked_grid=hardest;
            sudoku_grid=hsolved;
        } else {
            difftext.textContent="Sudoku (Hard";
            taunt.innerHTML = `Are you not satisfied with this hard puzzle? <a href="?difficulty=hard${strict === "true" ? "&strict=true" : ''}&harder=true">Try a harder puzzle!</a>`
            sudoku_grid = generate_grid_solved()
            locked_grid= generate_grid(sudoku_grid,Math.floor(Math.random()*(81-56+1))+56);
        }
    } else { // Random/fallback
        
        if(difficulty !== "random") {
            
            setTimeout(() => {alert(`You have entered an invalid difficulty "${difficulty}". \nAs fallback, the difficulty level of this game is Random.`)},800);
        }
        difftext.textContent="Sudoku (Random";
        sudoku_grid = generate_grid_solved()
        locked_grid= generate_grid(sudoku_grid,Math.floor(Math.random()*(81-32+1))+32);
    } 
    if(strict === "true") difftext.textContent+=' Strict)';
    else difftext.textContent += ')';


    let play_grid = structuredClone(locked_grid);
    let element_grid = [
        [],[],[],[],[],[],[],[],[]
    ]
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            const cell = document.createElement("div");
            cell.classList.add("sudoku_cell");
            cell.id=`cell${i}${j}`
            if(j%3==2){
                cell.style.borderRight = '3.5px solid black';
            }
            if(i%3==2){
                cell.style.borderBottom = '3.5px solid black';
            }
            if(i==0){
                cell.style.borderTop = '3.5px solid black'
            }
            if(j == 0){
                cell.style.borderLeft = '3.5px solid black'
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
        if(strict === "true") {return (target.textContent != sudoku_grid[target.id[4]][target.id[5]] && target.textContent != '')}
        else return (!valid(play_grid,+target.id[4],+target.id[5],+target.textContent,true)&&target.textContent != '');
    }

    function focuscolor(target,scenario){

        if(scenario === 1){ // number same
             if(locked(target.id)){
                target.style.backgroundColor = '#85f7f7'
                target.style.color = "black";
            } else {
                if(check_wrong(target)){
                    target.style.backgroundColor = '#f28b83'
                    target.style.color = '#ffffff';
                } else target.style.backgroundColor = '#85f7f7';
            }
        }
        else if(scenario === 2){ // the target cell itself
             if(locked(target.id)){
                target.style.backgroundColor = '#85d1fa'
                target.style.color = "black";
            } else {
                if(check_wrong(target)){
                    target.style.backgroundColor = '#f76a60'
                } else  target.style.backgroundColor = '#446dd5';
                target.style.color = '#ffffff';
            }
        } else {
            if(locked(target.id)){
                target.style.backgroundColor = '#bfe3f6'
                target.style.color = "black";
            } else {
                if(check_wrong(target)){
                    target.style.backgroundColor = '#f28b83'
                    target.style.color = '#ffffff';
                } else {
                     target.style.backgroundColor = '#9fb5ec';
                     target.style.color = "black";
                }
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
            } else {
                target.style.backgroundColor = 'aliceblue';
                target.style.color='black'
            }
        } else {
            target.style.color = "black";
            target.style.backgroundColor = '#d6e4f0';
        }
        target.style.fontWeight = 'normal';
    }

    function focus(cell){
        if(!cell) return;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(cell.textContent != '' && element_grid[i][j].textContent == cell.textContent){
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
         if(!cell) return;
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
    // handling event listeners
    for(let i = 0; i < cells.length; i++){

        cells[i].addEventListener("click", function(){
            
            if(paused) return;
            if(!inputted)inputted = true;
            let cell = cells[i];
            if(active_cell===null|| active_cell.id !== cell.id) {

                if(active_cell) unfocus(active_cell);
                focus(cell);
            }
            active_cell = cell;
            
        });

   }

    document.addEventListener("keydown", (event) => {
        if(!inputted)inputted = true;
        if(!active_cell || paused) return;
        if(locked_grid[+active_cell.id[4]][+active_cell.id[5]] === 0){
            if(event.key >= "1" && event.key <= "9" && active_cell.textContent !== event.key && !game_end){
                play_grid[active_cell.id[4]][active_cell.id[5]] = (+event.key);
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
                if(solved(sudoku_grid,play_grid)) {
                    pausebutton.disabled=true;
                    hintbutton.disabled=true;
                    setTimeout(() => {
                        alert(`You solved this puzzle with ${fails} fails and ${hints} hints, using ${min<10?`0${min}`:min}:${sec<10?`0${sec}`:sec}!`)
                    },100);
                    timer.textContent=`${min<10?`0${min}`:min}:${sec<10?`0${sec}`:sec} (Ended)`
                    clearInterval(timerf);
                    game_end=true;
                }
            } 
        }
        if((event.key === " " || event.key === "Delete" || event.key === "Backspace") && !game_end){
            if(locked_grid[active_cell.id[4]][active_cell.id[5]] === 0){
                unfocus(active_cell);
                active_cell.textContent = "";
                play_grid[active_cell.id[4]][active_cell.id[5]] = 0;
                focus(active_cell);
            }
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

    hintbutton.addEventListener("click", () => {
        if(!inputted)inputted = true;
        const hint = get_hint(play_grid,locked_grid);
        if(hint[0]){
            hintbutton.disabled = true;
            const pos = hint[0];
            const exists = hints_used.some(position => position.every((value,i) => value === pos[i]));
            const cell = element_grid[pos[0]][pos[1]];

            if(!exists) {
                hint_count.textContent=++hints;
                hints_used.push(pos);
            } else {
                play_grid[pos[0]][pos[1]] = sudoku_grid[pos[0]][pos[1]];
                if(solved(sudoku_grid,play_grid)) play_grid[pos[0]][pos[1]] = 0;
                else {
                    locked_grid[pos[0]][pos[1]]=sudoku_grid[pos[0]][pos[1]];
                    cell.textContent = sudoku_grid[pos[0]][pos[1]];
                    hint_count.textContent=++hints;
                }
                
            }

            let blinks = 0;
            let last_colour;
            let blinking = setInterval(() => {
                if(paused){
                    cell.style.backgroundColor="aliceblue";
                    return clearInterval(blinking);
                }
                if(active_cell !== cell){
                    if(blinks%2===0) {
                        last_colour=cell.style.backgroundColor;
                        cell.style.backgroundColor="#ed5f0d";
                    } else cell.style.backgroundColor=last_colour;
                } else {
                    if(blinks%2===0) {
                        last_colour=cell.style.backgroundColor;
                        cell.style.backgroundColor="#ff0044";
                    } else cell.style.backgroundColor=last_colour; 
                }
                
                blinks++;
                if(blinks===12){
                     clearInterval(blinking);
                     hintbutton.disabled = false;
                     unfocuscolor(cell);
                     focus(active_cell);
                } // after blinking, exits and re-enable
            },300)
        }
    })

    pausebutton.addEventListener("click", () => {
        if(!inputted)inputted = true;
        if(!paused){
            paused = true;
            clearInterval(timerf);
            timer.textContent += " (Paused)"
            ptime=ms_total;
            pausebutton.textContent = "Resume";
            hintbutton.disabled = true;
            active_cell = null;
            for(let i = 0; i < 9; i++){
                for(let j = 0; j < 9; j++){
                    element_grid[i][j].textContent = '';
                    element_grid[i][j].style.backgroundColor = "aliceblue";
                    element_grid[i][j].style.fontWeight = 'normal';
                }
            }
        } else {
            paused = false;
            start_time = Date.now();
            timer.textContent=`${min<10?`0${min}`:min}:${sec<10?`0${sec}`:sec}`;
            timerf = setInterval(time, 500)
            pausebutton.textContent = "Pause";
            hintbutton.disabled = false;
            for(let i = 0; i < 9; i++){
                for(let j = 0; j < 9; j++){
                    if(play_grid[i][j] !== 0){
                        element_grid[i][j].textContent = play_grid[i][j];
                        if(locked(element_grid[i][j].id)){
                            element_grid[i][j].style.backgroundColor = "#d6e4f0";
                        } else if(check_wrong(element_grid[i][j])){
                            element_grid[i][j].style.backgroundColor = '#f28b83'
                            element_grid[i][j].style.color = '#ffffff';
                        } else {
                            element_grid[i][j].style.backgroundColor = "aliceblue";
                            element_grid[i][j].style.color = "black";
                        }
                    }
                }
            }
        }
    });


    window.addEventListener("beforeunload", (event) => {
        if(inputted && !game_end){
            event.preventDefault();
            event.returnValue = '';
        }
    }); // with reference to MDN
   


});

