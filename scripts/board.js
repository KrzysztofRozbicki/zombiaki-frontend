import { raceFunctions } from "./allFunctions.js";
import { gameOver, removeCard, deck_zombiaki_element, checkBucket, cancel_button, chosen_card, throw_card, play_card, chosen_card_picture, close_card } from "./index.js";
import { addOverlay, deleteOverlay } from "./zombiaki/utils.js";
import { show, hide, enable, disable, randomRotate, showAlert, addListener, removeListener } from "./utils.js";
import { killZombiak, damageZombiak, killPet } from "./ludzie/utils.js";
import { galareta_overlay, zombiak_1 } from "./zombiaki/cards.js";

const T1_P5 = document.querySelector('div[data-tor="1"][data-przecznica="5"]');
const T2_P5 = document.querySelector('div[data-tor="2"][data-przecznica="5"]');
const T3_P5 = document.querySelector('div[data-tor="3"][data-przecznica="5"]');
const T1_P4 = document.querySelector('div[data-tor="1"][data-przecznica="4"]');
const T2_P4 = document.querySelector('div[data-tor="2"][data-przecznica="4"]');
const T3_P4 = document.querySelector('div[data-tor="3"][data-przecznica="4"]');
const T1_P3 = document.querySelector('div[data-tor="1"][data-przecznica="3"]');
const T2_P3 = document.querySelector('div[data-tor="2"][data-przecznica="3"]');
const T3_P3 = document.querySelector('div[data-tor="3"][data-przecznica="3"]');
const T1_P2 = document.querySelector('div[data-tor="1"][data-przecznica="2"]');
const T2_P2 = document.querySelector('div[data-tor="2"][data-przecznica="2"]');
const T3_P2 = document.querySelector('div[data-tor="3"][data-przecznica="2"]');
const T1_P1 = document.querySelector('div[data-tor="1"][data-przecznica="1"]');
const T2_P1 = document.querySelector('div[data-tor="2"][data-przecznica="1"]');
const T3_P1 = document.querySelector('div[data-tor="3"][data-przecznica="1"]');

let active_field = null;
let move_zombiaki = true;
let pet_moves = 0;


export const board = [
    [{ element: T1_P1 }, { element: T2_P1 }, { element: T3_P1 }],
    [{ element: T1_P2 }, { element: T2_P2 }, { element: T3_P2 }],
    [{ element: T1_P3 }, { element: T2_P3 }, { element: T3_P3 }],
    [{ element: T1_P4 }, { element: T2_P4 }, { element: T3_P4 }],
    [{ element: T1_P5 }, { element: T2_P5 }, { element: T3_P5 }],
];

export function placeCard(card) {
    cardFunction(card);
    cancelCard(card);
}

export function putZombiak(card) {
    const zombiaki_deck = document.getElementById('deck_zombiaki');
    disable(zombiaki_deck);
    for (let i = 0; i < board[0].length; i++) {
        if (board[0][i].card) continue;
        putCard(board[0][i], card);
    }
}


export function updateBoard(prev_turn) {
    const overlay_elements = document.querySelectorAll('.overlay_container');
    overlay_elements.forEach(element => {
        enable(element);
    });
    cancel_button.className = '';
    hide(cancel_button);
    if (prev_turn === 'ludzie') {
        moveZombiaki();
    }

    setTimeout(() => {
        const overlay_elements = document.querySelectorAll('.overlay_container');
        overlay_elements.forEach(element => {
            if (!element.classList.contains('disable')) disable(element);
        });
    }, 100);

    if (prev_turn === 'zombiaki') {
        const web_elements = document.querySelectorAll('.webbed');
        web_elements.forEach(element =>
            element.classList.remove('webbed')
        )
        moveLudzie();
    }
}

export function resetUsableCards() {
    const overlay_elements = document.querySelectorAll('.overlay_container');
    overlay_elements.forEach(element => {
        enable(element);
    })
}

