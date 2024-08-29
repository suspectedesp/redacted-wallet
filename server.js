const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
require('dotenv').config();
const axios = require('axios');
const app = express();
const port = 1337;
const { exec } = require('child_process');
const os = require('os');


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

app.get('/api/walletBalance', (req, res) => {
    async function fetchConversionRates() {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin&vs_currencies=eur');
            return response.data;
          } catch (error) {
            if (error.response) {
              const statusCode = error.response.status;
        
              if (statusCode === 429) {
                console.error('Failed to fetch conversion rates. Too Many Requests: Rate limit exceeded.');
              } else {
                console.error(`HTTP Error: ${statusCode}`);
              }
              
              throw new Error(`Failed to fetch conversion rates. Status code: ${statusCode}`);
            } else {
              console.error('Error:', error.message);
              throw new Error(`Failed to fetch conversion rates due to ${error.message}.`);
            }
          }
        }
      
      const configFilePath = path.join(__dirname, './config.json');
      try {
        const configData = fs.readFileSync(configFilePath, 'utf8');
        const config = JSON.parse(configData);
      
        // Access the value of the 'address' property
        const address = config.address;
        axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${address}/balance`)
        .then(async function(response) {
          const satoshis = response.data.final_balance;
          const bitcoins = satoshis / 100000000;
      
          // Fetch conversion rates
          const conversionRates = await fetchConversionRates();
      
          // Get conversion rates for bitcoin to euro and litecoin
          const btcToEurRate = conversionRates.bitcoin.eur;
          const btcToLtcRate = conversionRates.litecoin.eur; // Changed to litecoin.eur
      
          const euros = bitcoins * btcToEurRate;
          const litecoins = bitcoins * btcToLtcRate;
      
          /* console.log("Final Balance (in satoshis):", satoshis);
          console.log("Final Balance (in euros):", euros);
          console.log("Final Balance (in litecoins):", litecoins); */
          const responseData = {
            "Amount in Satoshis:": satoshis,
            "Amount in Bitcoins: ": bitcoins,
            "Amount in Litecoin:": litecoins,
            "Amount in Euros:": euros
          };
          res.json(responseData);
        })
        .catch(function(error) {
          console.error('Error fetching data:', error);
        });
      
      } catch (error) {
        console.error('Error reading config.json:', error);
      }
});

app.listen(port, () => { // server start
    console.log(`[INFO] | [redacted] Wallet server has been successfully launched at http://localhost:${port}`);
    openBrowser(`http://localhost:${port}`);
    createWallet();
});

function isConfigJsonEmpty() {
    return new Promise((resolve, reject) => {
        const configFilePath = path.join(__dirname, 'config.json');
        fs.readFile(configFilePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') { // File not found
                    resolve(true);
                } else {
                    console.error('Error reading config.json:', err);
                    reject(err);
                }
            } else {
                const isEmpty = data.trim() === '{}' || data.trim() === '';
                resolve(isEmpty);
            }
        });
    });
}

function writeConfigJson(configData) {
    return new Promise((resolve, reject) => {
        const configFilePath = path.join(__dirname, 'config.json');
        fs.writeFile(configFilePath, configData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing config.json:', err);
                reject(err);
            } else {
                console.log('config.json has been successfully created.');
                resolve();
            }
        });
    });
}

function openBrowser(url) {
    const command = process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(command, [url], { stdio: 'inherit', shell: true });
}

async function createWallet() {
    try {
        const isEmpty = await isConfigJsonEmpty();
        if (isEmpty) {
            console.log("No wallet has been set");
            const walletResponse = await axios.post(`https://api.blockcypher.com/v1/ltc/main/wallets?token=${token}`, JSON.stringify(data));
            const walletData = walletResponse.data;
            console.log("Wallet created successfully:");
            console.log("Name:", walletData.name);
            console.log("Token:", walletData.token);
            const addressResponse = await axios.post(`https://api.blockcypher.com/v1/ltc/main/wallets/${walletData.name}/addresses/generate?token=${token}`);
            const addressData = addressResponse.data;

            //if it doesn't work: console.log("Addresses:", walletData.addresses);
            console.log("Addresses:", addressData.addresses);

            // Constructing the desired structure
            const configData = {
                token: token,
                name: walletData.name,
                addresses: addressData.addresses,
                private: addressData.private,
                public: addressData.public,
                address: addressData.address,
                wif: addressData.wif
            };

            await writeConfigJson(JSON.stringify(configData, null, 2));
        } else {
            console.log("Already existing wallet has been found");
        }
    } catch (error) {
        console.error('Error creating wallet:', error);
    }
}
