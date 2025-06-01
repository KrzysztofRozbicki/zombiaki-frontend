
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
import { show, hide, enable, disable, randomRotate } from '../utils.js';
import { board } from "../board.js";
import { clearBoard } from './../board.js';
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
    const zombiaki_deck = document.getElementById('deck_zombiaki');
    disable(zombiaki_deck);
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const { element, overlay_cards } = board[i][j];
            const temp_card = board[i][j].card;
            if (!temp_card) continue;
            const { type, name } = temp_card;

            if (type !== 'zombiak' && (name === 'KOT' || name === 'PIES')) continue;
            if (overlay_cards && overlay_cards?.length > 0) {
                const is_overlay = !!overlay_cards.find(overlay_card => overlay_card.name === card.name);
                if (is_overlay) continue;
            }
            element.classList.add('overlay_available');
            const handler = overlayHandler(card, board[i][j], callback);
            element.handler = handler;
            element.addEventListener('click', handler, { once: true });
        }
    }
}



function overlayHandler(card, field, callback) {
    return function () {
        addOverlay(card, field, callback);
    }
}


export function addOverlay(card, field_board, callback) {

    if (card.race === 'zombiaki') {
        const zombiaki_deck = document.getElementById('deck_zombiaki');
        enable(zombiaki_deck);
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
    const handler = showOverlay(field_board, card, callback);
    overlay.handler = handler;
    overlay.addEventListener('click', handler);
    removeCard();
    clearBoard();
}

function showOverlay(field_board, card, callback) {
    return function () {
        if (getTurn() === 'ludzie') return;
        const { race, id } = card;
        play_overlay.innerText = card.overlay_text || '';
        show(chosen_card);
        chosen_card.classList.remove('hidden');
        chosen_card_picture.src = `images/cards/${race}/${id}.webp`;
        const chosen_card_health = document.getElementById('chosen_card_health');
        chosen_card_health.dataset.max_hp = card.max_hp;
        chosen_card_health.dataset.current_hp = card.hp;
        hide(play_card);
        if (card.overlay_text) show(play_overlay);
        hide(throw_card);

        let handler = handleCloseOverlay();
        close_card.handler = handler;
        close_card.addEventListener('click', handler, { once: true });
        handler = null;
        handler = handlePlayOverplay(field_board, callback);
        play_overlay.handler = handler;
        play_overlay.addEventListener('click', handler);
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
        close_card.removeEventListener('click', close_card.handler);
        close_card.handler = null;
    }
}

function closeOverlay() {
    show(play_card);
    hide(play_overlay);
    hide(chosen_card);
    play_overlay.removeEventListener('click', play_overlay.handler)
    const chosen_card_health = document.getElementById('chosen_card_health');
    play_overlay.handler = null;
    chosen_card_health.dataset.max_hp = null;
    chosen_card_health.dataset.current_hp = null;
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
