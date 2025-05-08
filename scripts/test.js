import { cards_ludzie_json } from './ludzie/cards.js';
import { cards_zombiaki_json } from './zombiaki/cards.js';
import { board, setField } from "./board.js";
import { addOverlay } from "./zombiaki/utils.js";
import { raceFunctions } from "./allFunctions.js";

export const TEST_MODE = {
    race: 'ludzie',
    board: true,
};

let test_deck_ludzie = cards_ludzie_json;
let test_deck_zombiaki = cards_zombiaki_json;

const all_cards = [...cards_ludzie_json, ...cards_zombiaki_json];

const start_cards_zombiaki = ['KLIK', 'CZESIEK', 'MARIUSZ', 'IWAN'];
const start_cards_ludzie = ['DZIURA', 'KREW', 'SIEĆ', 'GAZ ROZWESELAJĄCY'];

const test_board = [
    {
        "field": board[1][0],
        "card": 'WACEK',
        'overlay': 'MIŚ',
        'hp': 2,
    },
    {
        "field": board[2][2],
        "card": "ZENEK",
        'hp': 3,
    },
    {
        "field": board[0][2],
        'card': 'KRZYSZTOF',
        'hp': 2,
    },
    {
        "field": board[2][0],
        'card': 'MUR'
    },
    {
        "field": board[3][2],
        "card": "CZESIEK",
        "hp": 2,
    }
]


export function testMode() {
    if (TEST_MODE.board) putCardsOnBoard();
    changeCards(test_deck_ludzie, start_cards_ludzie);
    changeCards(test_deck_zombiaki, start_cards_zombiaki);

}

function putCardsOnBoard() {
    for (let i = 0; i < test_board.length; i++) {
        const { field, card, overlay, hp } = test_board[i];
        const test_card = all_cards.find(crd => crd.name === card);
        test_card.hp = hp;
        setField(field, test_card);
        if (overlay) {
            const overlay_card = all_cards.find(card => card.name === overlay);
            const { id, race } = overlay_card;
            overlay_card.hp = 1;
            addOverlay(overlay_card, field, raceFunctions[`${race}_id_${id}_callback`])
        }
    }
}

function changeCards(deck, cards) {
    for (let i = 0; i < cards.length; i++) {
        const j = deck.findIndex(el => el.name === cards[i]);
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

export function get_test_deck_ludzie() {
    return test_deck_ludzie;
}

export function get_test_deck_zombiaki() {
    return test_deck_zombiaki;
}