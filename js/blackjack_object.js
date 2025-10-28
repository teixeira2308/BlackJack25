// Blackjack object
class Card {
    constructor(valor, naipe) {
        this.valor = valor;
        this.naipe = naipe;
    }

    getNome() {
        const nomes = {
            1: 'Ás',
            11: 'Valete',
            12: 'Dama',
            13: 'Rei'
        };
        return nomes[this.valor] || this.valor.toString();
    }

    getSuitSymbol() {
        const symbols = {
            'Copas': '♥',
            'Ouros': '♦',
            'Espadas': '♠',
            'Paus': '♣'
        };
        return symbols[this.naipe] || this.naipe;
    }

    isRed() {
        return this.naipe === 'Copas' || this.naipe === 'Ouros';
    }
}

/**
 * Class that represents the Blackjack game.
 */
class Blackjack {
    /**
     * Creates an instance of Blackjack and initializes the deck.
     */
    constructor(maxPoints = 21) {
        this.dealerCards = []; // Array to hold the dealer's cards
        this.playerCards = []; // Array to hold the player's cards
        this.dealerTurn = false; // Flag to indicate if it's the dealer's turn to play

        this.maxPoints = maxPoints; // Maximum points to avoid busting

        this.dealerMaxTurnPoints = maxPoints === 25 ? 21 : 17;

        // State of the game with information about the outcome
        this.state = {
            gameEnded: false, // Indicates whether the game has ended
            playerWon: false, // Indicates if the player has won
            dealerWon: false, // Indicates if the dealer has won
            playerBusted: false, // Indicates if the player has exceeded MAX_POINTS
            dealerBusted: false // Indicates if the dealer has exceeded MAX_POINTS
        };

        // Initialize the deck of cards
        this.deck = this.shuffle(this.newDeck()); // Create and shuffle a new deck
    }

    //TODO: Implement this method
    /**
     * Creates a new deck of cards.
     * @returns {Card[]} - An array of cards.
     */
    newDeck() {
        const naipes = ['Copas', 'Ouros', 'Espadas', 'Paus'];


        const deck = [];

        for (let naipe of naipes) {
            for (let valor = 1; valor <= 13; valor++) {
                deck.push(new Card(valor, naipe));
            } 
        }
        return deck;
    }

    //TODO: Implement this method
    /**
     * Shuffles the deck of cards.
     * @param {Card[]} deck - The deck of cards to be shuffled.
     * @returns {Card[]} - The shuffled deck.
     */
    shuffle(deck) {
        const cardsDeck = [];
        const shuffleDeck = [];
        
        for(let i = 0; i < 52; i++) {
            cardsDeck.push(i);
        }

        for(let i = 0; i < 52; i++) {
            const a = getRandomInt(52);
            if(cardsDeck[a] != null) {
                shuffleDeck.push(deck[a]);
                cardsDeck[a] = null;
            } else {
                i--;
            }
        }
        return shuffleDeck;
    }

    /**
     * Returns the dealer's cards.
     * @returns {Card[]} - An array containing the dealer's cards.
     */
    getDealerCards() {
        return this.dealerCards.slice(); // Return a copy of the dealer's cards
    }

    /**
     * Returns the player's cards.
     * @returns {Card[]} - An array containing the player's cards.
     */
    getPlayerCards() {
        return this.playerCards.slice(); // Return a copy of the player's cards
    }

    /**
     * Sets whether it is the dealer's turn to play.
     * @param {boolean} val - Value indicating if it's the dealer's turn.
     */
    setDealerTurn(val) {
        this.dealerTurn = val; // Update the dealer's turn status
    }

    //TODO: Implement this method
    /**
     * Calculates the total value of the provided cards.
     * @param {Card[]} cards - Array of cards to be evaluated.
     * @returns {number} - The total value of the cards.
     */
    getCardsValue(cards) {
        let total = 0;
        let aces = 0;

        for(const card of cards) {
            if(card.valor > 10) {
                total += 10;
            } else if (card.valor === 1) {
                aces++;
                total += 11;
            } else {
                total += card.valor;
            }
        }

        while(total > this.maxPoints && aces > 0) {
            total -= 10;
            aces--;
        }
        return total;
    }

    //TODO: Implement this method
    /**
     * Executes the dealer's move by adding a card to the dealer's array.
     * @returns {Object} - The game state after the dealer's move.
     */
    dealerMove() {
        if(this.deck.length > 0) {
            this.dealerCards.push(this.deck.pop());
        }
        return this.getGameState();
    }

    //TODO: Implement this method
    /**
     * Executes the player's move by adding a card to the player's array.
     * @returns {Object} - The game state after the player's move.
     */
    playerMove() {
        if(this.deck.length > 0) {
            this.playerCards.push(this.deck.pop());
        }
        return this.getGameState();
    }
    

    //TODO: Implement this method
    /**
     * Checks the game state based on the dealer's and player's cards.
     * @returns {Object} - The updated game state.
     */
    getGameState() {
        const playerValue = this.getCardsValue(this.playerCards);
        const dealerValue = this.getCardsValue(this.dealerCards);

        if(playerValue > this.maxPoints) {
            this.state.gameEnded = true;
            this.state.playerBusted = true;
            this.state.dealerWon = true;
        }

        if(dealerValue > this.maxPoints) {
            this.state.gameEnded = true;
            this.state.dealerBusted = true;
            this.state.playerWon = true;
        }

        if(this.dealerTurn && dealerValue >= this.dealerMaxTurnPoints && !this.state.gameEnded) {
            if (dealerValue > playerValue) {
                this.state.dealerWon = true;
            } else if (playerValue > dealerValue) {
                this.state.playerWon = true;
            }
            this.state.gameEnded = true;
        }
        return this.state;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
