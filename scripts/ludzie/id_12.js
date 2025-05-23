//JAJNIK
import { deck_ludzie_element, removeCard } from "../index.js";
import { disable, enable, show, hide } from "../utils.js";
import { board, setField, unsetField } from "../board.js";
import { zombiak_1 } from "../zombiaki/cards.js";
export default function ludzie_id_12(card, field) {
    jajnik();
}

function jajnik() {
    disable(deck_ludzie_element);
    const tracks = document.querySelectorAll('.tor_jajnik');
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
        const { element, card_board, card, card_pet } = field;
        if (mur) {
            disable(element);
            continue;
        }
        if (card_board?.mur) mur = true;
        if (card?.type === 'zombiak') active_fields.push(field);
    }
    active_fields.forEach(el => el.element.classList.add('jajnik_available'))
    const handler = jajnikTrackHandler(active_fields)
    track.handler = handler;
    track.addEventListener('click', handler, { once: true });
}

function jajnikTrackHandler(fields) {
    return function () {
        clearBoard();

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const { card, card_pet, card_overlay } = field;
            if (card?.type === 'zombiak' || card_pet) {
                let is_bear = card_overlay?.name === 'MIŚ';
                unsetField(field, { bear: is_bear });
                setField(field, zombiak_1, { other: true });
            }
        }
    }
}

function clearBoard() {
    removeCard();
    enable(deck_ludzie_element);
    const tracks = document.querySelectorAll('.tor_jajnik');
    tracks.forEach(el => {
        hide(el);
        const track = el.parentNode;
        track.removeEventListener('click', track.handler);
        track.handler = null;
    })
}