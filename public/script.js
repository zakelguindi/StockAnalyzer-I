/**
 * script should be able to get companies and list their data. 
 * script should also be able to pull and save 
 * 1) Search Company by Ticker 
 * 2) Load Company Data
 * 3) "Save" Company Data 
 * 4) Display Saved Company Data 
 */

// search company 
const findBalanceSheet = async (ticker) => {
    try{
        return (await fetch('https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol='+ticker+'&apikey=MLOB917LHX4309HN')).json();
    } catch(error) {
        console.log(error); 
    }
};


const getPrices = async(ticker) => {

    try {
        const response = (await fetch(`https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2023-01-09?adjusted=true&apiKey=i0BKt_No1GvmJoEvpEf4MHxUGzSzxBvI`));
        if(!response.ok) {
            throw new Error("Failed to fetch from API"); 
        }
        const jsonData = await response.json(); 
        console.log(jsonData); 
        return findLivePriceByTicker(ticker, jsonData); 
    } catch(error) {
        console.log(error);
    }
};

function findLivePriceByTicker(ticker, jsonData) {
    /**
     * search through Polygon.io. find index where this.ticker = ticker 
     */
     const stock = jsonData.results.find(stock => stock.T === ticker);     
    //  console.log(stock); 
    if(stock) {
        const openPrice = stock.o;
        const avg = stock.vw; 
        // console.log(openPrice); 
        // console.log("Avg:" +avg);  
        return openPrice; 
    } else {
        return null; 
    }
};

async function searchCompany() {
    const ticker = document.getElementById("ticker").value;
    // console.log(ticker); 
    let price = await getPrices(ticker); 
    // console.log(price); 
    let balanceSheet = await findBalanceSheet(ticker); 

    const currQuarter = balanceSheet.quarterlyReports[0]; 
    const sharesOutstanding = currQuarter.commonStockSharesOutstanding; 
    console.log(sharesOutstanding)
    const debt = currQuarter.totalLiabilities; 
    const cash = currQuarter.cashAndCashEquivalentsAtCarryingValue; 

    // displayDetails(ticker, price, currQuarter);
    postToAPI(ticker, price, sharesOutstanding, debt, cash); 
};

async function postToAPI(ticker, price, sharesOutstanding, debt, cash) {
    const apiUrl = 'https://stockanalyzer-ii.onrender.com/api/companies';

    const markCap = price * sharesOutstanding; 
    const enterpriseVal = Number(markCap) + Number(debt) - Number(cash); 
    const EV = enterpriseVal - debt; 
    const evPerShare = EV/sharesOutstanding; 
    const overUnder = (price-evPerShare)/evPerShare; 

    const data = {
        "ticker": ticker, 
        "yearlyData": [{
            "price": price, 
            "overUnder": overUnder, 
            "EVperShare": evPerShare, 
            "EnterpriseVal": enterpriseVal, 
            "MarketCap": markCap, 
            "BalSheet": [{
                "sharesOutstanding": sharesOutstanding, 
                "debt": debt, 
                "cash": cash
            }]
        }]
    }
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to post data to API: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Data posted successfully:', responseData);
    } catch (error) {
        console.error('Error posting data to API:', error);
    }
}

/*
const showBalSheet = async (ticker) => {
    let sheet = await findCompany(ticker); 
    console.log(sheet); 
    const price = await searchLivePrice(ticker); 
    
    // let balSheetSection = document.getElementById("data"); 
    // console.log(sheet.quarterlyReports[0]); 
    const currentBalQuarter = sheet.quarterlyReports[0]; 
    // let currentIncQuarter = incomestatement.quarterlyReports[1]; 
    // console.log(currentQuarter.inventory);

    populateBalSheetByQ(currentBalQuarter, price); 
}
*/

/*
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
}; 
*/