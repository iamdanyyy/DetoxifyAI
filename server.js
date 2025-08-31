const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// IntaSend API proxy endpoint
app.post('/api/payments/create', async (req, res) => {
  try {
    const { amount, currency, email, first_name, last_name, phone_number, description } = req.body;
    
            // Try the correct IntaSend API endpoint
    const apiUrl = 'https://api.intasend.com/v1/paymentlinks/';
    console.log('Using API:', apiUrl);
    console.log('API Key being used:', process.env.INTASEND_PUBLIC_KEY);
    console.log('API Key format check:', process.env.INTASEND_PUBLIC_KEY?.startsWith('ISPubKey_live_'));
    
    const intasendResponse = await axios.post(apiUrl, {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      email,
      first_name,
      last_name,
      phone_number,
      description,
      redirect_url: `${req.headers.origin}/payment-success`,
      webhook_url: `${req.headers.origin}/api/webhooks/payment`,
      state: 'test',
      collection_method: 'link',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.INTASEND_PUBLIC_KEY}`,
      },
    });

    const data = intasendResponse.data;
    console.log('Payment created successfully:', data);
    
    res.json({
      success: true,
      message: 'Payment link created successfully',
      checkout_url: data.checkout_url,
      payment_id: data.payment_id,
    });
  } catch (error) {
    console.error('Payment proxy error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to create payment: ${error.message}`,
    });
  }
});

// Payment verification endpoint
app.get('/api/payments/verify/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Use live API temporarily to test
    const apiUrl = `https://api.intasend.com/v1/paymentlinks/${paymentId}/`;
    console.log('Using API for verification:', apiUrl);
    
    const intasendResponse = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Token ${process.env.INTASEND_PUBLIC_KEY}`,
      },
    });

    const data = intasendResponse.data;
    console.log('Payment verification result:', data);
    
    res.json({
      success: true,
      isCompleted: data.state === 'COMPLETED',
      paymentData: data,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to verify payment: ${error.message}`,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test IntaSend API key endpoint
app.get('/api/test-key', async (req, res) => {
  try {
    console.log('Testing IntaSend API key...');
    console.log('API Key:', process.env.INTASEND_PUBLIC_KEY);
    console.log('API Key length:', process.env.INTASEND_PUBLIC_KEY?.length);
    
    // Test 1: Check account status (this endpoint exists)
    console.log('Testing account status...');
    try {
      const accountResponse = await axios.get('https://api.intasend.com/v1/account/', {
        headers: {
          'Authorization': `Token ${process.env.INTASEND_PUBLIC_KEY}`,
        },
      });
      console.log('Account status test successful:', accountResponse.status);
    } catch (accountError) {
      console.log('Account endpoint not available, trying payment test directly');
    }
    
    // Test 2: Try to create a minimal payment link
    console.log('Testing payment link creation...');
    const paymentTestResponse = await axios.post('https://api.intasend.com/v1/paymentlinks/', {
      amount: 100, // $1.00
      currency: 'USD',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      phone_number: '+1234567890',
      description: 'Test payment',
      redirect_url: 'http://localhost:3000/test',
      state: 'test',
      collection_method: 'link',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.INTASEND_PUBLIC_KEY}`,
      },
    });
    
    console.log('Payment test successful:', paymentTestResponse.status);
    
    res.json({ 
      success: true, 
      message: 'Payment API test passed - API key is working',
      paymentTest: paymentTestResponse.status
    });
    
  } catch (error) {
    console.error('API key test failed:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication failed - Check your API key and account status',
        status: 401,
        details: error.response?.data
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: `API key test failed: ${error.response?.status} - ${error.response?.data?.detail || error.message}`,
        status: error.response?.status
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Payment proxy server running on port ${PORT}`);
  console.log(`IntaSend public key configured: ${!!process.env.INTASEND_PUBLIC_KEY}`);
  console.log('Environment variables check:');
  console.log('INTASEND_PUBLIC_KEY:', process.env.INTASEND_PUBLIC_KEY ? 'SET' : 'NOT SET');
  console.log('INTASEND_SECRET_KEY:', process.env.INTASEND_SECRET_KEY ? 'SET' : 'NOT SET');
  console.log('Current working directory:', process.cwd());
  console.log('Files in current directory:', require('fs').readdirSync('.'));
});
