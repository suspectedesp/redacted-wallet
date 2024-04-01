const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
require('dotenv').config();
const axios = require('axios');
const app = express();
const port = 1337;

app.use(express.static(path.join(__dirname, 'public')));
const configFilePath = path.join(__dirname, 'config.json');
const token = process.env.token;
const addy = process.env.ltc_address;
const data = {
    name: "redacted",
    address: addy
};

app.get('/', (req, res) => {
    if (fs.existsSync(configFilePath)) {
        res.sendFile(path.join(__dirname, 'public', './index.html'));
    } else {
        createWallet().then(() => {
            res.sendFile(path.join(__dirname, 'public', './index.html'));
        }).catch(err => {
            res.status(500).send('Error creating wallet');
        });
    }
});

const server = app.listen(port, () => {
    console.log(`[redacted] Wallet server has been successfully launched at http://localhost:${port}`);
    openBrowser(`http://localhost:${port}`);
});

function openBrowser(url) {
    const command = process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(command, [url], { stdio: 'inherit', shell: true });
}

async function createWallet() {
    try {
        const data = {
            name: "vrtx"
        };

        await axios.post(`https://api.blockcypher.com/v1/ltc/main/wallets?token=${token}`, data);
        const response = await axios.post(`https://api.blockcypher.com/v1/btc/main/wallets/alice/addresses/generate?token=${token}`)
        const walletData = response.data;
        console.log(walletData);

        // Save data config.json
        const configFilePath = path.join(__dirname, 'config.json');
        fs.writeFileSync(configFilePath, JSON.stringify(walletData, null, 2));

        console.log("Wallet created successfully:");
        console.log("Name:", walletData.name);
        console.log("Token:", walletData.token);
        console.log("Addresses:", walletData.addresses);
    } catch (error) {
        console.error('Error creating wallet:', error);
    }
}
