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


export function show(element) {
    element.classList.remove('hidden');
}

export function hide(element) {
    element.classList.add('hidden');
}