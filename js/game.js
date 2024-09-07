import { Button } from "./button.js";
import * as msgs from "../lang/messages/en/user.js";

export class Game {
    constructor() {
        this.numButtons = 0;
        this.order = 1;
        this.buttonArrayObj = [];
        this.buttonArrayDOM = [];
        this.availableColours = ["crimson", "darkorange", "gold", "lawngreen", "aqua", "blueviolet", "bisque"];
        this.usedColours = [];
        this.gameMode = 0;
        this.isGameOver = false;
    }

    /**
     * Starts and controls the game
     * 
     * @param {number} numButtons The number of buttons
     */
    startGame(numButtons) {
        document.getElementById("msg").innerHTML = "";
        this.disableInputs();
        this.removeButtons();
        this.resetColourArrays();
        this.setNumButtons(numButtons);
        this.generateButtons();
        this.scramble();
        this.hideAllNumbers();
        this.startGuessingPhase();
    }

    disableInputs() {
        document.getElementById("btnNumInput").setAttribute("disabled", true);
        document.getElementById("btnNumSubmit").setAttribute("disabled", true);
        document.getElementById("classicMode").setAttribute("disabled", true);
        document.getElementById("timedMode").setAttribute("disabled", true);
    }

    enableInputs() {
        document.getElementById("btnNumInput").removeAttribute("disabled");
        document.getElementById("btnNumSubmit").removeAttribute("disabled");
        document.getElementById("classicMode").removeAttribute("disabled");
        document.getElementById("timedMode").removeAttribute("disabled");
    }

    /**
     * Removes the buttons from the page and empties the arrays
     */
    removeButtons() {
        const memoryButtons = document.getElementById("buttonArea").childNodes;
        const numMemoryButtons = memoryButtons.length;
        for (let i = 0; i < numMemoryButtons; i++) {
            memoryButtons[0].parentNode.removeChild(memoryButtons[0]);
        }
        this.buttonArrayObj.length = 0;
        this.buttonArrayDOM.length = 0;
    }

    /**
     * Moves all colour strings from usedColours to availableColours
     */
    resetColourArrays() {
        while (this.usedColours.length >= 1) {
            this.availableColours.push(this.usedColours[0]);
            this.usedColours.shift();
        }
    }

    /**
     * Sets the number of buttons
     * 
     * @param {number} count The number of buttons based on user input
     */
    setNumButtons(count) {
        this.numButtons = count;
    }

    /**
     * Instantiates Button objects and stores them in buttonArrayObj.
     */
    generateButtons() {
        for (let i = 0; i < this.numButtons; i++) {
            const btn = new Button(this.selectRandomColour(), i + 1, i * 12);
            this.buttonArrayObj[i] = btn;
            btn.appendToPage(i, this.buttonArrayDOM);
        }
    }

    /**
     * Randomly selects a colour from available colours
     * 
     * @returns an available colour
     */
    selectRandomColour() {
        const index = Math.floor(Math.random() * (this.availableColours.length - 1));
        const colour = this.availableColours[index];
        this.usedColours.push(colour);
        this.availableColours.splice(index, 1);
        return colour;
    }

    /**
     * Pauses n seconds, then calls to move the buttons.
     * Repeat n times with a pause of 2 seconds each
     */
    scramble() {
        let counter = 0;
        const timeout = this.numButtons * 1000;

        const initialInterval = setInterval(() => {
            const secondInterval = setInterval(() => {
                counter++;
                if (counter === this.numButtons) {
                    this.makeButtonsClickable();
                    clearInterval(secondInterval);
                    if (this.gameMode === 1) {
                        this.startTimer(this.numButtons * 2);
                    }
                }
                this.moveButtons(this.numButtons);
            }, 2000);
            clearInterval(initialInterval);
        }, timeout);
    }

    /**
     * Makes the buttons clickable by removing the "disabled" attribute
     */
    makeButtonsClickable() {
        for (let i = 0; i < this.buttonArrayDOM.length; i++) {
            this.buttonArrayDOM[i].removeAttribute("disabled");
        }
    }

