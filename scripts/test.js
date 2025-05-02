import { setActiveCard } from "./index.js";
import { board, setField } from "./board.js";
import { addOverlay } from "./zombiaki/utils.js";
import { raceFunctions } from "./allFunctions.js";

const test_card = {
    "id": 3,
    "amount": 1,
    "name": "WACEK",
    "type": "zombiak",
    "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
    "flavor": "Taki sobie, na trzy plus.",
    "hp": 1,
    "max_hp": 3,
    "race": "zombiaki"
};

const second_test_card = {
    "id": 3,
    "amount": 1,
    "name": "WACEK",
    "type": "zombiak",
    "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
    "flavor": "Taki sobie, na trzy plus.",
    "hp": 1,
    "max_hp": 3,
    "race": "zombiaki"
}

const third_test_card = {
    "id": 26,
    "amount": 1,
    "name": "MUR",
    "type": "object",
    "mur": true,
    "hp": 6,
    "description": "Wystaw Mur na wolne pole, z wyjątkiem: pól sąsiadujących (też po skosie) z Zombiakiem; przecznic znajdujących się za Zombiakiem; przecznicy V. Zombiak nie może wejść na Mur, chyba że suma jego siły io wszystkich Zombiaków idących za nim wyniesie 6 lub więcej. Na pola za Murem nie działa Reflektor, Zapora, ani Jajnik.",
    "flavor": "Bez spychacza- zapomnij.",
    "board": true,
    "walkable": true,
    "race": "ludzie"
}

const test_overlay_card = {
    "id": 1,
    "amount": 1,
    "name": "MIŚ",
    "type": "overlay",
    "overlay_text": "ZAGRAJ MISIA",
    "description": "Połóż Misia na wybranego Zombiaka (z wyjątkiem Psa i Kota). Miś porusza się razem z Zombiakiem. W twojej turze możesz zmniejszyć siłę Misia o 1, aby grający ludźmi odrzucił 2 karty, a nie 1 w najbliższej fazie Odrzucenia. Miś może być atakowany tak jak Zombiak. Grający ludźmi może atakować Zombiaka lub Misia - jeśli Miś otrzyma więcej ran niż ma aktualnie siły, to pozostałe rany otrzymuje Zombiak. Jeśli Zombiak zginie, to Miś ginie razem z nim.",
    "flavor": "Misio chce zombiaczka.",
    "hp": 1,
    "max_hp": 4,
    "special": true,
    "race": "zombiaki"
}

const TEST_FIELD = board[2][0];
const SECOND_TEST_FIELD = board[1][0];
const THIRD_TEST_FIELD = board[3][0];


export function testMode() {
    setActiveCard(test_card);
    setField(TEST_FIELD, test_card);
    setField(SECOND_TEST_FIELD, second_test_card);
    setField(THIRD_TEST_FIELD, third_test_card);
    if (test_overlay_card) {
        const { id, race } = test_overlay_card;
        addOverlay(test_overlay_card, TEST_FIELD, raceFunctions[`${race}_id_${id}_callback`])
    }
}