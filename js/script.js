import { Game } from "./game.js";
import * as msgs from "../lang/messages/en/user.js";

// The event listener on the "Go!" button. Clicking on it starts the game
document.getElementById("btnNumSubmit").addEventListener("click", () => {
    const game = new Game();
    const numButtons = document.getElementById("btnNumInput").value;

    // Input validation
    if (numButtons >= 3 && numButtons <= 7) {
        game.startGame(numButtons);
    } else {
        alert(msgs.inputValidationMsg);
    }
})