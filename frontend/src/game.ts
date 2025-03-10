const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Ball properties
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 4, ballSpeedY = 4;

// Paddle properties
const paddleWidth = 10, paddleHeight = 80;
let paddle1Y = canvas.height / 2 - paddleHeight / 2;
let paddle2Y = paddle1Y;
const paddleSpeed = 6;

// Player scores
let player1Score = 0;
let player2Score = 0;
const winningScore = 10;
let gameOver = false;
let gameStarted = false;
let username = localStorage.getItem("username") || "";

// Key states
const keys: { [key: string]: boolean } = {};

// Event Listeners for Paddle Movement
document.addEventListener("keydown", (event) => (keys[event.key] = true));
document.addEventListener("keyup", (event) => (keys[event.key] = false));

// Start the game when the Enter key is pressed
document.addEventListener("keydown", (event) => {
    if (!gameStarted && event.key === "Enter" && username) {
        startGame();
    }
});

function drawStartScreen() {
	ctx.fillStyle = "white";
	ctx.font = "40px Arial";
	ctx.fillText("Pong Game", canvas.width / 2 - 100, canvas.height / 2 - 60);

	ctx.font = "20px Arial";
	ctx.fillText("Enter Username:", canvas.width / 2 - 80, canvas.height / 2 - 20);

	let input = document.getElementById("usernameInput") as HTMLInputElement;
    if (!input) {
        input = document.createElement("input");
        input.id = "usernameInput";
        input.type = "text";
        input.placeholder = "Enter your username";
        input.style.position = "absolute";
        input.style.transform = "translate(-50%, -50%)";
        input.style.top = "50%";
        input.style.left = "50%";
        input.style.fontSize = "18px";
        input.style.padding = "10px";
        document.body.appendChild(input);
    }

    let button = document.getElementById("registerButton") as HTMLButtonElement;
    if (!button) {
        button = document.createElement("button");
        button.id = "registerButton";
        button.innerText = "Register";
        button.style.position = "absolute";
        button.style.transform = "translate(-50%, -50%)";
        button.style.top = "calc(50% + 40px)";
        button.style.left = "50%";
        button.style.fontSize = "18px";
        button.style.padding = "10px 20px";
        button.onclick = registerUser;
        document.body.appendChild(button);
    }
}

function registerUser() {
	const input = document.getElementById("usernameInput") as HTMLInputElement;
	const user = input.value.trim();
	if (!user) return alert("Please enter a username");

	fetch("http://localhost:4000/user/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: user }),
	})
			.then((res) => res.json())
			.then((data) => {
					if (data.success) {
							localStorage.setItem("username", user);
							username = user;
							startGame();
					} else {
							alert(data.message);
					}
			})
			.catch((err) => console.error("Registration failed:", err));
}

function startGame() {
	gameStarted = true;
	resetGame();
	document.getElementById("usernameInput")?.remove();
	document.getElementById("registerButton")?.remove();
}

function update() {
    if (gameOver || !gameStarted) return; // Stop game when someone wins or game hasn't started yet

    // Move paddles based on key presses
    if (keys["w"] && paddle1Y > 0) paddle1Y -= paddleSpeed;
    if (keys["s"] && paddle1Y < canvas.height - paddleHeight) paddle1Y += paddleSpeed;
    if (keys["ArrowUp"] && paddle2Y > 0) paddle2Y -= paddleSpeed;
    if (keys["ArrowDown"] && paddle2Y < canvas.height - paddleHeight) paddle2Y += paddleSpeed;

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top & bottom
    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

    // Ball collision with paddles
    if (
        (ballX <= 20 && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) ||
        (ballX >= canvas.width - 20 && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight)
    ) {
        ballSpeedX *= -1; // Reverse ball direction
    }

    // Ball out of bounds (scoring)
    if (ballX <= 0) {
        player2Score++; // Right player scores
        checkWinner();
        resetBall();
    }
    if (ballX >= canvas.width) {
        player1Score++; // Left player scores
        checkWinner();
        resetBall();
    }
}

function checkWinner() {
    if (player1Score >= winningScore || player2Score >= winningScore) {
        gameOver = true;
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Change direction after scoring
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    gameOver = false;
    gameStarted = true;
    resetBall();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If game hasn't started, show the start screen
    if (!gameStarted) {
        drawStartScreen();
        return;
    }

    // Draw ball
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw paddles
    ctx.fillRect(10, paddle1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - 20, paddle2Y, paddleWidth, paddleHeight);

    // Draw scores
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(player1Score.toString(), canvas.width / 4, 50);
    ctx.fillText(player2Score.toString(), (canvas.width * 3) / 4, 50);

    // Display winner message if game is over
    if (gameOver) {
        ctx.fillStyle = "yellow";
        ctx.font = "40px Arial";
        const winnerText = player1Score >= winningScore ? "Player 1 Wins!" : "Player 2 Wins!";
        ctx.fillText(winnerText, canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press ENTER to Restart", canvas.width / 2 - 100, canvas.height / 2 + 40);
    }
}



function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
