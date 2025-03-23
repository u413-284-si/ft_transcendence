// import { GameState } from "./config.js";
// import { registerUser } from "./network.js";
// import { startGame } from "./game.js";


// export function drawStartScreen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
// 	ctx.fillStyle = "white";
// 	ctx.font = "40px Arial";
// 	ctx.fillText("Pong Game!", canvas.width / 2 - 100, canvas.height / 2 - 60);

// 	createInputField("usernameInput1", "Player 1", "50%");
// 	createInputField("usernameInput2", "Player 2", "60%");
// 	createRegisterButton("registerButton1", "Register Player 1", "53%", 1);
// 	createRegisterButton("registerButton2", "Register Player 2", "63%", 2);
// }

// function createInputField(id: string, placeholder: string, top: string) {
// 	let input = document.getElementById(id) as HTMLInputElement;
// 	if (!input) {
// 		input = document.createElement("input");
// 		input.id = id;
// 		input.type = "text";
// 		input.placeholder = placeholder;
// 		input.style.position = "absolute";
// 		input.style.transform = "translate(-50%, -50%)";
// 		input.style.top = top;
// 		input.style.left = "50%";
// 		input.style.fontSize = "18px";
// 		input.style.padding = "10px";
// 		input.style.color = "white";
// 		document.body.appendChild(input);
// 	}
// }

// function createRegisterButton(id: string, text: string, top: string, playerNum: number) {
// 	let button = document.getElementById(id) as HTMLButtonElement;
// 	if (!button) {
// 		button = document.createElement("button");
// 		button.id = id;
// 		button.innerText = text;
// 		button.style.position = "absolute";
// 		button.style.transform = "translate(-50%, -50%)";
// 		button.style.top = top;
// 		button.style.left = "50%";
// 		button.style.fontSize = "18px";
// 		button.style.padding = "10px 20px";
// 		button.style.color = "white";
// 		button.onclick = () => registerUser(playerNum).then(checkBothPlayersRegistered);
// 		document.body.appendChild(button);
// 	}
// }

// function checkBothPlayersRegistered() {
// 	if (GameState.player1 && GameState.player2) {
// 		startGame();
// 	}
// }
