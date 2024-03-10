const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/StockAnalyzer-I')
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
