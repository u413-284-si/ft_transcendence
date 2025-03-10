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
let player1 = "";
let player2 = "";

// Key states
const keys: { [key: string]: boolean } = {};

// Event Listeners for Paddle Movement
document.addEventListener("keydown", (event) => (keys[event.key] = true));
document.addEventListener("keyup", (event) => (keys[event.key] = false));

// Start the game when the Enter key is pressed
document.addEventListener("keydown", (event) => {
    if (!gameStarted && event.key === "Enter" && player1 && player2) {
        startGame();
    }
});

function drawStartScreen() {
	ctx.fillStyle = "white";
	ctx.font = "40px Arial";
	ctx.fillText("Pong Game", canvas.width / 2 - 100, canvas.height / 2 - 60);

	createInputField("usernameInput1", "Player 1", "50%");
	createInputField("usernameInput2", "Player 2", "60%");
	createRegisterButton("registerButton1", "Register Player 1", "53%", 1);
	createRegisterButton("registerButton2", "Register Player 2", "63%", 2);
}

function createInputField(id: string, placeholder: string, top: string) {
	let input = document.getElementById(id) as HTMLInputElement;
	if (!input) {
			input = document.createElement("input");
			input.id = id;
			input.type = "text";
			input.placeholder = placeholder;
			input.style.position = "absolute";
			input.style.transform = "translate(-50%, -50%)";
			input.style.top = top;
			input.style.left = "50%";
			input.style.fontSize = "18px";
			input.style.padding = "10px";
			document.body.appendChild(input);
	}
}

function createRegisterButton(id: string, text: string, top: string, playerNum: number) {
	let button = document.getElementById(id) as HTMLButtonElement;
	if (!button) {
			button = document.createElement("button");
			button.id = id;
			button.innerText = text;
			button.style.position = "absolute";
			button.style.transform = "translate(-50%, -50%)";
			button.style.top = top;
			button.style.left = "50%";
			button.style.fontSize = "18px";
			button.style.padding = "10px 20px";
			button.onclick = () => registerUser(playerNum);
			document.body.appendChild(button);
	}
}

function registerUser(playerNum: number) {
	const input = document.getElementById(`usernameInput${playerNum}`) as HTMLInputElement;
	const user = input.value.trim();
	if (!user) return alert(`Please enter a username for Player ${playerNum}`);

	fetch("http://localhost:4000/user/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: user }),
	})
			.then((res) => res.json())
			.then((data) => {
					if (data.success) {
							if (playerNum === 1)
								player1 = user;
            	else 
								player2 = user;
            	checkBothPlayersRegistered();
					} else {
							alert(data.message);
					}
			})
			.catch((err) => console.error("Registration failed:", err));
}

function checkBothPlayersRegistered() {
	if (player1 && player2) {
			startGame();
	}
}

function startGame() {
	gameStarted = true;
	resetGame();
	document.getElementById("usernameInput1")?.remove();
	document.getElementById("usernameInput2")?.remove();
	document.getElementById("registerButton1")?.remove();
	document.getElementById("registerButton2")?.remove();
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

function shortenName(name: string, maxLength: number = 10): string {
	if (name.length > maxLength) {
			return name.slice(0, maxLength) + "."; // Trim the name and add '...'
	}
	return name;
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

    // Draw player names and scores
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    // Player 1 name and score
		const player1Text = shortenName(player1 || "Player 1") + ":" + " " + player1Score.toString();
    ctx.fillText(player1Text, canvas.width / 4 - 80, 50);

    // Player 2 name and score
		const player2Text = shortenName(player2 || "Player 2") + ":" + " " + player2Score.toString();
		ctx.fillText(player2Text, (canvas.width * 3) / 4 - 80, 50);
		
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
