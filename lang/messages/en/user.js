function storeMsgsToLocalStorage() {
    const inputValidationMsg = "Please enter a number between 3 and 7!";
    const gameWinMsg = "Excellent memory!";
    const gameLoseMsg = "Wrong order!";
    const promptNewGameMsg = "The game is over. Please click \"Go!\" to start a new game. Refresh the page if a button is blocking \"Go!\".";

    localStorage.setItem("inputValidationMsg", inputValidationMsg);
    localStorage.setItem("gameWinMsg", gameWinMsg);
    localStorage.setItem("gameLoseMsg", gameLoseMsg);
    localStorage.setItem("promptNewGameMsg", promptNewGameMsg);
}

storeMsgsToLocalStorage();