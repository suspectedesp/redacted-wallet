var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function displayBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const displayBalance_ = 'http://localhost:1337/api/walletBalance';
            const response = yield fetch(displayBalance_);
            if (!response.ok) {
                throw new Error('Failed to fetch balance');
            }
            const balanceData = yield response.json();
            const balanceContainer = document.getElementById('balance-info');
            if (balanceContainer) {
                const litecoinAmount = balanceData['Amount in Litecoin:'];
                const euroAmount = balanceData['Amount in Euros:'];
                balanceContainer.innerHTML = `Litecoin in Wallet: ${litecoinAmount}Ł | ${euroAmount}€`;
            }
        }
        catch (error) {
            console.error('Error fetching balance:', error);
        }
    });
}
window.addEventListener('load', displayBalance);
