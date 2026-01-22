# Buffs Restaurant Backend API

A complete backend solution for an ecommerce restaurant ordering system with real-time notifications, admin dashboard, and blog management.

## Features

✅ **User Authentication**: Email OTP verification for checkout
✅ **Product Management**: Categories, products with variants and add-ons
✅ **Cart System**: Full shopping cart with customization
✅ **Order Management**: Complete order lifecycle with status tracking
✅ **Real-time Notifications**: WebSocket integration for instant updates
✅ **Admin Dashboard**: Order management, analytics, and control
✅ **Blog System**: Full blog management with SEO support
✅ **Payment Integration**: Ready for Stripe/payment gateway
✅ **Email Notifications**: Automated emails for order updates

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Image Upload**: Cloudinary
- **Email**: Nodemailer

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create/update `.env` file with:

```
PORT=3000
FRONTEND_URL=http://localhost:3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### 3. Cloudinary Setup (for image uploads)

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Get your credentials from Dashboard
4. Add to `.env`

### 4. Gmail App Password (for emails)

1. Enable 2FA on Gmail
2. Generate App Password
3. Use in `.env` as `EMAIL_PASSWORD`

### 5. MongoDB Setup

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Add connection string to `.env`

## Running the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### **Users (Public)**

- `POST /api/users/send-otp` - Send OTP to user email
- `POST /api/users/verify-otp` - Verify OTP
- `GET /api/users/:id` - Get user details

### **Products (Public)**

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/category/:categoryId` - Get products by category

### **Categories (Public)**

- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details

### **Cart (Public)**

- `GET /api/cart/:cartId` - Get cart
- `POST /api/cart/:cartId/items` - Add item to cart
- `PUT /api/cart/:cartId/items/:itemId` - Update cart item
- `DELETE /api/cart/:cartId/items/:itemId` - Remove item
- `DELETE /api/cart/:cartId/clear` - Clear entire cart

### **Orders (Public)**

- `POST /api/orders` - Create order (checkout)
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/cancel` - Cancel order (only if pending)
- `POST /api/orders/:orderId/reorder` - Reorder

### **Payments (Public)**

- `POST /api/payments` - Create payment
- `POST /api/payments/confirm/:paymentId` - Confirm payment
- `GET /api/payments/:paymentId` - Get payment details

### **Blogs (Public)**

- `GET /api/blogs` - List all published blogs
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `GET /api/blogs/category/:category` - Get blogs by category

### **Notifications (Public)**

- `GET /api/notifications/user/:userId` - Get user notifications
- `GET /api/notifications/admin` - Get admin notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `DELETE /api/notifications/:notificationId` - Delete notification

### **Admin (Protected - requires JWT token)**

#### Authentication

- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Create admin (initial setup)

#### Products

- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

#### Categories

- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

#### Blogs

- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog
- `GET /api/admin/blogs` - Get all blogs (including drafts)

#### Orders

- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

#### Analytics

- `GET /api/admin/analytics/dashboard` - Get dashboard analytics

## WebSocket Events

### Server to Client

**User Notifications:**

```javascript
socket.on('order-status', (data) => {
  // { orderId, status, message }
})
```

**Admin Notifications:**

```javascript
socket.on('new-order', (data) => {
  // { orderId, orderNumber, customerName, totalAmount, timestamp }
})

socket.on('order-updated', (data) => {
  // { orderId, orderNumber, status, timestamp }
})
```

### Client to Server

```javascript
// User connects to their notification room
socket.emit('join-user', userId)

// Admin connects to order notifications
socket.emit('join-admin-orders')

// Admin connects to their notification room
socket.emit('join-admin', adminId)
```

## Order Status Flow

1. **Pending** → User places order, can cancel
2. **Preparing** → Admin starts preparing, user cannot cancel
3. **Out for Delivery** → Order sent, user cannot cancel
4. **Delivered** → Order completed
5. **Cancelled** → Order cancelled (only from pending)

## User Checkout Flow

1. User fills form (name, email, phone, location)
2. Backend sends OTP to email
3. User enters OTP
4. User adds items to cart
5. User proceeds to checkout
6. Payment processed
7. Order created
8. Real-time notification sent

## Admin Features

- View all orders with customer details
- Update order status (triggers real-time notification)
- Manage products with variants and add-ons
- Manage categories
- Create and manage blogs (with SEO)
- View dashboard analytics:
  - Total orders
  - Total revenue
  - Orders by status
  - Recent orders
  - Product count
  - Category count

## Database Models

### User

- name, email, phone, location
- isVerified, otpHash, otpExpires

### Product

- name, description, price, category
- image, variants, addons
- isAvailable, rating, reviewCount

### Category

- name, description, image
- slug, displayOrder

### Cart

- user/sessionId
- items (with variants & addons)
- cartTotal

### Order

- user, items, subtotal, tax, deliveryFee
- totalAmount, status
- deliveryAddress, estimatedDeliveryTime
- orderNumber (auto-generated)

### Blog

- title, subtitle, description, content
- image, metaDescription, metaKeywords
- slug, author, isPublished
- views, category

### Payment

- order, user, amount
- paymentMethod, status
- transactionId, paidAt

### Notification

- user/admin, order
- type, title, message
- isRead, readAt

### Admin

- name, email, password (hashed)
- role, isActive

## SEO Optimization

All blog endpoints return proper metadata for Nuxt integration:

- `metaDescription` - Page meta description
- `metaKeywords` - Keywords for SEO
- `slug` - URL-friendly identifier
- `title`, `subtitle` - For meta tags

Frontend can use Nuxt `definePageMeta()` to set head tags.

## Error Handling

All endpoints return consistent error format:

```json
{
  "message": "Error description"
}
```

## Security Features

- JWT token authentication for admin
- Password hashing with bcrypt
- OTP hashing for email verification
- CORS enabled
- Input validation

## Notes

- Cloudinary free tier allows 25 uploads/month
- Consider AWS S3 for higher volume
- Email sending requires Gmail App Password
- WebSocket requires same-origin or CORS configuration
- All timestamps in UTC

## Troubleshooting

**MongoDB Connection Error:**

- Verify connection string in `.env`
- Check whitelist IP in MongoDB Atlas

**Email Not Sending:**

- Enable "Less secure app access" or use App Password
- Check email credentials in `.env`

**Image Upload Failing:**

- Add Cloudinary credentials
- Check file size limits

**WebSocket Not Connecting:**

- Verify FRONTEND_URL in `.env`
- Check CORS settings in server.js

## Future Enhancements

- [ ] Stripe payment integration
- [ ] SMS notifications
- [ ] Analytics tracking (Google Analytics integration)
- [ ] Customer reviews & ratings
- [ ] Inventory management
- [ ] Promo codes/coupons
- [ ] Admin user management
- [ ] Order export (CSV/PDF)
