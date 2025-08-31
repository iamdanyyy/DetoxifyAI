# 🧪 IntaSend Sandbox Setup Guide

## Quick Start (5 minutes)

### 1. Get Sandbox API Keys
1. Go to [IntaSend Sandbox](https://sandbox.intasend.com/)
2. Create a free account
3. Go to API Keys section
4. Copy your **Sandbox Public Key** (starts with `ISPubKey_test_`)

### 2. Update config.env
Edit `config.env` and replace the placeholder with your real sandbox key:

```env
INTASEND_PUBLIC_KEY=ISPubKey_test_your_actual_sandbox_key_here
```

### 3. Start the Backend
```bash
node server.js
```

You should see:
```
Payment proxy server running on port 3001
IntaSend public key configured: true
Using sandbox API: https://sandbox.intasend.com/api/v1/paymentlinks/
```

### 4. Start the Frontend
```bash
npm start
```

### 5. Test the Payment Flow
- Go to `/premium` in your app
- Click "Upgrade to Premium"
- You'll be redirected to IntaSend's sandbox payment page
- Use test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

## 🎯 What You Get with Sandbox Mode

✅ **No Real Money** - All payments are simulated  
✅ **No Verification Required** - Instant account setup  
✅ **Full Payment Flow** - Test the complete user experience  
✅ **Perfect for Demos** - Show clients how payments work  
✅ **Hackathon Ready** - No waiting for approval  

## 🔑 Sandbox vs Live Keys

| Feature | Sandbox | Live |
|---------|---------|------|
| **API URL** | `sandbox.intasend.com` | `api.intasend.com` |
| **Money** | Fake/test | Real transactions |
| **Setup Time** | 5 minutes | 1-2 business days |
| **Verification** | None required | Business verification |
| **Perfect For** | Testing, demos, development | Production apps |

## 🚀 Ready to Go Live?

When you're ready for real payments:
1. Apply for live account at [intasend.com](https://intasend.com)
2. Replace sandbox URLs with live URLs in `server.js`
3. Update your `config.env` with live API keys
4. Test with small amounts first

## 🆘 Need Help?

- **Sandbox Issues**: Check the browser console and server logs
- **API Keys**: Make sure they start with `ISPubKey_test_`
- **Server Won't Start**: Verify `config.env` exists and has correct format
- **Payment Fails**: Check that both backend (3001) and frontend (3000) are running

## 🎉 You're All Set!

Your payment system is now running in sandbox mode. Test it out and let me know how it goes!
