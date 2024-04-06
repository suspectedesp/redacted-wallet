const port = 1337;
const walletBalance = `http://localhost:${port}/api/walletBalance`;

function triggerNodeFunction() {
    fetch(walletBalance)
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