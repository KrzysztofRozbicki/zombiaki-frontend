//MIŚ
import { chosen_card, chosen_card_picture, close_card, play_card, throw_card } from "../index.js";
import { board } from "../board.js";
import { show, hide } from "../utils.js";

const play_bear = document.getElementById('play_bear');

export default function zombiaki_id_1(card, field) {
    console.log('Zagrywam Misia');
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const { element } = board[i][j];
            const temp_card = board[i][j].card;
            if (!temp_card) continue;
            const { type, name } = temp_card;
            if (type !== 'zombiak' && (name === 'KOT' || name === 'PIES')) continue;
            element.classList.add('zombiak');

            element.addEventListener('click', () => {
                addBear(card, board[i][j]);
            }, { once: true });
        }
    }
}


export function addBear(card, field_board) {
    const { element } = field_board;
    field_board.card_overlay = card;
    const { id, race } = card;
    element.classList.remove('zombiak');
    element.innerHTML += `<img src='images/cards/${race}/${id}.webp' id="bear" alt='card' class="overlay"/>`;
    element.dataset.overlay = 'MIŚ';

    const bear = document.getElementById('bear');
    const handler = playBear(field_board, field_board.card_overlay);
    bear.handler = handler;
    bear.addEventListener('click', handler)
}

function playBear(field_board, card) {
    return function () {
        console.log(card);
        show(chosen_card);
        chosen_card.classList.remove('hidden');
        chosen_card_picture.src = card.image_src;
        hide(play_card);
        show(play_bear);
        hide(throw_card);
        close_card.addEventListener('click', () => {
            show(play_card);
            hide(play_bear);
        }, { once: true });
        play_bear.addEventListener('click', () => {
            removeHealth(field_board);
        });
    }
}

function deleteBear() {
    const bear = document.getElementById('bear');
    bear.remove();
    hide(chosen_card);
}