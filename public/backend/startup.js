const port = 1337;
var endpointUrl = `http://localhost:${port}/api/walletBalance`;
function triggerNodeFunction() {
    fetch(endpointUrl)
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Failed to trigger Node.js function');
        }
        return response.text();
    })
        .then(function (data) {
        console.log(data);
    })
        .catch(function (error) {
        console.error('Error:', error);
    });
}
triggerNodeFunction();
