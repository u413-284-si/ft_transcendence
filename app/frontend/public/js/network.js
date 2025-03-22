var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GameState } from "./config.js";
export function registerUser(playerNum) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = document.getElementById(`usernameInput${playerNum}`);
        const user = input.value.trim();
        if (!user)
            return alert(`Please enter a username for Player ${playerNum}`);
        try {
            // Check if the username already exists
            const checkResponse = yield fetch(`http://localhost:4000/user/get?username=${encodeURIComponent(user)}`);
            const checkData = yield checkResponse.json();
            if (checkData.exists) {
                alert(`Username "${user}" is already taken.`);
                return;
            }
            // Register user
            const registerResponse = yield fetch("http://localhost:4000/user/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user }),
            });
            const registerData = yield registerResponse.json();
            if (registerData.success) {
                if (playerNum === 1)
                    GameState.player1 = user;
                else
                    GameState.player2 = user;
            }
            else {
                alert(registerData.error);
            }
        }
        catch (err) {
            console.error("Registration failed:", err);
        }
    });
}
