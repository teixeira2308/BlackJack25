// Blackjack OOP

let game = null; // Stores the current instance of the game

/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
    document.getElementById('debug').innerHTML = JSON.stringify(obj); // Displays the state of the object as JSON
}

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
    document.getElementById('card').disabled = false; // Enables the button to draw a card
    document.getElementById('stand').disabled = false; // Enables the button to stand
    document.getElementById('new_game').disabled = true; // Disables the button for a new game
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
    //TODO: Reveal the dealer's hidden card if you hid it like you were supposed to.

    /* const dealerCards = game.getDealerCards();
    if(dealerCards.length >= 2) {
        const dealerElement = document.getElementById('dealer_cards');
        printCard(dealerElement, dealerCards[1], true); // Reveals the dealer's hidden card
    }
    */

    document.getElementById('card').disabled = true; // Disables the button to draw a card
    document.getElementById('stand').disabled = true; // Disables the button to stand
    document.getElementById('new_game').disabled = false; // Enables the button for a new game
}

//TODO: Implement this method.
/**
 * Clears the page to start a new game.
 */
function clearPage() {
    document.getElementById('dealer').innerHTML = 'Loading...'; // Clears dealer's cards display

    document.getElementById('player').innerHTML = 'Loading...'; // Clears player's cards display

    document.getElementById('game_status').innerHTML = ''; // Clears game status display

    document.getElementById('debug').innerHTML = ''; // Clears debug information

    document.getElementById('dealer-score').innerHTML = '0'; // Resets dealer's score display

    document.getElementById('player-score').innerHTML = '0'; // Resets player's score display
}

//TODO: Complete this method.
/**
 * Starts a new game of Blackjack.
 */
function newGame() {
    clearPage(); // Clears the page for a new game
    game = new Blackjack(); // Creates a new instance of the Blackjack game
    debug(game); // Displays the current state of the game for debugging

    //TODO: Add missing code.

    dealerNewCard(); 
    dealerNewCard(); 

    playerNewCard();

    buttonsInitialization(); // Initializes the game buttons
}

function updateScores() {
    const dealerScore = game.getCardsValue(game.getDealerCards());
    const playerScore = game.getCardsValue(game.getPlayerCards());

    document.getElementById('dealer-score').innerHTML = dealerScore;
    document.getElementById('player-score').innerHTML = playerScore;
}

//TODO: Implement this method.
/**
 * Calculates and displays the final score of the game.
 * @param {Object} state - The current state of the game.
 */
function finalScore(state) {
    const statusElement = document.getElementById('game_status');

    if(state.playerBust) {
        statusElement.innerHTML = '💥 Player busts! Dealer wins!';
    } else if(state.dealerBust) {
        statusElement.innerHTML = '💥 Dealer busts! Player wins!';
    } else if(state.playerWon) {
        statusElement.innerHTML = '🎉 Player wins!';
    } else if(state.dealerWon) {
        statusElement.innerHTML = '😢 Dealer wins!';
    } else {
        statusElement.innerHTML = '🤝 It\'s a tie!';
    }
}

//TODO: Implement this method.
/**
 * Updates the dealer's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updateDealer(state) {
    const dealerCards = game.getDealerCards();
    let dealerString = '';

    for(const card of dealerCards) {
        dealerString += `${card.valor} de ${card.naipe}, `;
    }

    if(dealerString.length > 0) {
        dealerString = dealerString.slice(0, -2); // Remove the trailing comma and space
    }

    if(state.gameEnded) {
        if(state.dealerWon) {
            dealerString += '✅ Dealer wins!';
        } else if(state.dealerBust) {
            dealerString += '💥 Dealer busts!';
        } else {
            dealerString += '❌ Dealer loses!';
        }
        finalScore(state); // Displays the final score of the game
        finalizeButtons(); // Finalizes the buttons after the game ends
    }
    document.getElementById('dealer').innerHTML = dealerString; // Updates the dealer's cards display
    updateScores(); // Updates the scores display
}

//TODO: Implement this method.
/**
 * Updates the player's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updatePlayer(state) {
    const playerCards = game.getPlayerCards();
    let playerString = '';

    for(const card of playerCards) {
        playerString += `${card.valor} de ${card.naipe}, `;
    }

    if(playerString.length > 0) {
        playerString = playerString.slice(0, -2); // Remove the trailing comma and space
    }

    if(state.gameEnded) {
        if(state.playerWon) {
            playerString += '✅ Player wins!';
        } else if(state.playerBust) {
            playerString += '💥 Player busts!';
        } else {
            playerString += '❌ Player loses!';
        }

        finalizeButtons(); // Finalizes the buttons after the game ends
    }
    document.getElementById('player').innerHTML = playerString; // Updates the player's cards display
    updateScores(); // Updates the scores display
    debug(game); // Displays the current state of the game for debugging
}

//TODO: Implement this method.
/**
 * Causes the dealer to draw a new card.
 * @returns {Object} - The game state after the dealer's move.
 */
function dealerNewCard() {
    const state = game.dealerMove(); // Dealer draws a new card
    updateDealer(state); // Updates the dealer's state in the game
    return state;
}

//TODO: Implement this method.
/**
 * Causes the player to draw a new card.
 * @returns {Object} - The game state after the player's move.
 */
function playerNewCard() {
    const state = game.playerMove(); // Player draws a new card
    updatePlayer(state); // Updates the player's state in the game
    return state;
}

//TODO: Implement this method.
/**
 * Finishes the dealer's turn.
 */
function dealerFinish() {
    let state = game.getGameState();
    game.setDealerTurn(true); // Sets the dealer's turn status to true

    while(!state.gameEnded) { 
        dealerNewCard();
        state = game.getGameState();
    }
    updateDealer(state); // Updates the dealer's state in the game

}

//TODO: Implement this method.
/**
 * Prints the card in the graphical interface.
 * @param {HTMLElement} element - The element where the card will be displayed.
 * @param {Card} card - The card to be displayed.
 * @param {boolean} [replace=false] - Indicates whether to replace the existing image.
 */
function printCard(element, card, replace = false) {
    if(replace && element.children.length >= 2) {
        const cardImg = document.createElement('img');
        cardImg.src = card.getImagePath(); // Sets the image source to the card's image path
        cardImg.alt = `${card.valor} de ${card.naipe}`; // Sets the alt text for the image
        cardImg.className = 'card'; // Sets the CSS class for the card image
        element.replaceChild(cardImg, element.children[1]); // Replaces the existing image with the new card image
    } else {
        const cardImg = document.createElement('img');
        cardImg.src = card.getImagePath(); // Sets the image source to the card's image path
        cardImg.alt = `${card.valor} de ${card.naipe}`; // Sets the alt text for the image
        cardImg.className = 'card'; // Sets the CSS class for the card image
        element.appendChild(cardImg); // Appends the new card image to the element
    }
}


