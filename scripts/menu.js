const reset_button = document.getElementById('reset');

export function initMenu() {
    reset_button.addEventListener('click', () => {
        window.location.reload();
    })
}