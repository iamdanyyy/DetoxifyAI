# Deploying DetoxifyAI to Vercel

This guide will walk you through deploying your React app to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **Node.js**: Ensure you have Node.js 16+ installed locally

## Deployment Steps

### 1. Prepare Your Environment Variables

Before deploying, you'll need to set up your environment variables in Vercel:

- Go to your Vercel project dashboard
- Navigate to Settings → Environment Variables
- Add the following variables (copy from your `config.env` file):
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`
  - `REACT_APP_OPENAI_API_KEY`
  - Any other environment variables your app needs

**Important**: All environment variables must be prefixed with `REACT_APP_` to be accessible in the browser.

### 2. Deploy via Vercel Dashboard

1. **Import Project**:
   - Log into Vercel
   - Click "New Project"
   - Import your Git repository
   - Select the repository containing your DetoxifyAI app

2. **Configure Build Settings**:
   - **Framework Preset**: Select "Create React App"
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   - Add all your environment variables here
   - Make sure to prefix them with `REACT_APP_`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### 3. Deploy via Vercel CLI (Alternative)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm build settings
   - Deploy

### 4. Post-Deployment

1. **Test Your App**:
   - Visit your deployed URL
   - Test all major functionality
   - Check console for any errors

2. **Custom Domain** (Optional):
   - Go to your project settings
   - Add a custom domain
   - Configure DNS settings

3. **Environment Variables**:
   - Verify all environment variables are working
   - Check that your Supabase connection works
   - Ensure OpenAI API calls function properly

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Environment Variables**:
   - Ensure all variables are prefixed with `REACT_APP_`
   - Check variable names match exactly
   - Redeploy after adding new variables

3. **API Errors**:
   - Verify CORS settings in your backend
   - Check API endpoints are accessible
   - Ensure API keys are valid

4. **Routing Issues**:
   - The `vercel.json` file handles client-side routing
   - All routes should redirect to `index.html`
   - Test navigation between pages

### Performance Optimization

1. **Build Optimization**:
   - Vercel automatically optimizes your build
   - Static assets are cached and served from CDN
   - Images are automatically optimized

2. **Monitoring**:
   - Use Vercel Analytics to monitor performance
   - Check Core Web Vitals
   - Monitor error rates

## Next Steps

After successful deployment:

1. **Set up monitoring** and analytics
2. **Configure custom domain** if needed
3. **Set up automatic deployments** from your main branch
4. **Monitor performance** and user experience
5. **Set up staging environment** for testing

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **React Deployment**: [create-react-app.dev/docs/deployment](https://create-react-app.dev/docs/deployment)
