//RACA ŚWIETLNA

import { getDeckzombies, setDeckzombies, removeCard } from '../index.js';
import { addListener, hideCancelButton } from '../utils.js';
import { board, setField } from '../board.js';
import { zombie_1 } from '../zombies/cards.js';
export default function humans_id_7(card, field) {
    raca();
}

let deck_zombies = [];
let temp_deck_zombies = [];

function raca() {
    deck_zombies = Array.from(getDeckzombies());
    temp_deck_zombies = Array.from(getDeckzombies());
    setTimeout(() => hideCancelButton(), 10);
    removeCard();
    addDialog();
    buttonClicks()
}


function addDialog() {
    const div_element = document.createElement('div');
    const child_element = document.createElement('div');

    for (let i = 0; i < 3; i++) {
        const { name, id } = deck_zombies[i];
        const image_box = document.createElement('div');
        const image = document.createElement('img');
        image.src = `../../images/cards/zombies/${id}.webp`;
        image_box.appendChild(image);
        image_box.classList.add('raca_image');
        image_box.dataset.id = id;
        const button_box = document.createElement('div');
        button_box.classList.add('button_box');
        if (name !== 'ŚWIT') {
            const delete_button = document.createElement('button');
            delete_button.classList.add('delete_button');
            delete_button.innerText = 'USUŃ';
            delete_button.dataset.id = id;
            button_box.appendChild(delete_button);
        }
        const put_button = document.createElement('button');
        put_button.classList.add('put_button');
        put_button.innerText = 'POŁÓŻ';
        put_button.dataset.id = id;
        button_box.appendChild(put_button);
        image_box.appendChild(button_box);
        child_element.appendChild(image_box);
    }
    temp_deck_zombies.splice(0, 3);
    div_element.appendChild(child_element);
    div_element.setAttribute('id', 'raca');
    document.body.appendChild(div_element);
}

function buttonClicks() {
    const delete_buttons = document.querySelectorAll("#raca .delete_button");
    const put_buttons = document.querySelectorAll('#raca .put_button');
    if (delete_buttons && delete_buttons.length > 0) {
        delete_buttons.forEach((button) => {
            addListener(button, deleteButtonHandler(button), { once: true });
        })
    }
    put_buttons.forEach((button) => {
        addListener(button, putButtonHandler(button), { once: true });
    })
}


function deleteButtonHandler(button) {
    return function () {
        const id = button.dataset.id;
        const delete_buttons = document.querySelectorAll("#raca .delete_button");
        delete_buttons.forEach(button => button.remove());
        const card_box = document.querySelector(`.raca_image[data-id="${id}"`);
        card_box.remove();
    }
}

function putButtonHandler(button) {
    return function () {
        const id = button.dataset.id;
        const card_box = document.querySelector(`.raca_image[data-id="${id}"`);
        const card_to_put = deck_zombies.find(card => card.id === +id);
        temp_deck_zombies.unshift(card_to_put);
        const card_boxes = document.querySelectorAll('.raca_image');

        if (card_boxes.length === 1) endRaca();
        card_box.remove();
    }
}

function endRaca() {
    setDeckzombies(temp_deck_zombies);
    const raca_element = document.getElementById('raca');
    raca_element.remove();
    for (let i = 0; i < board[0].length; i++) {
        const { field, card } = board[0][i];
        if (card) continue;
        setField(board[0][i], zombie_1, { other: true });
    }
}