async function moveZombiaki() {
    disable(deck_zombiaki_element);
    if (!move_zombiaki) {
        move_zombiaki = true;
        checkBucket();
        return;
    }
    await checkPet();
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const old_field = board[i][j];
            const { card } = old_field;
            if (!card) continue;
            if (card.type === "zombiak" && !card.pet) {
                moveSingleZombiak(old_field, card, 'front');
            }
        }
    }
    checkBucket();
}

async function checkPet() {
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card_pet } = field;
            if (!card_pet) continue;
            if (card_pet) {
                await movePet(field);
                return;
            }
        }
    }
}

function movePet(field) {

    const { card_pet } = field;
    const { name, pet_move } = card_pet;
    pet_moves = pet_move;
    return new Promise((resolve) => {
        showAlert(`NA POCZĄTKU TURY PRZESUŃ KARTĘ "${name}"`);
        setAvailablePetFields(field, resolve);
    })
}


function setAvailablePetFields(field, resolve) {

    if (pet_moves === 0) {
        enable(deck_zombiaki_element);
        removeListener(cancel_button);
        hide(cancel_button);
        resolve(true);
        return;
    }


    const { element } = field;
    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;

    const cross = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    const all_fields = [];
    const direction_offset = ['left', 'right', 'front', 'back'];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        if (checkMur(t, p, board[p][t])) continue;
        board[p][t].direction = direction_offset[i];
        all_fields.push(board[p][t]);
    }

    all_fields.forEach((new_field) => {
        const { element } = new_field;
        element.classList.add('move_on');
        const handler_mouseover = hoverPetHandler(field, new_field);
        element.handler_mouseover = handler_mouseover;
        element.addEventListener('mouseover', handler_mouseover);
        addListener(element, setNewPetField(field, new_field, resolve))
    })
}

function setNewPetField(old_field, new_field, resolve) {
    return function () {
        pet_moves--;
        clearBoard();
        moveSingleZombiak(old_field, old_field.card_pet, new_field.direction);
        if (!new_field?.card_pet) {
            resolve(true);
            clearBoard();
            enable(deck_zombiaki_element);
            return;
        }
        setAvailablePetFields(new_field, resolve);
        new_field.element.style.backgroundImage = ``;
        new_field.element.classList.remove('background_image');
        new_field.element.style.removeProperty('--bg-image');
        old_field.element.classList.remove('no_image');
        if (pet_moves === new_field?.card_pet?.pet_move - 1) {
            cancelCard(new_field.card_pet, resolve);
        }
    }
}

function hoverPetHandler(old_field, new_field) {
    return function () {
        const handler = outPetHandler(old_field, new_field);
        new_field.element.addEventListener('mouseout', handler, { once: true })
        new_field.element.classList.add('background_image');
        new_field.element.handler_mouseout = handler;
        const { card_pet } = old_field;
        const { id, race } = card_pet;
        new_field.element.style.setProperty('--bg-image', `url('../images/cards/${race}/${id}.webp')`)
        old_field.element.classList.add('no_image');
    }
}

function outPetHandler(old_field, new_field) {
    return function () {
        new_field.element.classList.remove('background_image');
        new_field.element.style.removeProperty('--bg-image');
        old_field.element.classList.remove('no_image');
    }
}


