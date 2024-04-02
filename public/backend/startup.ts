const endpointUrl = 'http://localhost:3000/api/walletBalance';

function triggerNodeFunction() {
    fetch(endpointUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to trigger Node.js function');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

triggerNodeFunction();