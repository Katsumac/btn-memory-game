class Button {
    constructor(R, G, B, value, x) {
        this.R = R;
        this.G = G;
        this.B = B;
        this.value = value;
        this.x = x;
        this.isAlreadySelected = false;
    }

    /**
     * Creates a button using the Button object and appends it to the buttonArea Div
     * 
     * @param {number} index The index of the button in the buttonArrayDOM array
     * @param {Button DOM Object Array} buttonArrayDOM The array of buttons created by DOM
     */
    appendToPage(index, buttonArrayDOM) {
        const btn = document.createElement("button");
        btn.style = `background-color: rgb(${this.R}, ${this.G}, ${this.B}); left: ${this.x}em`;
        btn.innerText = this.value;
        btn.setAttribute("class", "memoryButtons visibleNumber");
        btn.setAttribute("disabled", true);
        document.getElementById("buttonArea").appendChild(btn);
        buttonArrayDOM[index] = btn;
    }

    /**
     * Moves the button to a random position on the screen
     * 
     * @param {number} index The index of the button in the buttonArrayDOM array
     * @param {Button DOM Object Array} buttonArrayDOM The array of buttons created by DOM
     */
    move(index, buttonArrayDOM) {
        const newX = Math.floor(Math.random() * (document.documentElement.clientWidth - 135));
        const newY = Math.floor(Math.random() * (document.documentElement.clientHeight - 100));
        buttonArrayDOM[index].style.position = "absolute"
        buttonArrayDOM[index].style.left = newX + "px";
        buttonArrayDOM[index].style.top = newY + "px";
    }
}

import * as msgs from "../lang/messages/en/user.js";

class Game {
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
     * Sets the number of buttons
     * 
     * @param {number} count The number of buttons based on user input
     */
    setNumButtons(count) {
        this.numButtons = count;
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
                const audio = new Audio("../media/audio/success-fanfare-trumpets-6185.mp3");
                audio.play();
                setTimeout(() => {
                    alert(msgs.gameWinMsg);
                }, 500);
            this.endGame();

            // If a button is selected in the correct order, reveal the number and continue
        } else if (this.order == this.buttonArrayObj[index].value) {
            this.toggleButtonNumber("show", index);
            this.order++
            this.buttonArrayObj[index].isAlreadySelected = true;

            // If a button is selected in the wrong order, display the gameLoseMsg and end the game
        } else {
            this.showAllNumbers();
                const audio = new Audio("../media/audio/wah-wah-sad-trombone-6347.mp3");
                audio.play();
                setTimeout(() => {
                    alert(msgs.gameLoseMsg);
                }, 500);
            this.endGame();
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
     * Sets isGameOver to true so that the proper game over message is displayed
     */
    endGame() {
        this.isGameOver = true;
    }
}

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