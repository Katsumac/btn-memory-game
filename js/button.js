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