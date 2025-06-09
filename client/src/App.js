import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStockPrice = async () => {
    if (!symbol) return;

    setLoading(true);
    setError('');
    setStockData(null);

    try {
      const response = await fetch(`http://localhost:5000/stock/${symbol}`);
      const data = await response.json();

      if (response.ok) {
        setStockData(data);
      } else {
        setError(data.error || 'Failed to fetch stock data');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        📈 Mini Groww Stock App
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK'].map((sym) => (
          <Button
            key={sym}
            variant="outlined"
            onClick={() => {
              setSymbol(sym);
              fetchStockPrice();
            }}
          >
            {sym}
          </Button>
        ))}
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Stock Symbol"
          placeholder="e.g. RELIANCE, TCS"
          variant="outlined"
          fullWidth
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <Button variant="contained" onClick={fetchStockPrice} disabled={loading}>
          Get Price
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {stockData && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Stock Details for {stockData.symbol}
          </Typography>
          <Typography>Price: ₹{stockData.price || 'N/A'}</Typography>
          <Typography>Open: ₹{stockData.open || 'N/A'}</Typography>
          <Typography>High: ₹{stockData.high || 'N/A'}</Typography>
          <Typography>Low: ₹{stockData.low || 'N/A'}</Typography>
          <Typography>Volume: {stockData.volume || 'N/A'}</Typography>
          <Typography>Previous Close: ₹{stockData.previous_close || 'N/A'}</Typography>
          <Typography>
            Change: {stockData.change || 'N/A'} ({stockData.change_percent || 'N/A'})
          </Typography>
          <Typography>Latest Trading Day: {stockData.latest_trading_day || 'N/A'}</Typography>
        </Paper>
      )}
    </Container>
  );
}

export default App;
