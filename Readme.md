# 🎥 YouTube Production-Grade Backend
[![Postman Docs](https://img.shields.io/badge/Postman-Documentation-orange?style=for-the-badge&logo=postman)](https://documenter.getpostman.com/view/51558579/2sBXigKY3A)
[![Live Server](https://img.shields.io/badge/Render-Live_Server-green?style=for-the-badge&logo=render)](https://youtube-backened.onrender.com/)
[![System Design](https://img.shields.io/badge/Eraser.io-System_Design-blue?style=for-the-badge&logo=eraser)](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

A feature-rich, scalable backend architecture for a video streaming platform built with **Node.js**, **Express.js**, and **MongoDB**. This project focuses on complex data relationships, industry-standard security, and high-performance queries.

## 🏗️ System Architecture & Design
I designed this system with a focus on modularity and scalability. You can view the full database schema and entity relationships here:
🔗 **[View Data Model on Eraser.io](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)**

## 🚀 Key Technical Highlights
- **Advanced Aggregations:** Implemented complex **MongoDB Aggregation Pipelines** to calculate real-time channel statistics (Total Views, Subscribers, Likes) in a single optimized query.
- **Robust Authentication:** Secured using **JWT Access & Refresh Tokens** with Bcrypt password hashing and custom middleware for session management.
- **Media Pipeline:** Integrated **Multer** and **Cloudinary** for cloud-based video storage, thumbnail management, and automated file cleanup.
- **Social Graph:** Built a comprehensive social ecosystem including multi-entity likes (videos, comments, tweets), nested commenting, and subscription tracking.

## 🛠️ Controllers & Features
- **User Management:** Secure auth, profile customization, and security-question-based password recovery.
- **Video Engine:** Full CRUD operations with visibility control (Publish/Unpublish) and pagination.
- **Interactions:** Tweets (short updates), Playlists, and sophisticated Like/Comment systems.
- **Creator Dashboard:** Detailed analytics for channel growth and video performance.
- **Health Check:** Dedicated endpoint for real-time monitoring of server uptime.

## 💻 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Security:** JWT (Json Web Token), Bcrypt
- **Cloud:** Cloudinary (Media Assets)
- **Documentation:** Postman API Documentation

## ⚙️ Installation
1. Clone the repo: `git clone https://github.com/Vishnuvarshnay/chai_backened.git`
2. Install dependencies: `npm install`
3. Configure your `.env` (using `.env.sample` as a guide).
4. Run the server: `npm start`
