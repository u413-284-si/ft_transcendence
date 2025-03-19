export const GameState = {
	ballX: 0,
	ballY: 0,
	ballSpeedX: 4,
	ballSpeedY: 4,
	paddleWidth: 10,
	paddleHeight: 80,
	paddle1Y: 0,
	paddle2Y: 0,
	paddleSpeed: 6,
	player1Score: 0,
	player2Score: 0,
	winningScore: 10,
	gameStarted: false,
	gameOver: false,
	player1: "",
	player2: "",

	initialize(width: number, height: number) {
		this.ballX = width / 2;
		this.ballY = height / 2;
		this.paddle1Y = height / 2 - this.paddleHeight / 2;
		this.paddle2Y = height / 2 - this.paddleHeight / 2;
	}
};
