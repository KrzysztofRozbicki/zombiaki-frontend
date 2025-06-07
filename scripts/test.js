import { cards_humans_json } from './humans/cards.js';
import { cards_zombies_json } from './zombies/cards.js';
import { board, setField } from "./board.js";
import { addOverlay } from "./zombies/utils.js";
import { raceFunctions } from "./allFunctions.js";


export const TEST_STATE = true;

export const TEST_MODE = {
    race: 'zombies',
    board: true,
};

let test_deck_humans = cards_humans_json;
let test_deck_zombies = cards_zombies_json;

const all_cards = [...cards_humans_json, ...cards_zombies_json];

const start_cards_zombies = ['KLIK', 'PAPU', 'MASA', 'ZENEK'];
const start_cards_humans = ['MIOTACZ', 'SIEĆ', 'DŁUGA SERIA', 'CEGŁA'];

const test_board = [
    // {
    //     "field": board[1][0],
    //     "card": 'KOŃ TROJAŃSKI',
    //     "overlay": 'MIŚ'
    // },
    // {
    //     "field": board[4][0],
    //     "card": "BECZKA",
    // },
    // {
    //     "field": board[1][1],
    //     'card': 'AUTO',
    // },
    {
        "field": board[1][0],
        'card': 'IWAN'
    },
    // {
    //     "field": board[0][1],
    //     'card': 'ZENEK'
    // },
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
    changeCards(test_deck_humans, start_cards_humans);
    changeCards(test_deck_zombies, start_cards_zombies);
    const endCard = {
        id: 'dawn',
        amount: 1,
        name: "ŚWIT",
        image_src: `images/cards/zombies/dawn.webp`
    }

    test_deck_zombies.push(endCard);
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

export function get_test_deck_humans() {
    return test_deck_humans;
}

export function get_test_deck_zombies() {
    return test_deck_zombies;
}