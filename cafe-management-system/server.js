import { app, initializeDatabase } from './app.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(` Cafe Management System Server is running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(` Default Admin: admin@cafe.com / admin123`);
      console.log(` Default Customer: customer@cafe.com / customer123`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!  Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!  Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});

startServer();