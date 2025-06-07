// MIĘSO
import {
    removeCard,
    deck_humans_element,
    deck_zombies_element,
    getActiveCardsLudzie,
    setActiveCardsLudzie,
    cancel_button
} from "../index.js";
import { addListener, disable, enable, removeListener } from "../utils.js";

export default function zombies_id_28(card, field) {
    const humans_cards = getActiveCardsLudzie();
    let humans_cards_temp = Array.from(humans_cards);
    const humans_cards_elements = deck_humans_element.querySelectorAll('img.card_humans:not(.card_blank)');
    disable(deck_zombies_element);
    enable(deck_humans_element);
    humans_cards_elements.forEach(element => {
        element.classList.add('throw_available');
        addListener(element, removeCardHandler(element, humans_cards_temp, humans_cards_elements), { once: true });
    })
    addListener(cancel_button, handleCancelCard(humans_cards_elements), { once: true });
}


function handleCancelCard(elements) {
    return function () {
        elements.forEach(el => {
            disable(deck_humans_element)
            el.classList.remove('throw_available');
            removeListener(el);
        })
    }
}

function removeCardHandler(element, cards_deck, elements) {
    return function () {
        const id = element.getAttribute('data-id');
        element.src = `images/cards/humans/rewers.webp`;
        element.classList.add('card_blank');
        element.dataset.id = 'blank';
        element.dataset.name = 'blank';
        elements.forEach(el => {
            el.classList.remove('throw_available');
            removeListener(el);
        })
        cancel_button.cancelHandler = null;
        cancel_button.removeEventListener('click', cancel_button.cancelHandler);
        const index = cards_deck.findIndex(el => el.id === +id)
        cards_deck.splice(index, 1);
        setActiveCardsLudzie(cards_deck);
        removeCard();
        enable(deck_zombies_element);
        disable(deck_humans_element);
    }
}