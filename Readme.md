#vishnu aur backened
-[Model link](
  https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj
)





YouTube Backend Clone - API Documentation
This project is a feature-rich YouTube backend built using Node.js, Express.js, and MongoDB. It includes advanced features like JWT authentication, video management, and complex social interactions using MongoDB aggregation pipelines.

🛠️ Controllers & Features
1. User & Authentication
Registration & Login: Secure authentication using JWT and bcrypt password hashing.

Profile Management: Fetch user details, update profile info, and change passwords.

Account Security: Password reset functionality using security questions.

2. Video Management
Upload & Management: Full CRUD operations for videos with Cloudinary integration for media storage.

Visibility Control: Toggle publish status for videos.

3. Social Interactions
Tweets: Create, read, update, and delete short text updates.

Likes: Toggle likes on videos, comments, and tweets.

Comments: Add, edit, and delete comments with pagination support.

Subscriptions: Follow/unfollow channels and view subscriber/subscribed lists.

4. Content Organization
Playlists: Create and manage collections of videos.

5. Dashboard & Analytics
Channel Stats: Get total views, total subscribers, and total likes across all videos using MongoDB aggregation.

Video Management: Fetch all videos uploaded by the authenticated user for the dashboard view.

6. System Health
Healthcheck: A lightweight endpoint to monitor server uptime and status.
