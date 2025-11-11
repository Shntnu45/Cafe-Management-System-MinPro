# ☕ Cafe Management System

A comprehensive full-stack web application for managing cafe operations, built with modern technologies and featuring role-based access control, real-time order tracking, and seamless payment processing.

## 🚀 Features

### 👥 User Features
- **User Registration & Authentication** - Secure JWT-based authentication system
- **Menu Browsing** - Browse categorized menu items with detailed information
- **Shopping Cart** - Add/remove items with quantity management
- **Table Reservation** - Select and reserve tables based on capacity and location
- **Order Placement** - Place orders with real-time status tracking
- **Payment Processing** - Secure payment handling with multiple options
- **Order History** - View past orders and account management

### 🔧 Admin Features
- **Admin Dashboard** - Comprehensive analytics and system overview
- **Menu Management** - Full CRUD operations for menu items and categories
- **Order Management** - Track and update order statuses in real-time
- **Table Management** - Manage table availability and configurations
- **Payment Tracking** - Monitor payments and generate reports
- **User Management** - Manage customer accounts and roles

### 🔒 Security Features
- **Protected Routes** - Role-based access control (Admin/Customer)
- **JWT Authentication** - Secure token-based session management
- **Input Validation** - Comprehensive client and server-side validation
- **CORS Configuration** - Secure cross-origin resource sharing

## 🛠️ Tech Stack

### Frontend
- **React.js 19.1.1** - Component-based UI library
- **Vite** - Fast build tool and development server
- **React Router DOM 7.9.5** - Client-side routing
- **Bootstrap 5.3.8** - Responsive UI framework
- **Axios 1.13.1** - HTTP client for API communication
- **React Toastify** - Toast notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **Sequelize 6.33.0** - ORM for database operations
- **MySQL2** - Database driver
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL** - Relational database management system

## 📁 Project Structure

```
Cafe Management System MinPro/
├── Backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── tableController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Menu.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Payment.js
│   │   ├── Table.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── tables.js
│   │   └── users.js
│   ├── utils/
│   │   └── helpers.js
│   ├── .env
│   ├── app.js
│   ├── server.js
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── Components/
    │   ├── Pages/
    │   │   ├── Admin/
    │   │   └── Users/
    │   ├── services/
    │   ├── context/
    │   ├── utils/
    │   └── assets/
    ├── public/
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cafe-management-system.git
   cd cafe-management-system
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```

4. **Database Configuration**
   - Create a MySQL database
   - Copy `.env.example` to `.env` in the Backend directory
   - Update the database configuration:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=cafe_management
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   PORT=5000
   ```

5. **Frontend Environment**
   - Create `.env` file in the Frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   Application will run on `http://localhost:5173`

### Default Credentials

The system creates default users on first run:

**Admin Account:**
- Email: `admin@cafe.com`
- Password: `admin123`

**Customer Account:**
- Email: `customer@cafe.com`
- Password: `customer123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Menu Management
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Order Management
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin)

### Table Management
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create table (Admin)
- `PUT /api/tables/:id` - Update table (Admin)
- `DELETE /api/tables/:id` - Delete table (Admin)

### Payment Processing
- `GET /api/payments` - Get payments
- `POST /api/payments` - Process payment

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🔧 Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🌟 Key Features Implemented

### Real-time Features
- ✅ Live order status updates
- ✅ Real-time table availability
- ✅ Dynamic payment tracking
- ✅ Instant notifications

### Security Features
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ Input validation and sanitization

### User Experience
- ✅ Responsive design for all devices
- ✅ Intuitive navigation and UI
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Form validation with user-friendly messages

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Configure database connection
3. Build and deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Update API URL in environment variables
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



---

⭐ **Star this repository if you found it helpful!** ⭐