export function moveSingleZombiak(old_field, card, direction) {
    const { element } = old_field;
    if (element.classList.contains('webbed')) return;
    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;
    if (checkZapora(old_field) && !card.pet) return;

    const direction_offset = {
        'front': [1, 0],
        'back': [-1, 0],
        'left': [0, -1],
        'right': [0, 1],
    }

    const [przecznica_offset, tor_offset] = direction_offset[direction];
    const new_przecznica = przecznica + przecznica_offset;
    const new_tor = tor + tor_offset;
    if (new_przecznica < 0 || new_tor < 0 || new_tor > 2) return;

    const game_over = checkConcreteShoes(old_field);

    if (new_przecznica === 5 && game_over) {
        gameOver('zombiaki');
        return;
    }

    const next_field = board[new_przecznica][new_tor];

    const is_beczka = next_field?.card_board && next_field?.card_board.name === 'BECZKA';

    if (next_field.element.classList.contains('galareta')) {
        next_field.element.classList.remove('galareta');
        old_field.card.hp += 2;
        if (old_field.card.hp > old_field.card.max_hp) addOverlay(galareta_overlay, next_field, null);
    }

    if (checkMur(new_tor, przecznica, next_field)) return;
    if (!next_field) return;

    if (!card.pet) {
        const next_field_is_taken = !!(next_field.card && !next_field.card.walkable);
        if (next_field_is_taken) return;
    }

    let pet_status = null;

    if (card.pet) pet_status = 'OUT';
    if (!card.pet && old_field.card_pet) pet_status = 'STAY';
    if (is_beczka) unsetField(next_field, { all: true });
    putPicture(next_field, card);
    if (old_field.overlay_cards && old_field.overlay_cards.length > 0) moveOverlay(old_field, next_field);
    if (is_beczka) killZombiak(next_field);
    unsetField(old_field, { pet: pet_status });
    const is_hole = next_field?.card_board && next_field?.card_board.name === 'DZIURA';
    if (is_hole) checkHole(next_field);
    if (card.pet) {
        const pet_element = element.querySelector('.field_pet');
        if (pet_element) pet_element.remove();
    }
    checkBlowField(next_field, { move: true });
    if (card.name === 'MŁODY') setMlody(next_field, card);
}

function checkHole(field) {
    const hole_death_zombie = field?.card?.hp <= 2;
    const hole_death_pet = field?.card_pet?.hp <= 2;
    const human_card = field?.overlay_cards?.find(card => card.name === 'CZŁOWIEK');
    if (human_card) deleteOverlay(field, human_card.id);
    if (hole_death_zombie) killZombiak(field);
    if (hole_death_pet) killPet(field);
    if (human_card || hole_death_pet || hole_death_zombie) unsetField(field, { board_card: true });
}

function setMlody(field) {
    const { element, card } = field;
    card.hp += 1;
    card.max_hp += 1;
    const hp_element = element.querySelector('.field_image > div');
    hp_element.dataset.max_hp = card.max_hp;
    hp_element.dataset.current_hp = card.hp;
}

function checkConcreteShoes(old_field) {
    if (!old_field.overlay_cards || old_field.overlay_cards.length === 0) return true;
    const concrete_shoes_card = old_field.overlay_cards.find(card => card.name === 'BETONOWE BUCIKI');
    if (!concrete_shoes_card) return true;
    damageZombiak(concrete_shoes_card.dmg, old_field);
    const is_syjamczyk = old_field.card.name === 'SYJAMCZYK';
    const is_troyan = old_field.card.name === 'KOŃ TROJAŃSKI';
    if (old_field.card.hp === 0 && (is_syjamczyk || is_troyan)) return true;
    if (old_field.card.hp > 0) return false;
}

export function checkBlowField(field, move = false) {
    const { card_board } = field;
    if (!card_board) return;
    if (card_board.name !== 'MINA' && card_board.name !== 'AUTO') return;
    if (move && card_board.name === 'AUTO') return;
    blowField(field);
}

function blowField(field) {
    const { card_board, card, element } = field;
    if (card && card.type === 'zombiak') damageZombiak(card_board.dmg, field);
    field.card_board = null;
    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;
    let cross = []
    if (card_board.name === 'MINA') {
        cross = [[1, 0], [-1, 0], [0, -1], [0, 1]];
    }
    if (card_board.name === 'AUTO') {
        cross = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, -1], [0, 1]]
    }
    const all_fields = [];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        all_fields.push(board[p][t]);
    }

    for (let i = 0; i < all_fields.length; i++) {
        const { card, board_card } = all_fields[i];
        checkBlowField(all_fields[i]);
        if (card && card?.type === 'zombiak') {
            damageZombiak(card_board.blow_dmg, all_fields[i])
        }
    }
    const blow_element = element.querySelector('.field_board');
    blow_element.remove();
}

