# ChaiTube Deployment Guide

This guide will help you deploy both the backend and frontend of your YouTube clone application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for video/image storage)
- Domain name (optional)

## Backend Deployment

### Option 1: Heroku (Recommended for beginners)

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create your-app-name
```

4. **Set Environment Variables**
```bash
heroku config:set PORT=8000
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourdb
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
heroku config:set ACCESS_TOKEN_SECRET=your_secret_key
heroku config:set ACCESS_TOKEN_LIFE=1d
heroku config:set REFRESH_TOKEN_SECRET=your_refresh_secret_key
heroku config:set REFRESH_TOKEN_LIFE=10d
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
```

5. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 2: Vercel (Serverless)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Create vercel.json in backend root**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/index.js"
    }
  ],
  "env": {
    "PORT": "8000",
    "MONGODB_URI": "@mongodb_uri",
    "CORS_ORIGIN": "@cors_origin",
    "ACCESS_TOKEN_SECRET": "@access_token_secret",
    "ACCESS_TOKEN_LIFE": "1d",
    "REFRESH_TOKEN_SECRET": "@refresh_token_secret",
    "REFRESH_TOKEN_LIFE": "10d",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary_cloud_name",
    "CLOUDINARY_API_KEY": "@cloudinary_api_key",
    "CLOUDINARY_API_SECRET": "@cloudinary_api_secret"
  }
}
```

3. **Deploy**
```bash
vercel --prod
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install Vercel CLI**
```bash
npm i -g vercel
```

3. **Set environment variables**
```bash
vercel env add REACT_APP_API_URL production
# Enter your backend URL when prompted
```

4. **Deploy**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Deploy to Netlify**
   - Go to netlify.com
   - Drag and drop the `build` folder
   - Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Option 3: GitHub Pages

1. **Install gh-pages**
```bash
cd frontend
npm install --save-dev gh-pages
```

2. **Update package.json**
```json
{
  "homepage": "https://yourusername.github.io/your-repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. **Deploy**
```bash
npm run deploy
```

## Full Stack Deployment (Recommended)

### Using Vercel for Both Frontend and Backend

1. **Project Structure**
```
chai_backened/
├── api/              # Backend code
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/         # Frontend code
│   ├── src/
│   ├── package.json
│   └── ...
└── vercel.json       # Root configuration
```

2. **Root vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/src/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/index.html"
    }
  ]
}
```

3. **Update frontend API calls**
   - Change all API calls from `/api/v1/` to `/api/api/v1/`

## Environment Variables Setup

### Backend Variables
- `PORT`: Server port (default: 8000)
- `MONGODB_URI`: MongoDB connection string
- `CORS_ORIGIN`: Frontend URL
- `ACCESS_TOKEN_SECRET`: JWT access token secret
- `REFRESH_TOKEN_SECRET`: JWT refresh token secret
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Frontend Variables
- `REACT_APP_API_URL`: Backend API URL

## Production Checklist

Before deploying to production, make sure to:

1. **Security**
   - Use strong secrets for JWT tokens
   - Enable HTTPS
   - Set proper CORS origins
   - Validate all input data

2. **Performance**
   - Enable video compression
   - Implement caching
   - Use CDN for static assets
   - Optimize images

3. **Database**
   - Use production MongoDB
   - Set up indexes for better performance
   - Enable backups

4. **Monitoring**
   - Set up error tracking
   - Monitor API performance
   - Set up alerts

## Custom Domain Setup

### Vercel
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records

### Netlify
1. Go to Netlify dashboard
2. Select your site
3. Go to Site settings → Domain management
4. Add custom domain
5. Update DNS records

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure `CORS_ORIGIN` is set correctly
   - Check that frontend URL is whitelisted

2. **Database Connection**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits

4. **Build Failures**
   - Check all dependencies are installed
   - Verify environment variables are set

### Debug Commands

```bash
# Check backend logs (Vercel)
vercel logs

# Check environment variables
heroku config

# Test API endpoints
curl -X GET https://your-backend-url/api/v1/healthcheck
```

## Scaling Considerations

When your application grows, consider:

1. **Database Scaling**
   - Use MongoDB Atlas for automatic scaling
   - Implement read replicas

2. **CDN for Videos**
   - Use Cloudinary's CDN
   - Consider AWS S3 + CloudFront

3. **Load Balancing**
   - Use multiple server instances
   - Implement horizontal scaling

4. **Caching**
   - Redis for session storage
   - CDN for static assets
   - Browser caching strategies
