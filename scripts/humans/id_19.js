//ZMIATAJ
import { addListener, disable, enable, removeListener } from "../utils.js";
import {
    deck_humans_element,
    deck_zombies_element,
    removeCard,
} from "../index.js";
export default function humans_id_19(card, field) {
    zmiataj();
}

let deck_zombies = [];

let new_zombies_cards = [];
function zmiataj() {
    disable(deck_humans_element);
    enable(deck_zombies_element);
    const zombies_cards = deck_zombies_element.querySelectorAll('.card_zombies');


    for (let i = 0; i < zombies_cards.length; i++) {
        if (zombies_cards[i].classList.contains('card_blank')) {
            continue;
        }
        new_zombies_cards.push(zombies_cards[i]);
    }

    for (let i = 0; i < new_zombies_cards.length; i++) {
        const card = new_zombies_cards[i];
        card.classList.add('remove_card');
        addListener(card, removeCardHandler(card));
    }
}


function removeCardHandler(card) {
    return function () {
        removeCard();
        enable(deck_humans_element);
        disable(deck_zombies_element);
        for (let i = 0; i < new_zombies_cards.length; i++) {
            const card = new_zombies_cards[i];
            card.classList.remove('remove_card');
            removeListener(card);
        }
        const id = +card.dataset.id;
        card.src = `images/cards/zombies/rewers.webp`;
        card.classList.add('card_blank');
        card.dataset.id = 'blank';
        card.dataset.name = 'blank';
    }
}