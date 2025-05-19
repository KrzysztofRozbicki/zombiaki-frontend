// MIĘSO
import {
    removeCard,
    deck_ludzie_element,
    deck_zombiaki_element,
    getActiveCardsLudzie,
    setActiveCardsLudzie
} from "../index.js";
import { disable, enable } from "../utils.js";

const cancel_button = document.getElementById('cancel');

export default function zombiaki_id_28(card, field) {
    const ludzie_cards = getActiveCardsLudzie();
    let ludzie_cards_temp = Array.from(ludzie_cards);
    const ludzie_cards_elements = deck_ludzie_element.querySelectorAll('img.card_ludzie:not(.card_blank)');
    disable(deck_zombiaki_element);
    enable(deck_ludzie_element);
    console.log(ludzie_cards_temp);
    ludzie_cards_elements.forEach(element => {
        element.classList.add('throw_available');
        const handler = removeCardHandler(element, ludzie_cards_temp, ludzie_cards_elements);
        element.addEventListener('click', handler, { once: true });
        element.handler = handler;
    })

    const handler = handleCancelCard(ludzie_cards_elements);
    cancel_button.cancelHandler = handler;
    cancel_button.addEventListener('click', handler, { once: true });
}


function handleCancelCard(elements) {
    return function () {
        elements.forEach(el => {
            disable(deck_ludzie_element)
            el.classList.remove('throw_available');
            el.removeEventListener('click', el.handler);
            el.handler = null;
        })
    }
}

function removeCardHandler(element, cards_deck, elements) {
    return function () {
        const id = element.getAttribute('data-id');
        console.log(id);
        element.src = `images/cards/ludzie/rewers.webp`;
        element.classList.add('card_blank');
        element.dataset.id = 'blank';
        element.dataset.name = 'blank';
        elements.forEach(el => {
            el.classList.remove('throw_available');
            el.removeEventListener('click', el.handler);
            el.handler = null;
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