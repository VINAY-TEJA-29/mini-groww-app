const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;
const API_KEY = 'KBCH2VC09PNV4GZV';

app.use(cors());

app.get('/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );

    if (response.data && response.data.c) {
      res.json({
        symbol,
        price: response.data.c,
        previous_close: response.data.pc,
      });
    } else {
      res.status(404).json({ error: 'Stock data not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
