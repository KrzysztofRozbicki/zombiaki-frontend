//RACA ŚWIETLNA

import { getDeckZombiaki, setDeckZombiaki, removeCard } from '../index.js';
import { hideCancelButton } from '../utils.js';
import { board, setField } from '../board.js';
import { zombiak_1 } from '../zombiaki/cards.js';
export default function ludzie_id_7(card, field) {
    raca();
}

let deck_zombiaki = [];
let temp_deck_zombiaki = [];

function raca() {
    deck_zombiaki = Array.from(getDeckZombiaki());
    temp_deck_zombiaki = Array.from(getDeckZombiaki());
    setTimeout(() => hideCancelButton(), 10);
    removeCard();
    addDialog();
    buttonClicks()
}


function addDialog() {
    const main = document.body.querySelector('main');
    const div_element = document.createElement('div');
    const child_element = document.createElement('div');

    for (let i = 0; i < 3; i++) {
        const { id } = deck_zombiaki[i];
        const image_box = document.createElement('div');
        const image = document.createElement('img');
        image.src = `../../images/cards/zombiaki/${id}.webp`;
        image_box.appendChild(image);
        image_box.classList.add('raca_image');
        image_box.dataset.id = id;
        const button_box = document.createElement('div');
        button_box.classList.add('button_box');
        const delete_button = document.createElement('button');
        delete_button.classList.add('delete_button');
        delete_button.innerText = 'USUŃ';
        delete_button.dataset.id = id;
        const put_button = document.createElement('button');
        put_button.classList.add('put_button');
        put_button.innerText = 'POŁÓŻ';
        put_button.dataset.id = id;
        button_box.appendChild(delete_button);
        button_box.appendChild(put_button);
        image_box.appendChild(button_box);
        child_element.appendChild(image_box);
    }
    temp_deck_zombiaki.splice(0, 3);
    div_element.appendChild(child_element);
    div_element.setAttribute('id', 'raca');
    main.appendChild(div_element);
}

function buttonClicks() {
    const delete_buttons = document.querySelectorAll("#raca .delete_button");
    const put_buttons = document.querySelectorAll('#raca .put_button');
    delete_buttons.forEach((button) => {
        const handler = deleteButtonHandler(button);
        button.handler = handler;
        button.addEventListener('click', handler, { once: true });
    })
    put_buttons.forEach((button) => {
        const handler = putButtonHandler(button);
        button.handler = handler;
        button.addEventListener('click', handler, { once: true });
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
        const card_to_put = deck_zombiaki.find(card => card.id === +id);
        temp_deck_zombiaki.unshift(card_to_put);
        const card_boxes = document.querySelectorAll('.raca_image');

        if (card_boxes.length === 1) endRaca();
        card_box.remove();
    }
}

function endRaca() {
    setDeckZombiaki(temp_deck_zombiaki);
    const raca_element = document.getElementById('raca');
    raca_element.remove();
    for (let i = 0; i < board[0].length; i++) {
        const { field, card } = board[0][i];
        if (card) continue;
        setField(board[0][i], zombiak_1, { other: true });
    }
}