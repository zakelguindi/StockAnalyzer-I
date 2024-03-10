// const express = require("express"); 
const app = express(); 
const Joi = require("joi"); 
const multer = require("multer"); 
app.use(express.static("public")); 
app.use(express.json()); 
const cors = require("cors"); 
app.use(cors()); 
const mongoose = require("mongoose"); 

const upload = multer({ dest:__dirname + "/public/images"});




const companySchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true
    },
    yearlyData: [{
        price: {
            type: Number, 
            validate: {
                validator: Number.isFloat, //validates number as a float 
                message: 'invalid price format'
            }
        }, 
        overUnder: {
            type: Number, 
            validate: {
                validator: Number.isFloat, 
                message: 'invalid over/under'
            }
        }, 
        EVperShare: {
            type: Number, 
            validate: {
                validaator: Number.isFloat, 
                message: 'invalid EV/share'
            }
        }, 
        EV: {
            type: Number, 
            validate: {
                validaator: Number.isFloat, 
                message: 'invalid EV/share'
            }
        },
        EnterpriseVal: {
            type: Number, 
            validate: {
                validaator: Number.isFloat, 
                message: 'invalid EV/share'
            }
        }, 
        MarketCap: {
            type: Number, 
            validate: {
                validaator: Number.isFloat, 
                message: 'invalid EV/share'
            }
        },
        BalSheet: [{
            sharesOutstanding: Number, 
            debt: Number, 
            cash: Number
        }]
    }]
        /**
         * I could hold all the data in one thing or break the detialed info into a smaller array. 
         * yearly Data? And just show the most recent? 
         * yeah. group it by yearly data. 
         * stock price is a separate thing I think. it's outside the array. 
         * 
         * Outside array: ticker, price, over/under, EV/share, EV, Enterprise Val, MarketCap
         * Inside array: all quarterly reports stuff. 
         *  SharesOutstanding, Debt, Cash
         */

});

//validates it before saving it.
companySchema.pre('save', function (next) {
    const yearlyData = this.yearlyData; 

    if(Array.isArray(yearlyData)) {
        for (const item of yearlyData) {
            if(item && typeof item === 'object') {
                const price = item.price; 
                const overUnder = item.overUnder; 
                const EVperShare = item.EVperShare; 
                const EV = item.EV; 
                const EnterpriseVal = item.EnterpriseVal; 
                const MarketCap = item.MarketCap; 

                if(price === undefined || typeof price !== 'number') {
                    return next(new Error("Invalid price")); 
                }
                if(overUnder === undefined || typeof overUnder !== 'number') {
                    return next(new Error("Invalid overUnder")); 
                }
                if(EVperShare === undefined || typeof EVperShare !== 'number') {
                    return next(new Error("Invalid EV/Share")); 
                }
                if(EV === undefined || typeof EV !== 'number') {
                    return next(new Error("Invalid EV")); 
                }
                if(EnterpriseVal === undefined || typeof EnterpriseVal !== 'number') {
                    return next(new Error("Invalid Enterprise Val")); 
                }
                if(MarketCap === undefined || typeof MarketCap !== 'number') {
                    return next(new Error("Invalid Market Cap")); 
                }
                
                const BalSheet = item.BalSheet; 
                for(const data in BalSheet) {
                    if(data && typeof data === 'object') {
                        const sharesOutstanding = data.sharesOutstanding; 
                        const debt = data.debt; 
                        const cash = data.cash; 

                        if(sharesOutstanding === undefined || typeof sharesoutstanding !== 'number') {
                            return next(new Error("Invalid shares outstanding")); 
                        }
                        if(debt === undefined || typeof debt !== 'number') {
                            return next(new Error("Invalid debt")); 
                        }
                        if(cash === undefined || typeof cash !== 'number') {
                            return next(new Error("Invalid cash")); 
                        }
                    }
                }
            } else {
                return next(new Error("Invalid yearlyData object in yearlyData array."))
            }
        }
        next(); 
    } else {
        next(new Error("Data must be an array")); 
    }
});

const Company = mongoose.model("Company", companySchema); 

module.exports = Company; 

app.get("/api/companies", (req, res) => {
    getCompanies(res); 
});

const getCompanies = async(res) => {
    const companies = await Company.find(); 
    res.send(companies); 
}

app.post("/api/companies", upload.single("img"), (req, res) => {
    // const result = validateCompany(req.body); 
    //we're going to validate it once it actually works lol 
    if(req.body.error) {
        res.status(400).send(req.body.error.details[0].message); 
        return; 
    }
    const company = new Company ({
        ticker: req.body.ticker, 
        yearlyData: req.body.yearlyData
    })
});


// async function postData() {
//     const inputData = document.getElementById("dataInput").value;

//     const callbackName = 'jsonpCallback';
//     const url = "https://script.google.com/macros/s/AKfycbxIWFOg3oo2DgGba5Iw3QZcRDDONSsXQLGMTE25nhZ_Sg7lgWpwTzfYb_GMqTZUx-fC/exec";



//     const response = await fetch(`${url}?callback=${callbackName}`, {
//         method: "POST", 
//         headers: {
//             'Content-Type': '/application/json',
//         },
//         body: JSON.stringify({ data : inputData }),
//     });

//     const result = await response.json(); 
//     console.log(result); 
// }; 

// async function fetchMyData() {
//     const response = await fetch("https://script.google.com/macros/s/AKfycbxIWFOg3oo2DgGba5Iw3QZcRDDONSsXQLGMTE25nhZ_Sg7lgWpwTzfYb_GMqTZUx-fC/exec"); 
//     const result = await response.text; 

//     document.getElementById("fetchedData").innerText = result;  
// }

// fetchMyData(); 

// app.js
async function postData() {
    const inputData = document.getElementById("dataInput").value;
  
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxIWFOg3oo2DgGba5Iw3QZcRDDONSsXQLGMTE25nhZ_Sg7lgWpwTzfYb_GMqTZUx-fC//exec';
    const callbackName = 'jsonpCallback';
  
    const response = await fetch(`${scriptURL}?callback=${callbackName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: inputData }),
    });
  
    // Handle the JSONP response
    const result = await response.json();
    console.log(result);
  }
  
  async function fetchData() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxIWFOg3oo2DgGba5Iw3QZcRDDONSsXQLGMTE25nhZ_Sg7lgWpwTzfYb_GMqTZUx-fC//exec';
    const callbackName = 'jsonpCallback';
  
    const response = await fetch(`${scriptURL}?callback=${callbackName}`);
    const result = await response.json();
  
    document.getElementById('fetchedData').innerText = JSON.stringify(result);
  }
  
  // Fetch data when the page loads
  fetchData();
  
