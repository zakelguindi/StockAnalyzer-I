// var request = require('request');
// var requestOptions = {
//     'url': 'https://api.tiingo.com/iex/?tickers=aapl,spy&token=f6fa8e981fe1642c429672a85ea5244489401ebc',
//     'headers': {
//         'Content-Type': 'application/json'
//         }
// };

// request(requestOptions,
//     function(error, response, body) {
//         console.log(body);
//     }
// );     

// entire database: https://api.tiingo.com/iex/?token=f6fa8e981fe1642c429672a85ea5244489401ebc

const getOptions = async () => {
    try {
        return (await fetch('https://api.tiingo.com/iex/?tickers=aapl,spy&token=f6fa8e981fe1642c429672a85ea5244489401ebc')).json(); 
    } catch(error) {
        console.log(error)
    }
    // console.log("Success!"); 
}

const showOptions = async () => {
    let options = await getOptions(); 
    console.log(...options); 
    let optSection = document.getElementById("data"); 

    options.forEach((option) => {
        optSection.append(getOptionItem(option))
    })
};

const getOptionItem = (option) => {
    const optSection = document.createElement("section"); 
    optSection.classList.add("item");

    const p = document.createElement("p"); 
    optSection.append(p); 

    const ticker = document.createElement("h4"); 
    ticker.innerText = option.ticker; 
    p.append(ticker); 

    return optSection; 
};


window.onload = () => showOptions();