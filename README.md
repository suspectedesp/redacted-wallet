# Redacted Wallet
Open-Source selfmade crypto wallet

## Description
[redacted] Wallet is a simple web application for managing your cryptocurrency wallet. It allows you to check your wallet's balance in euros and litecoins.

## Features
- Check wallet balance in euros and litecoins
- Manage a wallet via a locally hosted website on your device

## Installation
1. Clone the repository: `git clone https://github.com/suspectedesp/redacted-wallet.git`
2. Navigate to the project directory: `cd redacted-wallet`
3. Install dependencies: `npm install`

## Usage
1. Set all variables in `.env.example`
2. Rename `.env.example` to `.env`
3. Start the server: `node server.js` or via `start.bat`
4. Now restart the server to effectively apply the changes for config.json
5. You can now check your wallet balance and conversion rates.

## Configuration
1. Make an account at [Blockcypher](https://blockcypher.com/)
2. Get the API Access token and place it into the `.env.example` (token value)
3. Give your wallet a name inside of `.env.example`
4. Set a random value as ltc address inside of `.env.example` (It really doesn't matter)
5. Rename the `.env.example` to purely `.env`
6. Now you can follow the usage guide

## Used Dependencies
- axios: ^1.6.8,
- express: ^4.19.2,
- open: ^10.1.0
- typescript: ^5.4.3