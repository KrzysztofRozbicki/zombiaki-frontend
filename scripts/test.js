import { cards_ludzie_json } from './ludzie/cards.js';
import { cards_zombiaki_json } from './zombiaki/cards.js';

import { setActiveCard } from "./index.js";
import { board, setField } from "./board.js";
import { addOverlay } from "./zombiaki/utils.js";
import { raceFunctions } from "./allFunctions.js";

let test_deck_ludzie = cards_ludzie_json;
let test_deck_zombiaki = cards_zombiaki_json;

const all_cards = [...cards_ludzie_json, ...cards_zombiaki_json];

const start_cards_zombiaki = ['KLIK', 'WACEK', 'KRYSTYNKA', 'IWAN'];
const start_cards_ludzie = ['MUR', 'JAJNIK', 'REFLEKTOR', 'ROPA'];


const test_board = [
    {
        "field": board[2][0],
        "card": 'WACEK',
        'overlay': 'MIŚ',
    },
    {
        "field": board[1][1],
        'card': 'ARKADIUSZ',
    },
    {
        "field": board[3][0],
        'card': 'MUR'
    }
]


export function testMode() {

    for (let i = 0; i < test_board.length; i++) {
        const { field, card, overlay } = test_board[i];
        const test_card = all_cards.find(crd => crd.name === card);
        setField(field, test_card);
        if (overlay) {
            const overlay_card = all_cards.find(card => card.name === overlay);
            const { id, race } = overlay_card;
            addOverlay(overlay_card, field, raceFunctions[`${race}_id_${id}_callback`])
        }
    }

    function changeCards(deck, cards) {
        for (let i = 0; i < cards.length; i++) {
            const j = deck.findIndex(el => el.name === cards[i]);
            console.log(j);
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    changeCards(test_deck_ludzie, start_cards_ludzie);
    changeCards(test_deck_zombiaki, start_cards_zombiaki);

}

export function get_test_deck_ludzie() {
    return test_deck_ludzie;
}

export function get_test_deck_zombiaki() {
    return test_deck_zombiaki;
}