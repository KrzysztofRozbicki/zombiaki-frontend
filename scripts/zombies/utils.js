
import {
    chosen_card,
    chosen_card_picture,
    close_card,
    play_card,
    throw_card,
    getTurn,
    removeCard,
    cancel_button
} from "../index.js";
import { show, hide, enable, disable, randomRotate, addListener, removeListener } from '../utils.js';
import { addInstruction, board } from "../board.js";
import { clearBoard } from '../board.js';
const play_overlay = document.getElementById('play_overlay');

export function useBear(field_board) {
    const { element, overlay_cards } = field_board;
    const bear_index = overlay_cards.findIndex(card => card.name === 'MIŚ');
    overlay_cards[bear_index].hp -= 1;
    const bear_element = element.querySelector('div[data-name="MIŚ"]');
    const hp_element = bear_element.querySelector('.hp_element');
    hp_element.dataset.current_hp = overlay_cards[bear_index].hp;
    if (overlay_cards[bear_index].hp === 0) deleteOverlay(field_board, 1);
}

export function putOverlay(card, callback) {
    const zombies_deck = document.getElementById('deck_zombies');
    disable(zombies_deck);
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const { element, overlay_cards } = board[i][j];
            const temp_card = board[i][j].card;
            if (!temp_card) continue;
            const { type, name } = temp_card;

            if (type !== 'zombie' && (name === 'KOT' || name === 'PIES')) continue;
            if (overlay_cards && overlay_cards?.length > 0) {
                const is_overlay = !!overlay_cards.find(overlay_card => overlay_card.name === card.name);
                if (is_overlay) continue;
            }
            element.classList.add('overlay_available');
            addListener(element, overlayHandler(card, board[i][j], callback), { once: true });
        }
    }
}



function overlayHandler(card, field, callback) {
    return function () {
        addOverlay(card, field, callback);
    }
}


export function addOverlay(card, field_board, callback) {

    if (card.race === 'zombies') {
        const zombies_deck = document.getElementById('deck_zombies');
        enable(zombies_deck);
    }

    const { element } = field_board;

    if (!field_board.overlay_cards) {
        field_board.overlay_cards = [];
    }

    field_board.overlay_cards.push(card)
    const { id, race, hp, max_hp, name } = card;
    element.classList.remove('overlay_available');
    let overlay_container = element.querySelector('.overlay_container');
    const is_container = !!overlay_container;

    if (!overlay_container) {
        overlay_container = document.createElement('div');
        overlay_container.classList.add('overlay_container');
    }

    const overlay_element = document.createElement('div');
    randomRotate(15, overlay_element);
    overlay_element.setAttribute('id', id);
    overlay_element.classList.add('overlay')
    overlay_element.dataset.name = name;

    const imgElement = document.createElement('img');
    imgElement.src = `images/cards/${race}/${id}.webp`;
    overlay_element.appendChild(imgElement);

    if (hp) {
        const hpElement = document.createElement('div');
        hpElement.dataset.max_hp = max_hp;
        hpElement.dataset.current_hp = hp;
        hpElement.dataset.card_id = id;
        hpElement.dataset.overlay = true;
        overlay_element.appendChild(hpElement);
        hpElement.classList.add('hp_element');
        if (card.name === 'BOSS') hpElement.classList.add('boss');
    };

    overlay_container.appendChild(overlay_element)

    if (!is_container) {
        element.appendChild(overlay_container);
    };

    hide(cancel_button);
    const overlay = overlay_container.querySelector(`div[data-name="${card.name}"]`);
    addListener(overlay, showOverlay(field_board, card, callback));
    removeCard();
    clearBoard();
}

export function showOverlay(field_board, card, callback) {
    return function () {
        if (field_board.element.handler) return;
        const { race, id } = card;
        play_overlay.innerText = card.overlay_text || '';
        show(chosen_card);
        chosen_card.classList.remove('hidden');
        chosen_card_picture.src = `images/cards/${race}/${id}.webp`;
        const chosen_card_health = document.getElementById('chosen_card_health');
        chosen_card_health.dataset.max_hp = card.max_hp;
        chosen_card_health.dataset.current_hp = card.hp;
        hide(play_card);
        if (card.overlay_text && getTurn() !== 'humans') show(play_overlay);
        if (getTurn() === 'humans') {
            const button_box = chosen_card.querySelector('.card_buttons_box');
            hide(button_box);
        }
        hide(throw_card);

        addListener(close_card, handleCloseOverlay());
        addListener(play_overlay, handlePlayOverplay(field_board, callback))
        const place_instruction_element = document.querySelector("#chosen_card > div");
        addInstruction(place_instruction_element, card);
    }
}

function handleCloseOverlay() {
    return function () {
        closeOverlay();
    }
}

function handlePlayOverplay(field_board, callback) {
    return function () {
        callback(field_board);
        closeOverlay();
        removeListener(close_card);
    }
}

function closeOverlay() {
    show(play_card);
    hide(play_overlay);
    hide(chosen_card);
    removeListener(play_overlay);
    removeListener(close_card);
    const chosen_card_health = document.getElementById('chosen_card_health');
    chosen_card_health.dataset.max_hp = null;
    chosen_card_health.dataset.current_hp = null;
    const instruction_element = document.querySelector('#chosen_card .instruction_element');
    if (instruction_element) instruction_element.remove();
    const button_box = chosen_card.querySelector('.card_buttons_box');
    show(button_box);
}

export function deleteOverlay(field_board, id) {
    const { element, overlay_cards } = field_board;
    const index_remove = overlay_cards.findIndex(card => card.id === id);
    const card_to_remove = overlay_cards.find(card => card.id === id);
    field_board.overlay_cards.splice(index_remove, 1);
    if (field_board.overlay_cards.length === 0) field_board.overlay_cards = null;
    const overlay_element = element.querySelector(`div[data-name="${card_to_remove.name}"]`);
    overlay_element.remove();
    hide(chosen_card);
    closeOverlay();
}
