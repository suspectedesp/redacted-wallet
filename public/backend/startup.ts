declare const axios: any;

console.log("File ready");

async function fetchConversionRates() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin&vs_currencies=eur');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch conversion rates');
  }
}

axios.get('https://api.blockcypher.com/v1/btc/main/addrs/1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD/balance')
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

    console.log("Final Balance (in satoshis):", satoshis);
    console.log("Final Balance (in euros):", euros);
    console.log("Final Balance (in litecoins):", litecoins);
  })
  .catch(function(error) {
    console.error('Error fetching data:', error);
  });
