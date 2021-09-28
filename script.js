const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image()
img.src = './media/flappy-bird-set.png';

// General Settings //
let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

// Pipe Settings //
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;


let index = 0,
    bestScore = 0,
    currentScore = 0,
    pipes = [],
    flight,
    flyHeight;

const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    // Pipes //
        // Array().fill crée un tableau qui peut accueillir plusieurs tableaux avec les données sélectionnées //
        pipes = Array(3).fill().map((a, i) =>
            [
            canvas.width + (i * (pipeGap + pipeWidth)), 
            pipeLoc()
            ]
        );
            // Fais commencer le tuyau à la fin du canvas avec des intervalles //
            // entre les 3 tuyaux égaux à un certain écart(pipeGap) + la largeur du tuyau(pipeWidth) // 
}    

const render = () => {
    index++;

    // Background //
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);

    // Bird (playing) //
    if(gamePlaying){
        // drawImage Bird //
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
        flight += gravity;

    } else {
        // drawImage Bird //
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);

        // Write Best Score //
        ctx.fillText(`Meilleur Score : ${bestScore}`, 55, 245);
        ctx.font = "bold 30px courier";

        // Write Start Playing //
        ctx.fillText(`Cliquez pour jouer`, 48, 535);
    }

    // Pipe Display //
    if(gamePlaying){
        pipes.map(pipe => {
            // Rapproche le tuyau de 6px à chaque rafraîchissement du canvas //
            pipe[0] -= speed;

            // Top Pipe //
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);

            // Bottom Pipe //
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap)
            
            if(pipe[0] <= -pipeWidth) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);

                // remove Pipe + create New One //
                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
                
                // slice = retire le premier poteau de la liste
                // après la virgule, sert à prendre la donnée du deuxième poteau 
                // et rajoute pipeGap et pipeWidth pour définir la position du 3e poteau, 
                // puis pipeLoc pour sa hauteur aléatoire //
            }

            // if hit the pipe, end //
            if([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)){
                gamePlaying = false,
                setup();
            }
        })
    }

    document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;

    // Bird //
    
    window.requestAnimationFrame(render);
}

setup();
img.onload = render;

document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;