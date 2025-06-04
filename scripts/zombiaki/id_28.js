// MIĘSO
import {
    removeCard,
    deck_ludzie_element,
    deck_zombiaki_element,
    getActiveCardsLudzie,
    setActiveCardsLudzie,
    cancel_button
} from "../index.js";
import { addListener, disable, enable, removeListener } from "../utils.js";

export default function zombiaki_id_28(card, field) {
    const ludzie_cards = getActiveCardsLudzie();
    let ludzie_cards_temp = Array.from(ludzie_cards);
    const ludzie_cards_elements = deck_ludzie_element.querySelectorAll('img.card_ludzie:not(.card_blank)');
    disable(deck_zombiaki_element);
    enable(deck_ludzie_element);
    ludzie_cards_elements.forEach(element => {
        element.classList.add('throw_available');
        addListener(element, removeCardHandler(element, ludzie_cards_temp, ludzie_cards_elements), { once: true });
    })
    addListener(cancel_button, handleCancelCard(ludzie_cards_elements), { once: true });
}


function handleCancelCard(elements) {
    return function () {
        elements.forEach(el => {
            disable(deck_ludzie_element)
            el.classList.remove('throw_available');
            removeListener(el);
        })
    }
}

function removeCardHandler(element, cards_deck, elements) {
    return function () {
        const id = element.getAttribute('data-id');
        element.src = `images/cards/ludzie/rewers.webp`;
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
        enable(deck_zombiaki_element);
        disable(deck_ludzie_element);
    }
}