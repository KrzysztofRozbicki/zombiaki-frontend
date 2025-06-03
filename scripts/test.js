import { cards_ludzie_json } from './ludzie/cards.js';
import { cards_zombiaki_json } from './zombiaki/cards.js';
import { board, setField } from "./board.js";
import { addOverlay } from "./zombiaki/utils.js";
import { raceFunctions } from "./allFunctions.js";


export const TEST_STATE = true;

export const TEST_MODE = {
    race: 'ludzie',
    board: true,
};

let test_deck_ludzie = cards_ludzie_json;
let test_deck_zombiaki = cards_zombiaki_json;

const all_cards = [...cards_ludzie_json, ...cards_zombiaki_json];

const start_cards_zombiaki = ['PAPU', 'PAZURY', 'MASA', 'IWAN'];
const start_cards_ludzie = ['CHUCK', 'JAJNIK', 'DŁUGA SERIA', 'STRZAŁ'];

const test_board = [
    // {
    //     "field": board[1][0],
    //     "card": 'KOŃ TROJAŃSKI',
    //     "overlay": 'MIŚ'
    // },
    {
        "field": board[4][0],
        "card": "BECZKA",
    },
    // {
    //     "field": board[1][1],
    //     'card': 'SYJAMCZYK',
    // },
    {
        "field": board[1][0],
        'card': 'KULOODPORNY',
        'overlay': 'BOSS'
    },
    {
        "field": board[2][0],
        'card': 'ZENEK',
    },
    // {
    //     "field": board[1][1],
    //     'card': 'WACEK',
    // },
    // {
    //     "field": board[2][0],
    //     'card': 'ARKADIUSZ'
    // },
    // {
    //     "field": board[2][2],
    //     'card': 'CZESIEK'
    // },
    // {
    //     "field": board[3][1],
    //     "card": "MUR",
    // }
]

export function testMode() {
    if (TEST_MODE.board) putCardsOnBoard();
    changeCards(test_deck_ludzie, start_cards_ludzie);
    changeCards(test_deck_zombiaki, start_cards_zombiaki);
    const endCard = {
        id: 'dawn',
        amount: 1,
        name: "ŚWIT",
        image_src: `images/cards/zombiaki/dawn.webp`
    }

    test_deck_zombiaki.push(endCard);
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