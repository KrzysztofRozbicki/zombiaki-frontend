//REFLEKTOR
import { deck_ludzie_element, removeCard } from "../index.js";
import { disable, enable, show, hide } from "../utils.js";
import { board, moveSingleZombiak } from "../board.js";

export default function ludzie_id_20(card, field) {
    reflektor();
}

function reflektor() {
    disable(deck_ludzie_element);
    const tracks = document.querySelectorAll('.tor_reflektor');
    tracks.forEach(el => {
        show(el);
        const track = el.parentNode;
        prepareTrack(track);

    })
}

function prepareTrack(track) {
    const id = track.getAttribute('id');
    const track_index = +id.slice(-1) - 1;
    let mur = false;
    let active_fields = [];
    for (let i = board.length - 1; i >= 0; i--) {
        const field = board[i][track_index];
        const { element, card_board, card } = field;
        if (mur) {
            disable(element);
            continue;
        }
        if (card_board?.mur) mur = true;
        if (!card) continue;
        if (card && card?.type === 'zombiak') active_fields.push(field);
    }
    active_fields.forEach(el => el.element.classList.add('reflektor_available'))
    const handler = reflektorHandler(active_fields);
    track.addEventListener('click', handler);
    track.handler = handler;
}

function reflektorHandler(track) {
    return function () {
        for (let i = track.length - 1; i >= 0; i--) {
            moveSingleZombiak(track[i], track[i].card, 'back');
            clearBoard();
            removeCard();
        }
    }
}

function clearBoard() {
    removeCard();
    enable(deck_ludzie_element);
    const tracks = document.querySelectorAll('.tor_reflektor');
    tracks.forEach(el => {
        hide(el);
        const track = el.parentNode;
        track.removeEventListener('click', track.handler);
        track.handler = null;
    })
}