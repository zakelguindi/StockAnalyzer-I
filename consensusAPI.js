const fetch = require('node-fetch');

const url = 'https://drive-verify.p.rapidapi.com/consensus-price?quantity=%3CREQUIRED%3E&asset=%3CREQUIRED%3E';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'ef6ecf5fdfmsh48560db3ea7a840p14fa1bjsn0aca63b16b06',
    'X-RapidAPI-Host': 'drive-verify.p.rapidapi.com'
  }
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}