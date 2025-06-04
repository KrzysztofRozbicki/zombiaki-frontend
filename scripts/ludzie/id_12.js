//JAJNIK
import { deck_ludzie_element, removeCard } from "../index.js";
import { disable, enable, show, hide, addListener, removeListener } from "../utils.js";
import { board, setField, unsetField } from "../board.js";
import { zombiak_1 } from "../zombiaki/cards.js";
import { deleteOverlay } from "../zombiaki/utils.js";
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
    addListener(track, jajnikTrackHandler(active_fields), { once: true });
}

function jajnikTrackHandler(fields) {
    return function () {
        clearBoard();

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const { card, card_pet, overlay_cards } = field;
            if (card?.type === 'zombiak' || card_pet) {
                let is_bear = null;
                let human_card = null;
                if (overlay_cards && overlay_cards?.length > 0) {
                    is_bear = !!overlay_cards.find(card => card.name === 'MIŚ');
                    human_card = overlay_cards.find(card => card.name === 'CZŁOWIEK');
                }
                if (human_card) {
                    deleteOverlay(field, human_card.id);
                    return;
                }
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
        removeListener(track);
    })
}