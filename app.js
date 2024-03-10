const express = require("express"); 
const app = express(); 
const Joi = require("joi"); 
const multer = require("multer"); 
app.use(express.static("public")); 
app.use(express.json()); 
const cors = require("cors"); 
app.use(cors()); 
const mongoose = require("mongoose"); 
const port = 3000; 


const upload = multer({ dest:__dirname + "/public/images"});


// Connect to MongoDB
mongoose
    .connect("mongodb+srv://zakelguindi:Zakary13@cluster0.nj3vpi4.mongodb.net/StockAnalyzer-I")
    .then(() => console.log("You're connected to MongoDB"))
    .catch((err) => console.error("couldn't connect to MongoDB")); 
const db = mongoose.connection;

// Define your Company schema
const companySchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true
    },
    yearlyData: [{
        price: Number,
        overUnder: Number,
        EVperShare: Number,
        EV: Number,
        EnterpriseVal: Number,
        MarketCap: Number,
        BalSheet: [{
            sharesOutstanding: Number,
            debt: Number,
            cash: Number
        }]
    }]
});

const Company = mongoose.model('Company', companySchema);




app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html"); 
});


// API endpoints
app.get('/api/companies', async (req, res) => {
    getCompanies(res); 
});

const getCompanies = async(res) => {
    const companies = await Company.find(); 
    res.send(companies); 
};

app.post('/api/companies', async (req, res) => {
    const company = new Company({
        ticker: req.body.ticker,
        yearlyData: req.body.yearlyData.map((yearlyDataEntry) => {
            return {
                price: yearlyDataEntry.price,
                overUnder: yearlyDataEntry.overUnder,
                EVperShare: yearlyDataEntry.EVperShare,
                EV: yearlyDataEntry.EV,
                EnterpriseVal: yearlyDataEntry.EnterpriseVal,
                MarketCap: yearlyDataEntry.MarketCap,
                BalSheet: yearlyDataEntry.BalSheet.map((balSheetEntry) => {
                    return {
                        sharesOutstanding: balSheetEntry.sharesOutstanding,
                        debt: balSheetEntry.debt,
                        cash: balSheetEntry.cash,
                    };
                }),
            };
        }),
    });

    createCompany(company, res); 
});

const createCompany = async(company, res) => {
    const result = await company.save(); 
    res.send(company); 
}

// Example fetch call in app.js
  

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
