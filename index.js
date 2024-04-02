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
const wallet = process.env.wallet_name;
const data = {
    name: wallet,
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
    createWallet();
});

function isConfigJsonEmpty(callback) {
    const configFilePath = path.join(__dirname, 'config.json');

    fs.readFile(configFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading config.json:', err);
            callback(false);
            return;
        }
        const isEmpty = data.trim() === '{}' || data.trim() === '';
        callback(isEmpty);
    });
}

function openBrowser(url) {
    const command = process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(command, [url], { stdio: 'inherit', shell: true });
}

async function createWallet() {
    try {
        isConfigJsonEmpty(async (isEmpty) => {
            if (isEmpty) {
                console.log("config.json is empty");
                const walletResponse = await axios.post(`https://api.blockcypher.com/v1/ltc/main/wallets?token=${token}`, JSON.stringify(data));
                const walletData = walletResponse.data;
                console.log("Wallet created successfully:");
                console.log("Name:", walletData.name);
                console.log("Token:", walletData.token);
                console.log("Addresses:", walletData.addresses);
                const addressResponse = await axios.post(`https://api.blockcypher.com/v1/ltc/main/wallets/${walletData.name}/addresses/generate?token=${token}`);
                const addressData = addressResponse.data;
                const configFilePath = path.join(__dirname, 'config.json');
                fs.writeFileSync(configFilePath, JSON.stringify({ wallet: walletData, address: addressData }, null, 2));

            } else {
                console.log("config.json is not empty");
            }
        });
    } catch (error) {
        console.error('Error creating wallet:', error);
    }
}