export function moveOverlay(old_field, new_field) {
    const overlay = old_field.element.querySelector('.overlay_container');
    if (!overlay) return;

    const overlay_cards = old_field.overlay_cards;
    old_field.overlay_cards = null;
    overlay_cards.forEach(card => {
        const { id, race } = card;
        const callback = `${race}_id_${id}_callback`;
        addOverlay(card, new_field, raceFunctions[callback]);
    })
}

function moveLudzie() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const { card_board } = board[i][j];
            if (!card_board) continue;
            if (card_board.name === 'ZAPORA') unsetField(board[i][j]);
            if (card_board.name !== 'BECZKA') continue;
            unsetField(board[i][j], { board_card: true });
            if (i === 0) continue;
            const new_field = board[i - 1][j];
            if (!new_field.card && !new_field.card_board) {
                setField(new_field, card_board);
                continue;
            }
            if (new_field?.card_board?.name === 'DZIURA') {
                unsetField(new_field, { board_card: true });
                continue;
            }
            if (new_field?.card_board?.name === 'MUR' ||
                new_field?.card_board?.name === 'MUR Z RUPIECI' ||
                new_field?.card_board?.name === 'AUTO') continue;
            checkBlowField(new_field);
            if (new_field?.card?.type === 'zombiak') {
                killZombiak(new_field);
                continue;
            }
        }
    }
}

export function putCard(field, card) {
    const { element } = field;
    element.classList.add('field_available', `${card.race}`);
    addListener(element, setFieldHandler(field, card));
}

export function unsetField(board_field, options = {}) {
    const { board_card = false, pet = null, bear = false, all = false } = options;
    const { element } = board_field;

    const board_element = element.querySelector('.field_board');
    const card_element = element.querySelector('.field_image');
    const pet_element = element.querySelector('.field_pet');
    const overlay_element = element.querySelector('.overlay_container');

    if (board_card) {
        board_element.remove();
        board_field.card_board = null;
        return;
    }

    if (pet === 'OUT') {
        if (pet_element) pet_element.remove();
        board_field.card_pet = null;
        return;
    }

    if (pet === 'STAY') if (card_element) card_element.remove();

    if (all) {
        checkBlowField(board_field)

        if (card_element) killZombiak(board_field);
        if (pet_element) pet_element.remove();
        if (overlay_element) overlay_element.remove();
        if (board_element) board_element.remove();
        if (board_field.card) board_field.card = null;
        if (board_field.overlay_cards) board_field.overlay_cards = null;
        if (board_field.card_board) board_field.card_board = null;
        if (board_field.card_pet) board_field.card_pet = null;
        board_field.element.className = ''
        board_field.element.classList.add('field');
        return;
    }

    if (card_element) card_element.remove();
    if (pet_element && pet !== 'STAY') pet_element.remove();
    if (board_element && !board_field?.card_board?.walkable) board_element.remove();
    if (overlay_element && !bear) {
        overlay_element.remove();
        board_field.overlay_cards = null;
    }

    element.dataset.id = null;
    element.dataset.name = null;
    element.dataset.type = null;
    element.dataset.overlay = null;
    board_field.card = null;
}

export function setField(field, card, other = false) {
    putPicture(field, card);
    clearBoard();
    if (!other) removeCard();
    hide(cancel_button);
    if (card.race === 'zombiaki') {
        const zombiaki_deck = document.getElementById('deck_zombiaki');
        if (!other) enable(zombiaki_deck);
    }
    if (card.race === 'ludzie') {
        const ludzie_deck = document.getElementById('deck_ludzie');
        if (!other) enable(ludzie_deck);
    }
}

