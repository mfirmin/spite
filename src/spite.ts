import Card from './card';
import Deck from './deck';
import Player from './player';

class SpiteGame {
    private deck: Deck;
    private player1: Player;
    private player2: Player;

    private currentPlayer: Player;

    private playPiles: [[Deck, number], [Deck, number], [Deck, number], [Deck, number]];

    private p1GoalPile: Deck;
    private p2GoalPile: Deck;

    private p1DiscardPile: [Deck, Deck, Deck, Deck];
    private p2DiscardPile: [Deck, Deck, Deck, Deck];

    private discardPile: Deck;

    constructor() {
        this.initializeDeck();
        this.initializePlayers();

        console.log(`\n\n== Player ${this.currentPlayer.name}'s Turn! ==`);

        this.showBoard();
    }

    private initializeDeck() {
        this.deck = new Deck();
        this.deck.fill(true);
        const secondDeck = new Deck();
        secondDeck.fill(true);
        this.deck.merge(secondDeck, true);

        this.playPiles = [null, null, null, null];
        this.p1DiscardPile = [null, null, null, null];
        this.p2DiscardPile = [null, null, null, null];

        for (let i = 0; i < 4; i++) {
            this.playPiles[i] = [new Deck(), 0];
            this.p1DiscardPile[i] = new Deck();
            this.p2DiscardPile[i] = new Deck();
        }

        this.discardPile = new Deck();
    }

    private initializePlayers() {
        const hands = this.deck.dealMultipleHands(10, 2);
        const goals = this.deck.dealMultipleHands(20, 2);

        this.player1 = new Player(hands[0], 'player1');
        this.player2 = new Player(hands[1], 'player2');

        this.p1GoalPile = new Deck(goals[0]);
        this.p2GoalPile = new Deck(goals[1]);

        this.currentPlayer = this.player1;
    }

    private switchPlayers() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        this.drawToFive();

        console.log(`\n\n== Player ${this.currentPlayer.name}'s Turn! ==`);

