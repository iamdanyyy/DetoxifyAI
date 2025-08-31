# IntaSend Payment Setup Guide

## Overview
This guide explains how to set up IntaSend payments for the DetoxifyAI application.

**Important**: Due to CORS restrictions, this application uses a backend proxy server to communicate with IntaSend APIs.

## Prerequisites
1. An IntaSend account (https://intasend.com)
2. API keys from your IntaSend dashboard

## Configuration Steps

### 1. Get Your IntaSend API Keys
1. Log in to your IntaSend dashboard
2. Go to API Keys section
3. Create a new API key pair
4. Copy both the Public Key and Secret Key

### 2. Set Up Backend Proxy Server
1. Install backend dependencies:
   ```bash
   npm install --prefix ./server
   ```

2. Create a `.env` file in the server directory:
   ```env
   PORT=3001
   INTASEND_PUBLIC_KEY=ISPubKey_live_your_actual_public_key_here
   INTASEND_SECRET_KEY=ISSecretKey_live_your_actual_secret_key_here
   ```

3. Start the backend server:
   ```bash
   npm run dev --prefix ./server
   ```

### 3. Frontend Environment Variables
Create a `.env` file in your project root with the following variables:

```env
# IntaSend Payment Configuration
REACT_APP_INTASEND_PUBLIC_KEY=ISPubKey_live_your_actual_public_key_here
REACT_APP_INTASEND_SECRET_KEY=ISSecretKey_live_your_actual_secret_key_here
```

**Important Notes:**
- Replace `your_actual_public_key_here` with your real IntaSend public key
- Replace `your_actual_secret_key_here` with your real IntaSend secret key
- The public key should start with `ISPubKey_`
- The secret key should start with `ISSecretKey_`
- Use `live` keys for production, `test` keys for development

### 4. API Endpoints
The application uses the following endpoints:
- **Frontend**: Communicates with backend proxy at `http://localhost:3001/api`
- **Backend**: Communicates with IntaSend API at `https://api.intasend.com/v1`
- **Create Payment**: `POST /api/payments/create`
- **Verify Payment**: `GET /api/payments/verify/{payment_id}`

### 5. Testing
1. Start the backend server: `npm run dev --prefix ./server`
2. Start the frontend: `npm start`
3. Test the payment flow with small amounts
4. Verify webhook handling
5. Switch to live keys for production

## Troubleshooting

### Common Issues

#### 1. "Payment service not configured" Error
- Check that your `.env` file exists
- Verify the environment variable names are correct
- Ensure the API keys are properly formatted

#### 2. "404 Page not found" Error
- Verify the API endpoint URLs are correct
- Check that your API keys are valid
- Ensure you're using the correct base URL

#### 3. "Invalid payment service configuration" Error
- Verify your public key starts with `ISPubKey_`
- Check that you're using the correct key type (live vs test)

### Debug Steps
1. Check browser console for detailed error messages
2. Verify API key format in environment variables
3. Test API endpoints with a tool like Postman
4. Check IntaSend dashboard for API usage logs

## Security Notes
- Never commit your `.env` file to version control
- Keep your secret key secure and private
- Use environment variables for all sensitive configuration
- Regularly rotate your API keys

## Support
If you continue to experience issues:
1. Check IntaSend documentation: https://docs.intasend.com
2. Verify your account status in IntaSend dashboard
3. Contact IntaSend support for API-related issues
4. Check the application logs for detailed error information
