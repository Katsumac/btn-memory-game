export class Button {
    constructor(colour, value, xPosition) {
        this.colour = colour;
        this.value = value;
        this.xPosition = xPosition;
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
        btn.style = `background-color: ${this.colour}; left: ${this.xPosition}em`;
        btn.innerText = this.value;
        btn.setAttribute("class", "memoryButtons visibleNumber");
        btn.setAttribute("disabled", true);
        document.getElementById("buttonArea").appendChild(btn);
        buttonArrayDOM[index] = btn;
    }

    /**
     * Moves the button to a random position on the screen
     * 
     * @param {Button} button The button to be moved
     */
    move(button) {
        const newX = Math.floor(Math.random() * (window.innerWidth - 200));
        let newY = Math.floor(Math.random() * (window.innerHeight - 130));

        if (newX <= 455 && newY <= 550) {
            newY += 550 - Math.floor(Math.random() * 20);
        }

        button.style.left = newX + "px";
        button.style.top = newY + "px";
    }

    /**
     * Shows or hides the button number by switching between classes
     * 
     * @param {string} visibility The string that determines whether to hide or show the button number
     * @param {Button} button The button that will have its number toggled
     */
    toggleButtonNumber(visibility, button) {
        if (visibility === "hide") {
            button.setAttribute("class", "memoryButtons hiddenNumber");
        } else {
            button.setAttribute("class", "memoryButtons visibleNumber");
        }
    }
}