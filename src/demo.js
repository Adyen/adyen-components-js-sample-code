const stateContainer = document.querySelector('.current-state');
const responseContainer = document.querySelector('.response-container');

// Demo - Update current component state container
function updateStateContainer(newState) {
    stateContainer.innerText = JSON.stringify(newState, null, 2);
}

// Demo - Update current component state container
function updateResponseContainer(response) {
    responseContainer.querySelector('pre').innerText = JSON.stringify(response, null, 2);
    responseContainer.classList.add('response-container--visible');
}

// Demo - Copy Source Code Examples
document.querySelectorAll('.source-code').forEach(c => {
    c.addEventListener('click', () => {
        const range = document.createRange();
        range.selectNode(c);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        c.classList.add('source-code--copied');

        setTimeout(() => {
            c.classList.remove('source-code--copied');
        }, 1000);
    });
});
