
export enum Suit {
    Hearts,
    Spades,
    Diamonds,
    Clubs,
    RedJoker,
    BlackJoker,
}

class Card {
    private _suit: Suit;
    private _value: number; // Note, Jokers will have value 0
    constructor(suit: Suit, value: number = 0) {
        this._suit = suit;
        this._value = value;
    }

    public toString() {
        if (this.suit === Suit.RedJoker) {
            return 'Red Joker';
        } else if (this.suit === Suit.BlackJoker) {
            return 'Black Joker';
        }
        let valueString = '';
        switch (this.value) {
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
                valueString = this.value.toString();
        }
        return `${valueString} of ${Suit[this.suit]}`;
    }

    get value() {
        return this._value;
    }

    get suit() {
        return this._suit;
    }

    public compare(other: Card, acesHigh: boolean = false) {
        if (this.value === other.value) {
            return 0;
        }
        if (acesHigh) {
            if (this.value === 1 && other.value !== 1) {
                return 1;
            } else if (this.value !== 1 && other.value === 1) {
                return -1;
            }
        }
        return (this.value > other.value) ? 1 : -1;
    }
}

export default Card;
