const getTickers = async () => {
    try {
        return (await fetch('https://api.tiingo.com/iex/?token=f6fa8e981fe1642c429672a85ea5244489401ebc')).json(); 
    } catch(error) {
        console.log(error);
    }
    // console.log("Success!"); 
}

// const getData = async(ticker) => {
//     try {
//         return (await fetch('https://api.tiingo.com/tiingo/daily/'+ticker+'/prices?token=f6fa8e981fe1642c429672a85ea5244489401ebc')).json(); 
//     } catch(error) {
//         console.log(error);
//     }
// }

const showOptions = async () => {
    let options = await getTickers(); 
    // console.log(...options); 
    let optSection = document.getElementById("data"); 

    options.forEach((option) => {
        if(option.ticker.length == 3 || option.ticker.length == 4) {
            optSection.append(getOptionItem(option));
            // let data = await getData(option.ticker);
            // optSection.append(getOptionData(data));
        }
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

    const askPrice = document.createElement("p"); 
    askPrice.innerHTML = "Open: "+option.open; 
    p.append(askPrice); 


    return optSection; 
};



window.onload = () => {
    showOptions();
    // showData('aapl'); 
}


/**
 * general notes: 
 *  can only run 50 reqs per hour and 1000 per day 
 *  means I can't loop through every index. need to figure out how to access the data on limited usage 
 * 
 * going about this:
 * - pull all the tickers with one request. compile this on my website and don't request it again 
 * - 
 */