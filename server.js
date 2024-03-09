const express = require("express"); 
const app = express(); 
const Joi = require("joi"); 
const multer = require("multer"); 
app.use(express.static("public")); 
app.use(express.json()); 
const cors = require("cors"); 
app.use(cors()); 
const mongoose = require("mongoose"); 

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
  