function setFieldHandler(field, card) {
    return function () {
        setField(field, card);
        removeListener(cancel_button);
    }
}

function putPicture(field, card) {

    const { id, name, race, type, hp, max_hp } = card;
    const { element } = field;

    const div_element = document.createElement('div');
    randomRotate(10, div_element);
    div_element.classList.add('field_image')
    const img_element = document.createElement('img');
    img_element.src = `images/cards/${race}/${id}.webp`;
    img_element.dataset.name = name;
    addListener(img_element, showZombieCard(img_element, card))
    if (name === 'MASA') {
        img_element.src = 'images/cards/zombiaki/masa.webp';
        img_element.dataset.name = 'MASA';
    }
    div_element.appendChild(img_element);

    const is_galareta = !!element.classList.contains('galareta');
    if (is_galareta) {
        element.classList.remove('galareta');
        card.hp += 2;
        addOverlay(galareta_overlay, field, null);
    }

    if (name === 'MASA') {
        const hp_element = document.createElement('div');
        hp_element.classList.add('hp_masa');
        div_element.appendChild(hp_element);
        const text_hp = document.createElement('p');
        text_hp.innerText = `${hp} `;
        text_hp.classList.add('hp_masa__text');
        const max_text_hp = document.createElement('p');
        max_text_hp.innerHTML = 'x';
        max_text_hp.classList.add('hp_masa__text__x');
        const hp_image = document.createElement('img');
        hp_image.src = 'images/cards/zombiaki/hp_image.webp';
        hp_element.append(text_hp, max_text_hp, hp_image);
        div_element.appendChild(hp_element);
    }

    if (hp && name !== 'MASA') {
        const hp_element = document.createElement('div');
        hp_element.dataset.max_hp = max_hp;
        hp_element.dataset.current_hp = hp;
        hp_element.dataset.card_id = id;
        hp_element.classList.add('hp_element');
        div_element.appendChild(hp_element);
        if (card.name === "MŁODY") {
            hp_element.classList.add('mlody');
        }
    }

    element.append(div_element);
    element.dataset.id = id;
    element.dataset.name = name;
    element.dataset.type = type;

    if (card.pet) {
        field.card_pet = card;
        div_element.classList.remove('field_image');
        div_element.classList.add('field_pet');
        return;
    }

    if (card.board && card.race === 'ludzie') {
        field.card_board = card;
        div_element.classList.remove('field_image');
        div_element.classList.add('field_board');
        return;
    }
    field.card = card;

}

function showZombieCard(image_element, card) {
    return function () {
        if (image_element.parentNode.parentNode.handler || image_element.parentNode.handler) return;
        show(chosen_card);
        const button_box = chosen_card.querySelector('.card_buttons_box');
        hide(button_box);
        chosen_card_picture.src = image_element.src;
        const instruction_container = chosen_card.querySelector('div');
        const chosen_card_health = document.getElementById('chosen_card_health');
        chosen_card_health.dataset.max_hp = card.max_hp;
        chosen_card_health.dataset.current_hp = card.hp;
        addInstruction(instruction_container, card);
        close_card.addEventListener('click', () => {
            hide(chosen_card);
            show(button_box);
            const instruction_element = chosen_card.querySelector('.instruction_element');
            if (instruction_element) instruction_element.remove();
        }, { once: true });
    }
}

export function addInstruction(element, card) {
    if (!card.instruction) return;
    const instruction_element = document.createElement('div');
    instruction_element.classList.add('instruction_element');
    addListener(instruction_element, showInstruction(card));
    element.append(instruction_element);
}

function showInstruction(card) {
    return function () {
        showAlert(card.instruction, false, true);
    }
}

function cardFunction(card) {
    const { id, race, type, special } = card;
    if (type === "zombiak") {
        putZombiak(card);
        return;
    }
    const function_name = `${race}_id_${id}`;
    raceFunctions[function_name](card, active_field);
}

