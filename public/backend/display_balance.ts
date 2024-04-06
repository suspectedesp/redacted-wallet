async function displayBalance() {
    try {
        const displayBalance_ = 'http://localhost:1337/api/walletBalance';
        const response = await fetch(displayBalance_);
        if (!response.ok) {
            throw new Error('Failed to fetch balance');
        }
        const balanceData = await response.json();

        const balanceContainer = document.getElementById('balance-info');
        if (balanceContainer) {
            const litecoinAmount = balanceData['Amount in Litecoin:'];
            const euroAmount = balanceData['Amount in Euros:']
            balanceContainer.innerHTML = `Litecoin in Wallet: ${litecoinAmount}Ł | ${euroAmount}€`;
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

window.addEventListener('load', displayBalance);