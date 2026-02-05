const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const compression = require('compression');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blogs');
const notificationRoutes = require('./routes/notifications');
const paymentRoutes = require('./routes/payments');
const contactRoutes = require('./routes/contact');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// HTTP Caching Middleware
app.use((req, res, next) => {
  // Don't cache admin API endpoints - they need real-time updates
  if (req.url.startsWith('/api/admin')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  // Cache static assets for 1 week (immutable - never changes)
  else if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.set('Cache-Control', 'public, max-age=604800, immutable');
  }
  // Cache other API responses for 5 minutes
  else if (req.url.startsWith('/api/')) {
    res.set('Cache-Control', 'public, max-age=300');
  }
  // Don't cache admin pages
  else if (req.url.startsWith('/admin')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  // Default: cache for 1 hour
  else {
    res.set('Cache-Control', 'public, max-age=3600');
  }
  next();
});

// Make io accessible to route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Serve static files from public directory with caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1w',
  etag: false // Let Cache-Control headers handle freshness
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Join user room for personal notifications
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their notification room`);
  });

  // Join order room for order status updates
  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Socket joined order room: order-${orderId}`);
  });

  // Join admin room for notifications
  socket.on('join-admin', (adminId) => {
    socket.join(`admin-${adminId}`);
    console.log(`Admin ${adminId} joined admin notification room`);
  });

  // Join admin orders room
  socket.on('join-admin-orders', () => {
    socket.join('admin-orders');
    console.log('Socket joined admin-orders room');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
