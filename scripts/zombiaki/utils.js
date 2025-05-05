
import { chosen_card, chosen_card_picture, close_card, play_card, throw_card, getTurn, removeCard } from "../index.js";
import { show, hide, enable, disable, randomRotate } from '../utils.js';
import { board } from "../board.js";
const play_overlay = document.getElementById('play_overlay');

export function useOverlay(field_board) {
    const { element, card_overlay } = field_board;
    card_overlay.hp -= 1;
    const hp_element = element.querySelector('div[data-overlay="true"]');
    hp_element.dataset.current_hp = card_overlay.hp;
    if (card_overlay.hp === 0) deleteOverlay(field_board);
}

export function putOverlay(card, callback) {
    const zombiaki_deck = document.getElementById('deck_zombiaki');
    disable(zombiaki_deck);
    let no_zombiak = true;
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const { element } = board[i][j];
            const temp_card = board[i][j].card;
            if (!temp_card) continue;
            const { type, name } = temp_card;

            if (type !== 'zombiak' && (name === 'KOT' || name === 'PIES')) continue;
            no_zombiak = false;
            element.classList.add('overlay_available');
            const handler = overlayHandler(card, board[i][j], callback);
            element.overlay_handler = handler;
            element.addEventListener('click', handler, { once: true });
        }
    }
}

export const zombiak_1 = {
    'id': 'rewers',
    'race': 'zombiaki',
    'type': 'zombiak',
    'hp': 1,
    'max_hp': 1,
    'board': true
}

function overlayHandler(card, field, callback) {
    return function () {
        addOverlay(card, field, callback);
    }
}
export function addOverlay(card, field_board, callback) {
    const zombiaki_deck = document.getElementById('deck_zombiaki');
    enable(zombiaki_deck);
    const { element } = field_board;
    field_board.card_overlay = card;
    const { id, race, hp, max_hp } = card;
    element.classList.remove('overlay_available');

    const overlayElement = document.createElement('div');
    randomRotate(15, overlayElement);
    overlayElement.setAttribute('id', 'overlay');
    overlayElement.classList.add('overlay')

    const imgElement = document.createElement('img');
    imgElement.src = `images/cards/${race}/${id}.webp`;
    overlayElement.appendChild(imgElement);

    if (hp) {
        const hpElement = document.createElement('div');
        hpElement.dataset.max_hp = max_hp;
        hpElement.dataset.current_hp = hp;
        hpElement.dataset.card_id = id;
        hpElement.dataset.overlay = true;
        overlayElement.appendChild(hpElement);
    };

    element.appendChild(overlayElement);

    element.dataset.overlay = card.overlay_text;

    const cancel_button = document.getElementById('cancel');
    hide(cancel_button);

    const overlay = element.querySelector('#overlay');
    const handler = showOverlay(field_board, field_board.card_overlay, callback);
    overlay.handler = handler;
    overlay.addEventListener('click', handler);
    removeCard();
}

function showOverlay(field_board, card, callback) {
    return function () {
        if (getTurn() === 'ludzie') return;
        const { element } = field_board;
        play_overlay.innerText = element.getAttribute('data-overlay');
        show(chosen_card);
        chosen_card.classList.remove('hidden');
        chosen_card_picture.src = card.image_src;
        const chosen_card_health = document.getElementById('chosen_card_health');
        chosen_card_health.dataset.max_hp = card.max_hp;
        chosen_card_health.dataset.current_hp = card.hp;
        hide(play_card);
        show(play_overlay);
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

export function deleteOverlay(field_board) {
    const { element } = field_board;
    delete field_board.card_overlay;
    const overlay_element = element.querySelector('#overlay');
    overlay_element.remove();
    hide(chosen_card);
    closeOverlay();
}
