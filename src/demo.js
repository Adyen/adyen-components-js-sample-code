const stateContainer = document.querySelector('.current-state');
const requestContainer = document.querySelector('.request-container');
const responseContainer = document.querySelector('.response-container');

// Demo - Update current component state container
function updateStateContainer(newState) {
    stateContainer.innerText = JSON.stringify(newState, null, 2);
}

// Demo - Update request container
function updateRequestContainer(response) {
    const defaultResponseParams = { merchantAccount: 'YOUR_MERCHANT_ACCOUNT' };
    requestContainer.querySelector('pre').innerText = JSON.stringify(
        { ...defaultResponseParams, ...response },
        null,
        2
    );
    requestContainer.classList.add('request-container--visible');
}

// Demo - Update server response container
function updateResponseContainer(response) {
    responseContainer.querySelector('pre').innerText = JSON.stringify(response, null, 2);
    responseContainer.classList.add('response-container--visible');
}

// Demo - Copy Source Code Examples
document.querySelectorAll('.copy-sample-code').forEach(c => {
    c.addEventListener('click', () => {
        const code = document.querySelector('.source-code');
        const range = document.createRange();
        range.selectNode(code);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        c.classList.add('copy-sample-code--active');

        setTimeout(() => {
            c.classList.remove('copy-sample-code--active');
        }, 1000);
    });
});
