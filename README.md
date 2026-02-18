
# ZayanCart – Full Stack Ecommerce Application

# ZayanCart is a full-stack MERN ecommerce application with secure authentication, Razorpay payment integration, admin dashboard, product management, and dynamic homepage content.

# Built using React, Redux Toolkit, Node.js, Express, MongoDB Cluster, Razorpay, and Cloudinary.

# How To Run The Project (Main Steps)

# 1️⃣ Clone the Repository

# git clone https://github.com/your-username/zayancart.git
cd zayancart

# 2️⃣ Setup Backend

# cd backend
# npm install

# Create a .env file inside backend/:

PORT=5000
MONGO_URI=your_mongodb_cluster_connection_string
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for OTP)
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

# Run backend: npm run start

# for creating admin run npm run seed



# 3️⃣ Setup Frontend

# cd ../frontend
# npm install


VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Run frontend: npm run build

# 👤 User Features

Register with OTP email verification

Login with JWT authentication

Google OAuth login

Browse products with filters

Category / Brand / Material filtering

Add to cart (guest + user)

Cart auto-merge after login

Wishlist functionality

Secure checkout with Razorpay

Payment verification & order creation

View orders

Request product return

Add review (only after delivery)

Dynamic homepage content

# 🛠️ Admin Features

# Admin login (role-based access)

Dashboard with:

Total revenue

Total orders

Total products

Recent orders

User management

Product Managemnt

Category management

Brand management

Material management

Banner management

Order Management

Return request handling

# 💳 Payment Integration

Razorpay payment flow:

Create checkout session

Generate Razorpay order (backend)

Open Razorpay popup

Verify payment signature (backend)

Finalize order

Redirect to confirmation page

# 🧰 Tech Stack
# Frontend

React

Redux Toolkit

React Router

Axios

Tailwind CSS

Google OAuth

Razorpay SDK

# Backend

Node.js

Express.js

MongoDB Cluser

Mongoose

JWT Authentication

Razorpay

Cloudinary

Nodemailer (OTP)



