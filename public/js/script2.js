let port;

async function fetchPort() {
    const response = await fetch('/api-keys/google');
    const data = await response.json();
    return data.Port;
}

// Fetch the port when the page loads
window.addEventListener('load', async () => {
    port = await fetchPort();
});

// const submitForm = (event) => {
//     event.preventDefault();
//     console.log('Form submitted');
//     const formData = new FormData(event.target);
//     fetch(`http://localhost:4001/suggestionOfPlaces`, {
//         method: 'POST', 
//         headers: {'Content-Type': 'application/json'}, 
//         body: 
//         // Need to transform my object into a JSON string here, so the api can recieve it. Then transform back in the backend.
//         JSON.stringify({
//             location: formData.get('YourLocation'),
//         })
//     })
// }

const submitForm = async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const formData = new FormData(event.target);

    if (!port) {
        console.error('Port not fetched yet.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:${port}/suggestionOfPlaces`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
                location: formData.get('YourLocation'),
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

document.querySelector('form').addEventListener('submit', submitForm);
