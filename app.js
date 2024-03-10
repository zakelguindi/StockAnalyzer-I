const express = require('express');
const app = express();
const port = 3000; // You can use any port you prefer

// Middleware to parse JSON in requests
app.use(express.json());

const Joi = require("joi"); 
const multer = require("multer"); 
app.use(express.static("public")); 
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
                validator: Number.isFinite, //validates number as a float 
                message: 'invalid price format'
            }
        }, 
        overUnder: {
            type: Number, 
            validate: {
                validator: Number.isFinite, 
                message: 'invalid over/under'
            }
        }, 
        EVperShare: {
            type: Number, 
            validate: {
                validator: Number.isFinite, 
                message: 'invalid EV/share'
            }
        }, 
        EV: {
            type: Number, 
            validate: {
                validator: Number.isFinite, 
                message: 'invalid EV/share'
            }
        },
        EnterpriseVal: {
            type: Number, 
            validate: {
                validator: Number.isFinite, 
                message: 'invalid EV/share'
            }
        }, 
        MarketCap: {
            type: Number, 
            validate: {
                validator: Number.isFinite, 
                message: 'invalid EV/share'
            }
        },
        BalSheet: [{
            sharesOutstanding: Number, 
            debt: Number, 
            cash: Number
        }]
    }]
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

const validCompanyData = {
    ticker: 'AAPL',
    yearlyData: [
      {
        price: 150.50,
        overUnder: 5.25,
        EVperShare: 30.75,
        EV: 250000000000,
        EnterpriseVal: 300000000000,
        MarketCap: 2000000000000,
        BalSheet: [
          {
            sharesOutstanding: 5000000000,
            debt: 50000000000,
            cash: 100000000000,
          },
          {
            sharesOutstanding: 5100000000,
            debt: 55000000000,
            cash: 110000000000,
          },
        ],
      },
      // Add more yearly data objects as needed
    ],
  };
  
  const validCompany = new Company(validCompanyData);
  
  validCompany.save()
    .then(() => {
      console.log('Valid company data saved successfully');
    })
    .catch((error) => {
      console.error('Error saving valid company data:', error.message);
    });
  

// POST endpoint to add data
// app.post('/api/data', (req, res) => {
//   // Assuming the data is sent in the request body
//   const newData = req.body;

//   // You can process or store the data as needed
//   // For simplicity, just log it for now
//   console.log('New data received:', newData);

//   // Respond with a success message
//   res.json({ message: 'Data added successfully' });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
