# ChaiTube Frontend

A modern YouTube clone frontend built with React, TailwindCSS, and integrated with a Node.js backend.

## Features

- 🎥 Video upload and streaming
- 👤 User authentication (register/login/logout)
- 🎬 Video player with controls
- 📱 Responsive design
- 🔍 Video search functionality
- 👍 Like/dislike system
- 📺 Channel pages
- 📝 Video descriptions and metadata

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: TailwindCSS with custom YouTube theme
- **Icons**: Lucide React
- **Video Player**: React Player
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 8000

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chai_backened/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your actual configuration:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_API_KEY=your_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Application

1. Make sure your backend server is running:
```bash
# In the backend directory
npm run dev
```

2. Start the frontend development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The build files will be in the `build` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js      # Main navigation bar
│   └── ProtectedRoute.js # Authentication wrapper
├── context/           # React context
│   └── AuthContext.js # Authentication state management
├── pages/             # Page components
│   ├── Home.js        # Video feed/home page
│   ├── Login.js       # User login
│   ├── Register.js    # User registration
│   ├── VideoPlayer.js # Video playback page
│   ├── UploadVideo.js # Video upload form
│   └── Channel.js     # Channel profile page
├── App.js             # Main app component
├── index.css          # Global styles with Tailwind
└── index.js           # App entry point
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/current-user` - Get current user

### Videos
- `GET /api/v1/videos` - Get all videos
- `GET /api/v1/videos/:videoId` - Get video by ID
- `POST /api/v1/videos` - Upload new video
- `PATCH /api/v1/videos/:videoId` - Update video
- `DELETE /api/v1/videos/:videoId` - Delete video

### Likes
- `POST /api/v1/likes/v/:videoId` - Like video
- `POST /api/v1/likes/toggle/v/:videoId` - Toggle like status

### Channels
- `GET /api/v1/users/c/:username` - Get channel profile

## Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Option 2: Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `build` folder to Netlify

### Option 3: AWS S3 + CloudFront

1. Build the project
2. Upload `build` folder to S3
3. Configure CloudFront distribution

## Environment Variables

Make sure to set these environment variables in your deployment platform:

- `REACT_APP_API_URL` - Your backend API URL
- `REACT_APP_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `REACT_APP_CLOUDINARY_API_KEY` - Cloudinary API key
- `REACT_APP_CLOUDINARY_API_SECRET` - Cloudinary API secret

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.
