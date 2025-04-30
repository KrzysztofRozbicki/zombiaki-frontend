
import { chosen_card, chosen_card_picture, close_card, play_card, throw_card } from "../index.js";
import { show, hide } from '../utils.js';
import { board } from "../board.js";
const play_overlay = document.getElementById('play_overlay');

export function removeHealth(field_board, overlay = false) {
    const { element } = field_board;
    let new_hp = overlay ? --field_board.card_overlay.hp : --field_board.card.hp;
    let hp_element = element.querySelector('div');
    const card = overlay ? field_board.card_overlay : field_board.card;
    if (overlay) hp_element = element.querySelector('div[data-overlay="true"]');
    hp_element.dataset.current_hp = new_hp;
    if (new_hp === 0) deleteCard(overlay);
}

export function putOverlay(card, callback) {
    const zombiaki_deck = document.getElementById('deck_zombiaki');
    zombiaki_deck.classList.add('disable');
    let no_zombiak = true;
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const { element } = board[i][j];
            const temp_card = board[i][j].card;
            if (!temp_card) continue;
            const { type, name } = temp_card;

            if (type !== 'zombiak' && (name === 'KOT' || name === 'PIES')) continue;
            no_zombiak = false;
            console.log(no_zombiak);
            element.classList.add('zombiak');
            element.addEventListener('click', () => {
                addOverlay(card, board[i][j], callback);
            }, { once: true });
        }
    }
    if (no_zombiak) {
        console.log('NIE MA ŻADNEGO ZOMBIAKA');
    }
}

export function addOverlay(card, field_board, callback) {
    const zombiaki_deck = document.getElementById('deck_zombiaki');
    zombiaki_deck.classList.remove('disable');
    const { element } = field_board;
    field_board.card_overlay = card;
    const { id, race } = card;
    element.classList.remove('zombiak');
    const degrees = Math.floor(Math.random() * (10 - -10) + -10);
    element.innerHTML += `<img src='images/cards/${race}/${id}.webp' id="overlay" alt='card' class="overlay" style="transform: rotate(${degrees}deg)"/>`;
    element.innerHTML += `<div data-max_hp="${card.max_hp}" data-current_hp="${card.hp}" style="transform: rotate(${degrees}deg)" data-overlay="true"/>`;
    element.dataset.overlay = 'UŻYJ MISIA';

    const overlay = document.getElementById('overlay');
    const handler = showOverlay(field_board, field_board.card_overlay, callback);
    overlay.handler = handler;
    overlay.addEventListener('click', handler);
}
function showOverlay(field_board, card, callback) {
    return function () {
        console.log('show overlay');
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
    console.log('close Overlay')
    show(play_card);
    hide(play_overlay);
    hide(chosen_card);
    play_overlay.removeEventListener('click', play_overlay.handler)
    play_overlay.handler = null;
    chosen_card.dataset.max_hp = null;
    chosen_card.dataset.current_hp = null;
}

function deleteCard(overlay) {
    if (overlay) {
        const overlay = document.getElementById('overlay');
        overlay.remove();
        hide(chosen_card);
    }
}