        this.showBoard();
    }

    private drawToFive(): void {
        const cardsToDraw = 5 - this.currentPlayer.hand.size;

        if (this.deck.size < cardsToDraw) {
            this.discardPile.shuffle();
            this.deck.addCardsToBottom(this.discardPile.empty());
        }

        this.currentPlayer.draw(this.deck, cardsToDraw);
    }

    private win() {
        console.log(`\n\n== PLAYER ${this.currentPlayer} WINS!`);
    }

    private _testIfCardIsPlayable(cardValue: number, where: number): boolean {
        const whereValue = this.playPiles[where][1];
        // If Joker or King or value is one higher than the pile
        return (cardValue === 0 || cardValue === 13 || cardValue === whereValue + 1);
    }

    /**
     * @private @method _playCard
     * @memberof Spite
     * @description
     * Plays a card onto a given pile.
     * It is assumed that it has already been tested
     * as to whether or not the card can be played on this pile.
     * This function should NEVER be called directly, but rather
     * as a part of playCardFrom{Hand,Discard}
     */
    private _playCard(card: Card, where: number) {
        this.playPiles[where][0].addCard(card);
        this.playPiles[where][1]++;

        if (this.playPiles[where][1] === 12) {
            this.discardPile.addCards(this.playPiles[where][0].empty());
            this.playPiles[where][1] = 0;
        }
        this.showCurrentPlayerState();
    }

    private playCardFromHand(which: number, where: number): boolean {
        // note: getCardAt does not remove the card from the hand
        const cardValue = this.currentPlayer.getCardAt(which).value;

        if (this._testIfCardIsPlayable(cardValue, where)) {
            const card = this.currentPlayer.play(which);
            this._playCard(card, where);
            if (this.currentPlayer.hand.size === 0) {
                this.drawToFive();
            }
            return true;
        }
        return false;
    }

    private playCardFromDiscard(which, where) {
        if (where < 0 || where > 3) {
            throw new Error('discardCard: parameter 2 must be >= 0 and <= 3');
        }
        const currentPlayerDiscard = (this.currentPlayer === this.player1) ? this.p1DiscardPile : this.p2DiscardPile;
        if (currentPlayerDiscard[which].size < 1) {
            throw new Error('There are no cards in the discard pile');
        }
        const cardValue = currentPlayerDiscard[which].peek().value;
        if (this._testIfCardIsPlayable(cardValue, where)) {
            const card = currentPlayerDiscard[which].dealOne();
            this._playCard(card, where);
            return true;
        }
        return false;
    }

    private playCardFromGoal(where) {
        if (where < 0 || where > 3) {
            throw new Error('discardCard: parameter 2 must be >= 0 and <= 3');
        }

        const goalPile = (this.currentPlayer === this.player1) ? this.p1GoalPile : this.p2GoalPile;

        const cardValue = goalPile.peek().value;
        if (this._testIfCardIsPlayable(cardValue, where)) {
            const card = goalPile.dealOne();
            this._playCard(card, where);

            if (goalPile.size === 0) {
                this.win();
            }
        }

    }

    private discardCard(which, where) {
        if (where < 0 || where > 3) {
            throw new Error('discardCard: parameter 2 must be >= 0 and <= 3');
        }
        const playedCard = this.currentPlayer.play(which);
        const discardPile = (this.currentPlayer === this.player1) ? this.p1DiscardPile : this.p2DiscardPile;

        discardPile[where].addCard(playedCard);

        this.switchPlayers();
    }

    private showPlayPiles() {
        console.log('Play Piles:');
        for (let i = 0; i < this.playPiles.length; i++) {
            let str = `${i}: `;
            if (this.playPiles[i][0].size > 0) {
                const card = this.playPiles[i][0].peek();
                str += `${card.toString()}`;
                if (card.value === 13 || card.value === 0) {
                    let valueString = '';
                    switch (this.playPiles[i][1]) {
                        case 1:
                            valueString = 'Ace';
                            break;
                        case 11:
                            valueString = 'Jack';
                            break;
                        case 12:
                            valueString = 'Queen';
                            break;
                        case 13:
                            valueString = 'King';
                            break;
                        default:
                            valueString = this.playPiles[i][1].toString();
                    }
                    str += ` (${valueString})`;
                }
            } else {
                str += '--';
            }
            console.log(str);
        }
    }

    private showGoal(other: boolean = false) {
        let goal: Deck = null;
        let player: Player = null;
        if (this.currentPlayer === this.player1) {
            if (other) {
                player = this.player2;
                goal = this.p2GoalPile;
            } else {
                player = this.player1;
                goal = this.p1GoalPile;
            }
        } else {
            if (other) {
                player = this.player1;
                goal = this.p1GoalPile;
            } else {
                player = this.player2;
                goal = this.p2GoalPile;
            }
        }

        console.log(`Player ${player.name}'s Current Goal: `);
        console.log(goal.peek().toString());
        console.log(`Remaining: ${goal.size}`);
    }

    private showDiscardPiles(other: boolean = false) {
        let piles: [Deck, Deck, Deck, Deck] = null;
        let player: Player = null;
        if (this.currentPlayer === this.player1) {
            if (other) {
                player = this.player2;
                piles = this.p2DiscardPile;
            } else {
                player = this.player1;
                piles = this.p1DiscardPile;
            }
        } else {
            if (other) {
                player = this.player1;
                piles = this.p1DiscardPile;
            } else {
                player = this.player2;
                piles = this.p2DiscardPile;
            }
        }

        console.log(`Player ${player.name}'s Discard Piles:`);
        for (let i = 0; i < 4; i++) {
            const pile = piles[i];
            console.log(`\n${i}:`);
            for (let j = 0; j < pile.size; j++) {
                const card = pile.getCardAt(j);
                console.log(`  ${card.toString()}`);
            }
        }
    }
    private showCurrentPlayerState() {
        console.log(`Player ${this.currentPlayer.name}'s Hand:`);
        this.currentPlayer.viewHand();

        console.log('\n\n');
        this.showGoal();

        console.log('\n\n');
        this.showPlayPiles();
    }

    private showBoard() {
        console.log(`Player ${this.currentPlayer.name}'s Hand:`);
        this.currentPlayer.viewHand();

        console.log('\n\n');

        this.showGoal();
        console.log('\n\n');
        this.showGoal(true);

        console.log('\n\n');
        this.showPlayPiles();

        console.log('\n\n');
        this.showDiscardPiles();

        console.log('\n\n');
        this.showDiscardPiles(true);
    }
}

export default SpiteGame;
