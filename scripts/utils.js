export function showAlert(text) {
    const alert = document.getElementById('alert');
    const close_alert = document.getElementById('close_alert');
    const alert_text = document.getElementById('alert_text');

    alert_text.innerText = text;
    alert.classList.remove('hidden');

    close_alert.addEventListener('click', () => {
        alert.classList.add('hidden');
    })
};

export function cardEvent() {
    const chosen_card_picture = document.getElementById('chosen_card_picture');
    chosen_card_picture.src = card.src;
    active_card = playable_cards.find(el => el.id === +card.getAttribute('data-id'));
    if (!active_card) {
        return;
    }
    chosen_card.classList.remove('hidden');
}