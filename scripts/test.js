import { cards_ludzie_json } from './ludzie/cards.js';
import { cards_zombiaki_json } from './zombiaki/cards.js';
import { board, setField } from "./board.js";
import { addOverlay } from "./zombiaki/utils.js";
import { raceFunctions } from "./allFunctions.js";

export const TEST_MODE = {
    race: 'zombiaki',
    board: true,
};

let test_deck_ludzie = cards_ludzie_json;
let test_deck_zombiaki = cards_zombiaki_json;

const all_cards = [...cards_ludzie_json, ...cards_zombiaki_json];

const start_cards_zombiaki = ['ZENEK', 'MIŚ', 'MASA', 'PAZURY'];
const start_cards_ludzie = ['CEGŁA', 'SNAJPER', 'MIOTACZ', 'DŁUGA SERIA'];

const test_board = [
    // {
    //     "field": board[1][1],
    //     "card": 'PIES'
    // },
    // {
    //     "field": board[1][2],
    //     "card": "KOT",
    // },
    // {
    //     "field": board[2][2],
    //     'card': 'DZIURA'
    // },
    // {
    //     "field": board[4][2],
    //     'card': 'ZAPORA'
    // },
    {
        "field": board[1][1],
        'card': 'ZENEK',
        'hp': 1,
        'overlay': 'BOSS'
    },
    {
        'field': board[1][0],
        'card': "MARIUSZ"
    },
    // {
    //     "field": board[1][1],
    //     'card': 'IWAN'
    // },
    // {
    //     "field": board[1][1],
    //     'card': 'AUTO'
    // },
    // {
    //     "field": board[3][1],
    //     'card': 'BECZKA'
    // },
    // {
    //     "field": board[2][1],
    //     "card": "MUR",
    // }
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
        test_card.hp = hp || test_card.max_hp || test_card.hp;
        setField(field, test_card);
        if (overlay) {
            const overlay_card = all_cards.find(card => card.name === overlay);
            const { id, race } = overlay_card;
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