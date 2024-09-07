export class Button {
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
     * @param {Button} button The button to be moved
     */
    move(button) {
        let newX = Math.floor(Math.random() * (document.documentElement.clientWidth - 140));
        const newY = Math.floor(Math.random() * (document.documentElement.clientHeight - 110));

        if (newX <= 455 && newY <= 405) {
            newX += 455;
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