// key: MLOB917LHX4309HN
// TGT = 12007 

const getTickers = async () => {
    try {
        return (await fetch('https://api.tiingo.com/iex/?token=f6fa8e981fe1642c429672a85ea5244489401ebc')).json(); 
    } catch(error) {
        console.log(error);
    }
    // console.log("Success!"); 
}
let tickers = []; 
let prices = [];
const showOptions = async () => {
    let options = await getTickers(); 
    // console.log(...options); 
    let optSection = document.getElementById("data"); 

    options.forEach((option) => {
        if(option.ticker.length == 3 || option.ticker.length == 4) {
            // optSection.append(getOptionItem(option));
            tickers.push(option.ticker); 
            prices.push(option.open);
            // let data = await getData(option.ticker);
            // optSection.append(getOptionData(data));
        }
    });
    showBalSheet(); 

};

// console.log(tickers); 
// console.log(prices);

//all prices and tickers are stored.

//parsing the balance sheet. 

const getBalSheet = async (ticker) => { 
    try{
        return (await fetch('https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol='+ticker+'&apikey=MLOB917LHX4309HN')).json();
    } catch(error) {
        console.log(error); 
    }
};

const getIncomeStatement = async (ticker) => {
    try{
        return (await fetch("https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol="+ticker+"&apikey=MLOB917LHX4309HN")).json(); 
    } catch(error) {
        console.log(error); 
    }
};


const showBalSheet = async () => {
    let sheet = await getBalSheet("TGT"); 
    console.log(sheet); 
    // let incomestatement = await getIncomeStatement(tickers[12007]); 
    // console.log("made it here!"); 
    
    // let balSheetSection = document.getElementById("data"); 
    // console.log(sheet.quarterlyReports[0]); 
    const currentBalQuarter = sheet.quarterlyReports[0]; 
    // let currentIncQuarter = incomestatement.quarterlyReports[1]; 
    // console.log(currentQuarter.inventory);

    populateBalSheetByQ(currentBalQuarter, 150.15); 
}

const populateBalSheetByQ = (currentBalQuarter, price) => {
    let sharesOutstanding = currentBalQuarter.commonStockSharesOutstanding; 
    let debt = currentBalQuarter.totalLiabilities; 
    let cash = currentBalQuarter.cashAndCashEquivalentsAtCarryingValue; 
    // let ltinterest = currentBalQuarter.totalLiabilities; 
    // if(!Number.isFinite(ltinterest)) {
    //     ltinterest = 0; 
    // }

    let markCap = price * sharesOutstanding; //46 mil for target. 
    let enterpriseVal = Number(markCap) + Number(debt) - Number(cash);
    console.log("Enterprise value:", enterpriseVal);

    // let outstandingDebt = debt + ltinterest; 
    let ev = enterpriseVal - debt; 
    let evPerShare = ev/sharesOutstanding; 
    const overUnder = (price-evPerShare)/evPerShare; 

    console.log("price: "+price); //good 
    console.log("shares outstanding: "+sharesOutstanding); //good
    console.log("debt: "+debt); //good
    console.log("cash: "+cash); //good
    // console.log("long-term interest: "+ltinterest); //good 
    console.log("market cap: "+markCap); 
    console.log("enterprise value: "+enterpriseVal); 
    // console.log("outstanding debt: "+outstandingDebt); 
    console.log("EV: "+ev); 
    console.log("EV per share: "+evPerShare); 
    console.log("over/under: "+overUnder); 
    // const 
}

// // static data: pulling works! 
// let tgtprice = 148.415; 
// let tgtsharesoutstanding = 461651176; 
// let tgtdebt = 1112000000; 
// let tgtcash = 1910000000; 
// let tgtlti = 0; 

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

//tickers have been acquired


// 'use strict';
// var request = require('request');

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
// var url = 'https://www.alphavantage.co/query?function=EARNINGS&symbol=AAPL&apikey=MLOB917LHX4309HN';

// request.get({
//     url: url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err, res, data) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
//       // data is successfully parsed as a JSON object:
//       console.log(data);
//     }
// });

window.onload = () => {
    showOptions(); 
}