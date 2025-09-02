# DetoxifyAI - Addiction Recovery & Detox Support App

An AI-powered web application designed to support individuals on their addiction recovery and detoxification journey. Built with React, TypeScript, and Supabase.

## 🚀 Features

### Core Features
- **AI-Powered Chat Companion** - Get 24/7 support and guidance from DetoxifyAI
- **Daily Progress Tracking** - Log mood, cravings, and recovery milestones
- **Progress Analytics** - Visual charts and insights into your recovery journey
- **Premium Subscription** - Unlock advanced features with IntaSend payments
- **User Authentication** - Secure login/signup with Supabase Auth

### Premium Features
- Unlimited AI chat messages
- Personalized detox plans
- Advanced analytics and insights
- Priority support access

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5-turbo
- **Payments**: IntaSend API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended) or Bolt.new

## 📋 Prerequisites

Before running this application, you'll need:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Supabase** account and project
4. **OpenAI** API key
5. **IntaSend** account (for payments)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DetoxifyAI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp env.example .env
```

Fill in your environment variables:
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key

# IntaSend Payment Configuration
REACT_APP_INTASEND_API_KEY=your_intasend_api_key
```

### 4. Set Up Supabase Database

#### Create Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    sobriety_start DATE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress logs table
CREATE TABLE public.progress_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    mood TEXT NOT NULL,
    cravings_level INTEGER CHECK (cravings_level >= 1 AND cravings_level <= 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress logs" ON public.progress_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress logs" ON public.progress_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress logs" ON public.progress_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Configure Authentication
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Configure your site URL and redirect URLs
4. Enable email confirmations if desired

### 5. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📱 App Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Chat/           # AI chat interface
│   ├── Dashboard/      # Main dashboard
│   ├── Layout/         # Navigation and layout
│   ├── Payments/       # Payment components
│   └── Progress/       # Progress tracking
├── contexts/           # React contexts
├── lib/               # Utility libraries
└── App.tsx           # Main app component
```

## 🔧 Configuration

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database setup SQL commands above

### OpenAI Setup
1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to your `.env` file

### IntaSend Setup
1. Create an account at [IntaSend](https://intasend.com)
2. Get your API key from the dashboard
3. Add it to your `.env` file

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Select "Create React App" framework preset
3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
4. **Set environment variables** in Vercel dashboard:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_OPENAI_API_KEY`
   - `REACT_APP_INTASEND_PUBLIC_KEY`
   - `REACT_APP_INTASEND_SECRET_KEY`
5. **Deploy!**

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

### Deploy to Bolt.new (Alternative)
1. Push your code to GitHub
2. Connect your repository to Bolt.new
3. Set environment variables in Bolt.new dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set these in your production environment:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_OPENAI_API_KEY`
- `REACT_APP_INTASEND_PUBLIC_KEY`
- `REACT_APP_INTASEND_SECRET_KEY`

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Protected routes in React
- Environment variable protection
- Secure payment processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact:
- Email: support@detoxifyai.com
- Documentation: [docs.detoxifyai.com](https://docs.detoxifyai.com)

## ⚠️ Important Notes

- This app is designed for addiction recovery support but is not a replacement for professional medical treatment
- Always encourage users to seek professional help when needed
- Implement proper crisis intervention protocols
- Ensure compliance with healthcare regulations in your jurisdiction

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Group support features
- [ ] Integration with healthcare providers
- [ ] Advanced AI features
- [ ] Multi-language support
- [ ] Offline mode

