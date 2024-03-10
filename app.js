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
    const companies = await Company.find();
    res.json(companies);
});

app.post('/api/companies', (req, res) => {
    const company = new Company({
        ticker: req.body.ticker,
        yearlyData: req.body.yearlyData
    });

    company.save()
        .then(savedCompany => res.json(savedCompany))
        .catch(error => res.status(400).send(error.message));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
