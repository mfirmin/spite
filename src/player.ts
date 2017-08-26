import Card from './card';
import Deck from './deck';

class Player {
    private _hand: Deck;
    private _name: string;
    constructor(cards: Card[] = [], name: string = 'Player') {
        this._hand = new Deck(cards);
        this._name = name;
    }

    public viewHand() {
        this._hand.show();
    }

    public getCardAt(position: number = 0): Card {
        return this._hand.getCardAt(position);
    }

    public play(position: number = -1): Card {
        return this._hand.play(position);
    }

    public draw(deck: Deck, count: number = 1) {
        this.hand.addCards(deck.dealMultiple(count));
    }

    get hand(): Deck {
        return this._hand;
    }

    get name(): string {
        return this._name;
    }
}

export default Player;
