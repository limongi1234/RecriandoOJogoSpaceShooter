const scoreElement = document.getElementById ('score');
const lifeElement = document.getElementById ('life');
const menu = document.querySelector ('.menu');
const startButton = document.querySelector ('.start-button');
const instructions = document.querySelector ('.instructions');
const player = document.querySelector ('.player');
const gameArea = document.querySelector ('#game-area');
const enemiesShips = ['assets/imgs/enemy1.png', 'assets/imgs/enemy2.png', 'assets/imgs/enemy3.png', 'assets/imgs/enemy4.png', 'assets/imgs/enemy5.png', 'assets/imgs/enemy6.png'];
let enemyInterval;
let updateScoreBoardInterval;
let lifes;
let score;

function playGame () 
{
    lifes = 3;
    score = 0;

    menu.style.display = 'none';
    window.addEventListener ('keydown', moveShip);

    updateScoreBoardInterval = setInterval (() => 
    {
        updateScoreBoard ();
    }, 30);

    enemyInterval = setInterval (() => 
    {
        createEnemies ();
    }, 2000);
}

function updateScoreBoard ()
{
    scoreElement.innerText = `Pontuação: ${score}`;
    
    if (lifes === 3)
    
        lifeElement.innerText = "Vidas: 👽👽👽"
    else if (lifes === 2)
        lifeElement.innerText = "Vidas: 👽👽  "
    else if (lifes === 1)
        lifeElement.innerText = "Vidas: 👽    "
    else
        lifeElement.innerText = "Vidas:       "
    
}

function moveShip (event) 
{
    if (event.code === 'ArrowUp') 
    {
        event.preventDefault ()
        moveUp ();
    } else if (event.code === 'ArrowDown') 
    {
        event.preventDefault ()
        moveDown ();
    } else if (event.code === 'Space') 
    {
        event.preventDefault ()
        fireLaser ();
    }
}

function moveUp () 
{
    let topPosition = getComputedStyle (player).getPropertyValue ('top');
    if (topPosition === '0px') 
    
        return;
     else 
     {
        let position = parseInt (topPosition);
        position -= 50;
        player.style.top = `${position}px`;
     }
}

function moveDown () 
{
    let topPosition = getComputedStyle (player).getPropertyValue ('top');
    if (topPosition === '400px') 
    
        return;
     else 
     {
        let position = parseInt (topPosition);
        position += 50;
        player.style.top = `${position}px`;
     }
}

function fireLaser () 
{
    let laser = createLaserElement ();
    gameArea.appendChild (laser);
    moveLaser (laser);
}

function createLaserElement () 
{
    let xPosition = parseInt (window.getComputedStyle (player).getPropertyValue ('left'));
    let yPosition = parseInt (window.getComputedStyle (player).getPropertyValue ('top'));

    let newLaser = document.createElement ('img');
    newLaser.src = 'assets/imgs/laser.png';
    newLaser.classList.add ('laser');
    newLaser.style.left = `${xPosition + 80}px`;
    newLaser.style.top = `${yPosition + 10}px`

    return newLaser;
}

function moveLaser (laser) 
{
    let laserInterval = setInterval (() => 
    {
        let xPosition = parseInt (laser.style.left);
        let enemies = document.querySelectorAll ('.enemy');
        if (xPosition >= 680) 
        
            laser.remove ();
        else 
            laser.style.left = `${xPosition + 8}px`;
        
        enemies.forEach ((enemy) => 
        {
            if (checkLaserCollision (laser, enemy)) 
            {
                enemy.src = 'assets/imgs/light-exp.png';
                enemy.classList.add ('dead');
                enemy.classList.remove ('enemy');
                score += 100;
            }
        })
    }, 10);
}

function createEnemies () 
{
    let newEnemy = document.createElement ('img');
    let enemyImg = enemiesShips [Math.floor (Math.random () * enemiesShips.length)];

    newEnemy.src = enemyImg;
    newEnemy.classList.add ('enemy');
    newEnemy.classList.add ('enemy-transition');
    newEnemy.style.left = '600px';
    newEnemy.style.top = `${Math.floor (Math.random () * 320) + 30}px`;
    gameArea.appendChild (newEnemy);

    moveEnemy(newEnemy);
}

function moveEnemy (enemy) 
{
    let moveEnemyInterval = setInterval (() => 
    {
        let xPosition = parseInt (window.getComputedStyle (enemy).getPropertyValue ('left'));
        if (xPosition <= 100) 
        {
            if(enemy.classList.contains ('dead')) 
            
                enemy.remove();
            else 
            {
                lifes --;
                score -= 50;
                enemy.remove ();

                if (lifes === 0)
                    gameOver();
            }
        } else 
        
            enemy.style.left = `${xPosition - 4}px`;
        
    }, 30);
}

function checkLaserCollision (laser, enemy) 
{
    let laserTop = parseInt (laser.style.top);
    let laserLeft = parseInt (laser.style.left);
    let enemyTop = parseInt (enemy.style.top);
    let enemyLeft = parseInt (enemy.style.left);
    let enemyBottom = enemyTop + 70;

    if (laserLeft < 680 && laserLeft + 40 >= enemyLeft) 
    {
        if (laserTop >= enemyTop && laserTop <= enemyBottom) 
        
            return true;
        else 
            return false;
        
    } else 
    
        return false;
}

function gameOver () 
{
    window.removeEventListener ('keydown',moveShip);
    clearInterval (enemyInterval);

    let enemies = document.querySelectorAll ('.enemy');
    enemies.forEach ((enemy) => enemy.remove ());
    let lasers = document.querySelectorAll ('.laser');
    lasers.forEach ((laser) => laser.remove ());
    setTimeout (() => 
    {
        player.style.top = "200px";
        instructions.innerHTML = "<br>Fim de Jogo! <br><br>";
        startButton.innerHTML = "Jogar<br>novamente";
        menu.style.display = "block";
    });
}