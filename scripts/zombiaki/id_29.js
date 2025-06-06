//PAPU
import { board, clearBoard } from "../board.js";
import { deck_zombies_element, removeCard } from "../index.js";
import { enable, disable, addListener } from "../utils.js";

export default function zombies_id_29(card, field) {
    disable(deck_zombies_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const { card, element } = board[i][j];
            if (!card) continue;
            if (card.type !== 'zombie') continue;
            if (card.hp < card.max_hp) {
                addListener(element, handlePapu(board[i][j]), { once: true });
                element.classList.add('papu_available');
            }
        }
    }
}

function handlePapu(field) {
    return function () {
        const { card, element } = field;
        const { max_hp, hp } = card;
        card.hp += 2;
        if (card.hp > max_hp) card.hp = max_hp;
        const hp_element = element.querySelector('.field_image > div');
        hp_element.dataset.current_hp = card.hp;
        const masa_element = element.querySelector('.field_image > img[data-name="MASA"]');
        if (masa_element) {
            const masa_text_element = element.querySelector('.hp_masa__text');
            masa_text_element.innerText = card.hp;
        }
        clearBoard();
        enable(deck_zombies_element);
        removeCard();
    }
}