
A fully-featured backend for an Instagram-style social platform supporting authentication, posts (images + captions), likes, comments, and real-time chat messaging with Socket.IO.

This project is built using Node.js, Express, TypeScript, MongoDB, Mongoose, Cloudinary, and Socket.IO.
It follows a clean architecture with controllers, services, repositories, utils, middleware, validators, and centralized error handling.

-- Features->
 
- Authentication->
Register & login with JWT
Password hashing (bcrypt)
Protected routes using auth middleware
Express-Validator for request validation

- Post Management->
Create posts (caption + image)
Cloudinary image upload
Like/unlike posts
Commenting system
Pagination for posts
Clean service & controller architecture

- Real-Time Chat System->
1:1 private conversations
Real-time messaging (Socket.IO)
Typing indicator
Online/offline user tracking
Message persistence in MongoDB
Pagination for chat messages

- Backend Architecture->
TypeScript everywhere
asyncHandler wrapper
AppError for custom errors
Centralized errorHandler with Winston logging
sendSuccess / sendError response standard
Modular folder structure
Secure CORS setup
JWT socket authentication

