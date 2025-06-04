//ZMIATAJ
import { addListener, disable, enable, removeListener } from "../utils.js";
import {
    deck_ludzie_element,
    deck_zombiaki_element,
    removeCard,
} from "../index.js";
export default function ludzie_id_19(card, field) {
    zmiataj();
}

let deck_zombiaki = [];

let new_zombiaki_cards = [];
function zmiataj() {
    disable(deck_ludzie_element);
    enable(deck_zombiaki_element);
    const zombiaki_cards = deck_zombiaki_element.querySelectorAll('.card_zombiaki');


    for (let i = 0; i < zombiaki_cards.length; i++) {
        if (zombiaki_cards[i].classList.contains('card_blank')) {
            continue;
        }
        new_zombiaki_cards.push(zombiaki_cards[i]);
    }

    for (let i = 0; i < new_zombiaki_cards.length; i++) {
        const card = new_zombiaki_cards[i];
        card.classList.add('remove_card');
        addListener(card, removeCardHandler(card));
    }
}


function removeCardHandler(card) {
    return function () {
        removeCard();
        enable(deck_ludzie_element);
        disable(deck_zombiaki_element);
        for (let i = 0; i < new_zombiaki_cards.length; i++) {
            const card = new_zombiaki_cards[i];
            card.classList.remove('remove_card');
            removeListener(card);
        }
        const id = +card.dataset.id;
        card.src = `images/cards/zombiaki/rewers.webp`;
        card.classList.add('card_blank');
        card.dataset.id = 'blank';
        card.dataset.name = 'blank';
    }
}