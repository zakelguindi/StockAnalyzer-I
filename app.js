const express = require('express');
const app = express();
const port = 3000; // You can use any port you prefer

// Middleware to parse JSON in requests
app.use(express.json());

// POST endpoint to add data
app.post('/api/data', (req, res) => {
  // Assuming the data is sent in the request body
  const newData = req.body;

  // You can process or store the data as needed
  // For simplicity, just log it for now
  console.log('New data received:', newData);

  // Respond with a success message
  res.json({ message: 'Data added successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