    /**
     * Starts a timer. If time runs out, the game is over.
     * If the game is completed before then, the timer stops.
     * 
     * @param {number} time the amount of time to play the game
     */
    startTimer(time) {
        let timeleft = time;
        const gameTimer = setInterval(() => {
            if (timeleft <= 0) {
                clearInterval(gameTimer);
                document.getElementById("msg").innerHTML = "Time's up!";
                this.showAllNumbers();
                this.endGame("../media/audio/wah-wah-sad-trombone-6347.mp3", msgs.timesUpMsg);
            } else {
                if (!this.isGameOver) {
                    document.getElementById("msg").innerHTML = "Time remaining: " + timeleft + "s"
                } else {
                    clearInterval(gameTimer);
                }
            }
            timeleft -= 1;
        }, 1000);
    }

    /**
     * Moves the buttons on screen
     * @param {number} numButtons The number of buttons
     */
    moveButtons(numButtons) {
        for (let i = 0; i < numButtons; i++) {
            this.buttonArrayObj[i].move(this.buttonArrayDOM[i]);
        }
    }

    /**
     * Hides the numbers when the user can start guessing
     */
    hideAllNumbers() {
        for (let i = 0; i < this.buttonArrayDOM.length; i++) {
            this.buttonArrayObj[i].toggleButtonNumber("hide", this.buttonArrayDOM[i]);
        }
    }

    /**
     * Allows users to make their guesses by adding event listeners to each button
     */
    startGuessingPhase() {
        for (let i = 0; i < this.buttonArrayDOM.length; i++) {
            this.buttonArrayDOM[i].addEventListener("click", () => {
                this.guess(i);
            });
        }
    }

    /**
     * Allows users to guess the order of the buttons and responds to their choices
     * 
     * @param {number} index of the button in both buttonArrayObj and buttonArrayDOM arrays
     */
    guess(index) {

        // If game is over
        if (this.isGameOver === true) {
            document.getElementById("msg").innerHTML = msgs.promptNewGameMsg;

        // If a selected button is selected again
        } else if (this.buttonArrayObj[index].isAlreadySelected) {
            document.getElementById("msg").innerHTML = msgs.btnAlreadySelectedMsg;

        // If the last button is selected last, display the gameWinMsg and end the game
        } else if (this.order === this.buttonArrayObj.length) {
            this.buttonArrayObj[index].toggleButtonNumber("show", this.buttonArrayDOM[index]);
            this.endGame("../media/audio/success-fanfare-trumpets-6185.mp3", msgs.gameWinMsg);

            // If a button is selected in the correct order, reveal the number and continue
        } else if (this.order === this.buttonArrayObj[index].value) {
            this.buttonArrayObj[index].toggleButtonNumber("show", this.buttonArrayDOM[index]);
            this.order++
            this.buttonArrayObj[index].isAlreadySelected = true;

            // If a button is selected in the wrong order, display the gameLoseMsg and end the game
        } else {
            this.showAllNumbers();
            this.endGame("../media/audio/wah-wah-sad-trombone-6347.mp3", msgs.gameLoseMsg);
        }
    }

    /**
     * Reveals all the numbers on the buttons
     */
    showAllNumbers() {
        for (let i = 0; i < this.buttonArrayDOM.length; i++) {
            this.buttonArrayObj[i].toggleButtonNumber("show", this.buttonArrayDOM[i]);
        }
    }

    // /**
    //  * Shows or hides the button number by switching between classes
    //  * 
    //  * @param {string} visibility The string that determines whether to hide or show the button number
    //  * @param {number} index The index of the button in the buttonArrayDOM array
    //  */
    // toggleButtonNumber(visibility, index) {
    //     if (visibility === "hide") {
    //         this.buttonArrayDOM[index].setAttribute("class", "memoryButtons hiddenNumber");
    //     } else {
    //         this.buttonArrayDOM[index].setAttribute("class", "memoryButtons visibleNumber");
    //     }
    // }

    /**
     * Plays audio and message depending on the game result and sets isGameOver to true
     * 
     * @param {string} audioPath The path to the audio file
     * @param {string} msg The msg to be displayed to the player
     * 
     */
    endGame(audioPath, msg) {
        const audio = new Audio(audioPath);
        audio.play();
        document.getElementById("msg").innerHTML = msg;
        this.isGameOver = true;
        this.enableInputs();
    }
}