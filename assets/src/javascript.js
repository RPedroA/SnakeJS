var canvas = document.getElementById('game');

var context = canvas.getContext('2d');

var grid = 16; //resulta da multiplicação de 16*25 para 400px

var count = 0;

var score = 0;

var hscore = 0;

var loop = 0;

var snake ={
    x:160,
    y:160,
    dx:grid,
    dy:0,
    cells:[],
    maxCells:4,
};

var apple ={
    x:320,
    y:320,
};

var apple2 ={
    x:320,
    y:320, 
}

var wall ={
    x:320,
    y:320,
}

// Function to place the apples and wall initially
function placeObjects() {
    apple.x = getRandom(0, 25) * grid;
    apple.y = getRandom(0, 25) * grid;

    // Ensure apple2 doesn't overlap with apple
    do {
        apple2.x = getRandom(0, 25) * grid;
        apple2.y = getRandom(0, 25) * grid;
    } while (apple2.x === apple.x && apple2.y === apple.y);

    // Ensure wall doesn't overlap with apples
    do {
        wall.x = getRandom(0, 25) * grid;
        wall.y = getRandom(0, 25) * grid;
    } while ((wall.x === apple.x && wall.y === apple.y) || (wall.x === apple2.x && wall.y === apple2.y));
}

// Colocar objetos
placeObjects();


function jogo() {
    requestAnimationFrame(jogo);
    //diminuir velocidade
    if (++count < 5) {
        return;
    }

    count=0;
    context.clearRect(0,0,canvas.width,canvas.height);

    //posição do snake no novo local em função da velocidade
    snake.x+=snake.dx;
    snake.y+=snake.dy;

    if(snake.x<0){
        snake.x=canvas.width-grid;
    } else if(snake.x>=canvas.width) {
        snake.x=0;    
    }

    //wrap Y
    if(snake.y<0){
        snake.y=canvas.height-grid;
    } else if(snake.y>=canvas.height) {
        snake.y=0;
    }

    //inicio do array
    snake.cells.unshift({x:snake.x, y:snake.y});

    //limpa posições anteriores
    if (snake.cells.length === snake.maxCells) {
        snake.cells.pop();
    } 

    //desenhar as maçãs
    context.fillStyle="#ff0000";
    context.fillRect(apple.x, apple.y, grid-1, grid-1);
    
    //desenhar segunda maçã
    if(score >= 40){
        context.fillStyle="#ff0000";
        context.fillRect(apple2.x, apple2.y, grid-1, grid-1);
    }

    //desenhar parede
    if(score >= 80){
        context.fillStyle="#eceff1";
        context.fillRect(wall.x, wall.y, grid-1, grid-1);
    }
   
    //desenhar cobra
    context.fillStyle='#FFFF00';
    snake.cells.forEach(function(cell, index){
        context.fillRect(cell.x, cell.y, grid-1, grid-1);

        //cobra a comer maçã
        if(cell.x===apple.x && cell.y===apple.y)
        {
            snake.maxCells++;
            apple.x=getRandom(0,25)*grid;
            apple.y=getRandom(0,25)*grid;
            score += 10;
            if(score > hscore) {
                hscore = score;
            }

            document.getElementById('score').innerText = "Score: " + score;
            document.getElementById('hscore').innerText = "High Score: " + hscore;
        }

        if(cell.x===apple2.x && cell.y===apple2.y)
        {
            snake.maxCells++;
            apple2.x=getRandom(0,25)*grid;
            apple2.y=getRandom(0,25)*grid;
            score += 10;
            if(score > hscore) {
                hscore = score;
            }

            document.getElementById('score').innerText = "Score: " + score;
            document.getElementById('hscore').innerText = "High Score: " + hscore;
        }

        //verificar colisões
        for(var i=index+1; i<snake.cells.length; i++)
        {
            //se ocupa o mesmo espaço do corpo
            if(cell.x===snake.cells[i].x && cell.y===snake.cells[i].y){
                reset();
            }
            //se espetar-se contra o muro RIP/RTP.pt
            else if (cell.x === wall.x && cell.y === wall.y){
                reset();
            }
        
        }
    });
}

function reset() {

    snake.x=160;
    snake.y=160;
    snake.cells=[];
    snake.maxCells=4;
    snake.dx=grid;
    snake.dy=0;
    apple.x=getRandom(0,25)*grid;
    apple.y=getRandom(0,25)*grid;
    apple2.y=getRandom(0,25)*grid;
    apple2.x=getRandom(0,25)*grid
    score = 0;
    wall.x=getRandom(0,25)*grid;
    wall.y=getRandom(0,25)*grid;
}


//verificar qual a tecla que está a ser pressionada
document.addEventListener('keydown', function(e){
    //seta para esquerda
    if(e.which===37 && snake.dx===0)
    {
        snake.dx=-grid;
        snake.dy=0;
    }

    //para cima
    else if(e.which===38 && snake.dy===0){
        snake.dy=-grid;
        snake.dx=0;
    }

    //direita
    else if(e.which===39 && snake.dx===0){
        snake.dx=grid;
        snake.dy=0;
    }

    //para baixo
    else if(e.which===40 && snake.dy===0)
    {
        snake.dy=grid;
        snake.dx=0;
    }



});

function getRandom(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

requestAnimationFrame(jogo); 