//REFLEKTOR
import { deck_humans_element, removeCard } from "../index.js";
import { disable, enable, show, hide, addListener, removeListener } from "../utils.js";
import { board, moveSingleZombie } from "../board.js";

export default function humans_id_20(card, field) {
    reflektor();
}

function reflektor() {
    disable(deck_humans_element);
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
        if (card && card?.type === 'zombie') active_fields.push(field);
    }
    active_fields.forEach(el => el.element.classList.add('reflektor_available'))
    addListener(track, reflektorHandler(active_fields));
}

function reflektorHandler(track) {
    return function () {
        for (let i = track.length - 1; i >= 0; i--) {
            moveSingleZombie(track[i], track[i].card, 'back');
            clearBoard();
            removeCard();
        }
    }
}

function clearBoard() {
    removeCard();
    enable(deck_humans_element);
    const tracks = document.querySelectorAll('.tor_reflektor');
    tracks.forEach(el => {
        hide(el);
        const track = el.parentNode;
        removeListener(track);
    })
}