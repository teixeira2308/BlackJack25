// Blackjack OOP

let game = null; // Stores the current instance of the game
let dealerElement = null; // Element to display dealer's cards
let dealerHiddenCard = null; // Stores the dealer's hidden card

/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
    $('#debug').text(JSON.stringify(obj, null, 2));
 } // Displays the object in a formatted JSON string

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
    $('#card').prop('disabled', false);
    $('#stand').prop('disabled', false);
    $('#new_game').prop('disabled', true);
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
    //TODO: Reveal the dealer's hidden card if you hid it like you were supposed to.

    if(dealerHiddenCard) {
        $('#dealer-cards .card-back-img').replaceWith(createCardElement(dealerHiddenCard));
        dealerHiddenCard = null;
    }

    $('#card').prop('disabled', true);
    $('#stand').prop('disabled', true);
    $('#new_game').prop('disabled', false);
}

//TODO: Implement this method.
/**
 * Clears the page to start a new game.
 */
function clearPage() {
    $('#dealer-cards').empty();
    $('#player-cards').empty();
    $('#game_status').empty();
    $('#debug').empty();
    $('#dealer-score').text('0');
    $('#player-score').text('0');
    dealerHiddenCard = null;
}

function createCardElement(card) {
    const naipeFolder = card.naipe.toLowerCase();
    const imagePath = `images/cards/${naipeFolder}/${card.valor}.svg`;

    return $(`
        <div class="card-image-wrapper">
            <img src="${imagePath}"
            alt="${card.getNome()} of ${card.naipe}"
            class="card-image"
            onerror="this.onerror=null;this.src='images/cards/placeholder.svg';">
        </div>
    `);
}

function createCardBack() {
    return $(`
        <div class="card-image-wrapper card-back-img">
            <img src="images/back.svg"
            alt="Carta escondida"
            class="card-image"
            onerror="this.onerror=null; this.parentElement.innerHTML='🂠';">
        </div>
    `);
}

//TODO: Complete this method.
/**
 * Starts a new game of Blackjack.
 */
function newGame() {
    clearPage(); // Clears the page for a new game
    game = new Blackjack(); // Creates a new instance of the Blackjack game
    debug(game); // Displays the current state of the game for debugging

    game.dealerMove();
    $('#dealer-cards').append(createCardElement(game.getDealerCards()[0])); // Appends a card back for the hidden card

    game.dealerMove();
    dealerHiddenCard = game.getDealerCards()[1]; // Stores the hidden card
    $('#dealer-cards').append(createCardBack());

    //TODO: Add missing code.
    playerNewCard();

    updateScores(); // Updates the scores display

    buttonsInitialization(); // Initializes the game buttons
}

function updateScores() {
    const dealerScore = game.getCardsValue(game.getDealerCards());
    const playerScore = game.getCardsValue(game.getPlayerCards());

    $('#dealer-score').text(dealerScore).hide().fadeIn(300);
    $('#player-score').text(playerScore).hide().fadeIn(300);
}

//TODO: Implement this method.
/**
 * Calculates and displays the final score of the game.
 * @param {Object} state - The current state of the game.
 */
function showStatus(state) {
    let message = '';

    if(state.playerBusted) {
        message = '💥 Player busts! Dealer wins!';
    } else if(state.dealerBusted) {
        message = '💥 Dealer busts! Player wins!';
    } else if(state.playerWon) {
        message = '🎉 Player wins!';
    } else if(state.dealerWon) {
        message = '😢 Dealer wins!';
    } else {
        message = '🤝 It\'s a tie!';
    }

    if(message) {
        $('#game_status').html(message).hide().fadeIn(500);
    }
}

//TODO: Implement this method.
/**
 * Updates the dealer's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updateDealer(state) {
    updateScores();

    if (state.gameEnded) {
        showStatus(state);
        finalizeButtons();
    }
}

//TODO: Implement this method.
/**
 * Updates the player's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updatePlayer(state) {
    updateScores();
    debug(game);

    if(state.gameEnded) {
        showStatus(state);
        finalizeButtons();
    }
}

//TODO: Implement this method.
/**
 * Causes the dealer to draw a new card.
 * @returns {Object} - The game state after the dealer's move.
 */
function dealerNewCard() {
    const state = game.dealerMove(); // Dealer draws a new card
    const newCard = game.getDealerCards()[game.getDealerCards().length - 1];
    $('#dealer-cards').append(createCardElement(newCard)); // Displays the new card
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
    const newCard = game.getPlayerCards()[game.getPlayerCards().length - 1];
    $('#player-cards').append(createCardElement(newCard)); // Displays the new card
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

    if(dealerHiddenCard) {
        const $cardback = $('#dealer-cards .card-back-img');
        $cardback.fadeOut(300, function() {
            $(this).replaceWith(createCardElement(dealerHiddenCard));
            $('#dealer-cards .card-image-wrapper:last').hide().fadeIn(300);
        });
        dealerHiddenCard = null;
    }
    let dealCount = 0;
    const dealInterval = setInterval(() => {
        if(state.gameEnded) {
            clearInterval(dealInterval);
            updateDealer(state);
            return;
        }
        dealerNewCard();
        state = game.getGameState();
        dealCount++;

        if(dealCount > 10) {
            clearInterval(dealInterval);
        }

    }, 1200);

}

$(document).ready(function() {
    newGame(); // Starts a new game when the document is ready
});

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


