const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let burgers = [];
let gameOver = false;

let basket = {
    x: 165,
    y: 440,
    width: 70,
    height: 20
};

// Controls (Mouse and Touch)
function moveHandler(e) {
    if (gameOver) return;
    let rect = canvas.getBoundingClientRect();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    basket.x = (clientX - rect.left) * (canvas.width / rect.width) - basket.width / 2;
}

canvas.addEventListener("mousemove", moveHandler);
canvas.addEventListener("touchmove", (e) => { moveHandler(e); e.preventDefault(); }, { passive: false });

function spawnBurger() {
    if (!gameOver) {
        burgers.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: -30,
            speed: 3 + Math.random() * 2
        });
    }
}

function drawBurger(x, y) {
    // Bun
    ctx.fillStyle = "#D97904";
    ctx.beginPath();
    ctx.arc(x, y, 15, Math.PI, 0);
    ctx.fill();
    // Patty
    ctx.fillStyle = "#633517";
    ctx.fillRect(x - 15, y, 30, 6);
    // Bottom Bun
    ctx.fillStyle = "#D97904";
    ctx.fillRect(x - 15, y + 6, 30, 6);
}

function drawHands(x, y) {
    ctx.strokeStyle = "#ffdbac"; 
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    // Left Hand
    ctx.beginPath();
    ctx.arc(x, y, 20, 0.5 * Math.PI, 1.5 * Math.PI);
    ctx.stroke();
    // Right Hand
    ctx.beginPath();
    ctx.arc(x + basket.width, y, 20, 1.5 * Math.PI, 0.5 * Math.PI);
    ctx.stroke();
}

function update() {
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffc107";
        ctx.textAlign = "center";
        ctx.font = "bold 40px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("The burger hit the floor!", canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 50);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Score
    ctx.fillStyle = "#333";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Caught: " + score, 15, 30);

    drawHands(basket.x, basket.y);

    for (let i = 0; i < burgers.length; i++) {
        let b = burgers[i];
        b.y += b.speed;
        drawBurger(b.x, b.y);

        // Catch Collision
        if (b.y + 10 >= basket.y && b.x > basket.x - 15 && b.x < basket.x + basket.width + 15) {
            score++;
            burgers.splice(i, 1);
            i--;
        } 
        // Floor Collision
        else if (b.y > canvas.height) {
            gameOver = true;
        }
    }

    requestAnimationFrame(update);
}

setInterval(spawnBurger, 1000);
update();