import { Game } from "./game.js";
import * as msgs from "../lang/messages/en/user.js";

// The event listener on the "Go!" button. Clicking on it starts the game
document.getElementById("btnNumSubmit").addEventListener("click", () => {
    const game = new Game();
    const numButtons = Number(document.getElementById("btnNumInput").value);

    if (document.getElementById("classicMode").checked) {
        game.gameMode = 0;
    } else {
        game.gameMode = 1;
    }

    // Input validation
    if (numButtons >= 3 && numButtons <= 7) {
        game.startGame(numButtons);
    } else {
        alert(msgs.inputValidationMsg);
    }
})