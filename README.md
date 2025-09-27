# Forever E-commerce Store

A full-stack MERN e-commerce application with user authentication, admin panel, shopping cart, and payment processing.

CLICK ON IMAGE TO PLAY DEMO
[![foreve-image](https://github.com/user-attachments/assets/347137fa-f29c-4a14-97e9-9653d4131dda)](https://www.youtube.com/watch?v=sfgdCth_n3I)



## Features

- **User Authentication**: JWT-based auth with access/refresh tokens
- **Role-based Access**: Customer and Admin roles
- **Product Management**: CRUD operations for products (Admin only)
- **Shopping Cart**: Add, remove, update quantities
- **Payment Processing**: Stripe integration for secure payments
- **Redis Caching**: Featured products caching
- **Image Storage**: Cloudinary integration

## Tech Stack

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Redis (Upstash)
- JWT Authentication
- Stripe Payments
- Cloudinary (Image storage)

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (State management)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Redis instance
- Stripe account
- Cloudinary account

### Environment Variables

Create `.env` in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
ACCESSTOKEN_SECRET=your_access_token_secret
REFRESHTOKEN_SECRET=your_refresh_token_secret
UPSTASH_REDIS_URL=your_redis_url
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=your_frontend_url
```

## Project Structure
```
├── backend/
│   ├── api/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── lib/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── types/
│   └── public/
└── package.json
```

## API Endpoints
### Authentication
```
POST /api/auth/signup - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
GET /api/auth/profile - Get user profile
```

### Products
```
GET /api/products - Get all products (Admin)
GET /api/products/featured - Get featured products
GET /api/products/category/:category - Get products by category
POST /api/products - Create product (Admin)
DELETE /api/products/:id - Delete product (Admin)
```

### Cart
```
GET /api/cart - Get cart items
POST /api/cart - Add to cart
PUT /api/cart/:id - Update quantity
DELETE /api/cart - Remove from cart
```

### Payment
```
POST /api/payment/create-checkout-session - Create Stripe session
POST /api/payment/checkout-success - Handle successful payment
```

## Contributing
- Fork the repository
- Create a feature branch
- Commit your changes
- Push to the branch
- Create a Pull Request