export function setMoveZombiaki(value) {
    move_zombiaki = value;
}

function cancelCard(card, resolve = null) {
    const { board, race } = card;
    if (!board) return;
    show(cancel_button);
    cancel_button.classList.add(`${race}_active`);
    addListener(cancel_button, handleCancelCard(card, resolve));
}

function handleCancelCard(card, resolve = null) {
    return function () {
        const { race } = card;
        clearBoard();
        hide(cancel_button);
        const deck = document.getElementById(`deck_${race}`);
        enable(deck);
        const all_fields = document.querySelectorAll('.field');
        all_fields.forEach(field => enable(field));
        const tor_elements = document.querySelectorAll('.tor_electricity');
        tor_elements.forEach(el => {
            hide(el);
            removeListener(el);
        });
        const fire_elements = document.querySelectorAll('.tor_fire');
        fire_elements.forEach(el => {
            hide(el);
            removeListener(el);
        });
        if (resolve) resolve(true);
    }
}

export function clearBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const field = board[i][j];
            const { element } = field;
            let was_galareta = !!element.classList.contains('galareta');
            let was_webbed = !!element.classList.contains('webbed')

            element.className = '';
            element.classList.add('field');
            if (was_webbed) element.classList.add('webbed');
            if (was_galareta) element.classList.add('galareta');
            const cards_on_field = element.querySelectorAll('.field > .field_image, .field > .field_board, .field > .overlay');
            cards_on_field.forEach(el => {
                removeListener(el);
                el.classList.remove('kilof_available');
                el.removeEventListener('click', el.shot_handler);
                el.shot_handler = null;
            })
            removeListener(element);
            if (element.handler_mouseover) {
                element.removeEventListener('mouseover', element.handler_mouseover);
                element.handler_mouseover = null;
            }
            if (element.handler_mouseout) {
                element.removeEventListener('mouseout', element.handler_mouseout);
                element.handler_mouseout = null;
            }
        }
    }
}

export function checkZapora(field) {
    const { element } = field;
    const tor = +element.dataset.tor - 1;
    const board_field = board[4][tor];

    const card_przecznica = board_field.card_board;
    if (!card_przecznica) return false;
    if (card_przecznica.name === 'ZAPORA') return true;
}

export function checkMur(tor, przecznica, next_field) {
    let is_mur = next_field?.card_board && next_field?.card_board.mur;
    if (!is_mur) return false;
    const mur_hp = next_field.card_board.hp;
    let summary_hp = 0;
    for (let i = przecznica; i >= 0; i--) {
        if (board[i][tor]?.card && board[i][tor]?.card.type === 'zombiak') {
            summary_hp += +board[i][tor].card.hp;
            continue;
        }
        break;
    }
    if (mur_hp > summary_hp) return true;
    return false;
}

export function moveAllZombiakiBack() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card, card_pet } = field;
            if (card?.type === 'zombiak') moveSingleZombiak(field, card, 'back');
            if (card_pet) moveSingleZombiak(field, card_pet, 'back');
        }
    }
}

export function deadGalareta(field) {
    const { element } = field;
    element.classList.add('galareta');
}

export function deadSpecialZombiakOneCard(field, number) {
    const available_fields = checkAvailableDeadFields(field, number);

    available_fields.forEach(board_field => {
        setField(board_field, zombiak_1, { other: true });
    })


}

function checkAvailableDeadFields(field, number) {
    const { element } = field;
    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;
    const cross = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    const all_fields = [];
    all_fields.push(field);
    let number_of_zombiak_1 = 1;
    for (let i = 0; i < cross.length; i++) {
        if (number_of_zombiak_1 >= number) return all_fields;
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > przecznica) continue;
        const { card, card_board } = board[p][t];
        if (card?.type === 'zombiak' || card_board?.mur) continue;
        all_fields.push(board[p][t]);
        number_of_zombiak_1 += 1;
    }
    return all_fields;
}