import { Button } from "./button.js";
import * as msgs from "../lang/messages/en/user.js";

export class Game {
    constructor() {
        this.numButtons = 0;
        this.order = 1;
        this.buttonArrayObj = [];
        this.buttonArrayDOM = [];
        this.isGameOver = false;
    }

    /**
     * Starts and controls the game
     * 
     * @param {number} numButtons The number of buttons
     */
    startGame(numButtons) {
        this.removeButtons();
        this.setNumButtons(numButtons);
        this.generateButtons();
        this.scramble();
        this.hideAllNumbers();
        this.startGuessingPhase();
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
            const btn = new Button(this.generateRandomColorValue(), this.generateRandomColorValue(), this.generateRandomColorValue(), i + 1, i * 12);
            this.buttonArrayObj[i] = btn;
            btn.appendToPage(i, this.buttonArrayDOM);
        }
    }

    /**
     * Generates an R, G, or B value from 0 to 255
     * 
     * @returns an R, G or B value from 0 to 255
     */
    generateRandomColorValue() {
        return Math.floor(Math.random() * 256);
    }

    /**
     * Pauses n seconds, then calls to move the buttons.
     * Repeat n times with a pause of 2 seconds each
     */
    scramble() {
        let counter = 0;
        const timeout = this.numButtons * 1000;
        document.getElementById("btnNumSubmit").setAttribute("disabled", true);

        const initialInterval = setInterval(() => {
            const secondInterval = setInterval(() => {
                counter++;
                if (counter == this.numButtons) {
                    this.makeButtonsClickable();
                    clearInterval(secondInterval);
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
        document.getElementById("btnNumSubmit").removeAttribute("disabled");
    }

    /**
     * Moves the buttons on screen
     * @param {number} numButtons The number of buttons
     */
    moveButtons(numButtons) {
        for (let i = 0; i < numButtons; i++) {
            this.buttonArrayObj[i].move(i, this.buttonArrayDOM);
        }
    }

    /**
     * Hides the numbers when the user can start guessing
     */
    hideAllNumbers() {
        for (let i = 0; i < this.buttonArrayDOM.length; i++) {
            this.toggleButtonNumber("hide", i);
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
        if (this.isGameOver == true) {
            alert(msgs.promptNewGameMsg);

        // If a selected button is selected again
        } else if (this.buttonArrayObj[index].isAlreadySelected) {
            alert(msgs.btnAlreadySelectedMsg);

        // If the last button is selected last, display the gameWinMsg and end the game
        } else if (this.order == this.buttonArrayObj.length) {
            this.toggleButtonNumber("show", index);
            this.endGame("../media/audio/success-fanfare-trumpets-6185.mp3", msgs.gameWinMsg);

            // If a button is selected in the correct order, reveal the number and continue
        } else if (this.order == this.buttonArrayObj[index].value) {
            this.toggleButtonNumber("show", index);
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
            this.toggleButtonNumber("show", i);
        }
    }

    /**
     * Shows or hides the button number by switching between classes
     * 
     * @param {string} visibility The string that determines whether to hide or show the button number
     * @param {number} index The index of the button in the buttonArrayDOM array
     */
    toggleButtonNumber(visibility, index) {
        if (visibility == "hide") {
            this.buttonArrayDOM[index].setAttribute("class", "memoryButtons hiddenNumber");
        } else {
            this.buttonArrayDOM[index].setAttribute("class", "memoryButtons visibleNumber");
        }
    }

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
        setTimeout(() => {
            alert(msg);
        }, 750);
        this.isGameOver = true;
    }
}