import Card, { Suit } from './card';

class Deck {
    protected _cards: Card[];

    constructor(cards: Card[] = []) {
        this._cards = cards;
    }

    public addCard(c: Card) {
        this._cards.push(c);
    }

    public addCards(cards: Card[], shuffle: boolean = false) {
        this._cards = this._cards.concat(cards);
        if (shuffle) {
            this.shuffle();
        }
    }

    public addCardsToBottom(cards: Card[], shuffle: boolean = false) {
        this._cards = cards.concat(this._cards);
        if (shuffle) {
            this.shuffle();
        }
    }

    public merge(other: Deck, shuffle: boolean = false) {
        this.addCards(other.cards, shuffle);
        other.empty();
    }

    public fill(includeJokers: boolean = false) {
        this._cards = [];
        for (const s of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
            for (let v = 1; v <= 13; v++) {
                this.addCard(new Card(s, v));
            }
        }
        if (includeJokers) {
            this.addCard(new Card(Suit.RedJoker));
            this.addCard(new Card(Suit.BlackJoker));
        }
    }

    public dealOne(): Card {
        return this._cards.pop();
    }
    public dealMultiple(count: number = 1): Card[] {
        count = Math.min(count, this._cards.length);
        const ret: Card[] = [];
        for (let i: number = 0; i < count; i++) {
            ret.push(this._cards.pop());
        }

        return ret;
    }

    /**
     * @public @method peek
     * @memberof Deck
     * @description
     * Returns the top card from the deck,
     * WITHOUT removing it from the deck
     */
    public peek(): Card {
        return this.getCardAt(this.size - 1);
    }

    /**
     * @method dealMultipleHands
     * @description
     * Deals out numCards across n groups alternating between the groups (rather than dealing one at a time)
     * Returns a list of length n, where each entry in the list is a list of cards
     * If groups doesn't evenly divide numCards, entries at the end of the list will have less cards
     */
    public dealMultipleHands(numCards: number = 2, numGroups: number = 2): Card[][] {
        if (numCards < 1 || numCards > this._cards.length) {
            throw new Error('Invalid value for numCards');
        }
        if (numGroups < 1) {
            throw new Error('Invalid value for numGroups');
        }

        const ret: Card[][] = [];
        for (let i = 0; i < numGroups; i++) {
            ret.push([]);
        }

        let counter = 0;
        for (let i = 0; i < numCards; i++) {
            ret[counter].push(this.dealOne());
            counter = (counter + 1) % numGroups;
        }

        return ret;
    }

    public shuffle() {
        const n = this._cards.length;
        for (let i = 0; i < n - 2; i++) {
            const j = Math.floor(Math.random() * (n - i)) + i;
            const temp = this._cards[j];
            this._cards[j] = this._cards[i];
            this._cards[i] = temp;
        }
    }

    public show() {
        const n = this._cards.length;
        for (let i = 0; i < n; i++) {
            console.log(`${i}: ${this._cards[i].toString()}`);
        }
    }

    public empty(): Card[] {
        const cardsToReturn = this._cards;
        this._cards = [];
        return cardsToReturn;
    }

    public getCardAt(position: number = 0): Card {
        if (position < 0 || position > this._cards.length - 1) {
            throw new Error('Invalid position');
        }
        return this._cards[position];
    }

    public play(position: number = -1): Card {
        if (position === -1) {
            position = this._cards.length - 1;
        }
        if (position < 0 || position > this._cards.length - 1) {
            throw new Error('Cannot play card outside of range');
        }

        const ret = this._cards.splice(position, 1);

        return ret[0];
    }

    get cards(): Card[] {
        return this._cards;
    }

    get size(): number {
        return this._cards.length;
    }
}

export default Deck;
