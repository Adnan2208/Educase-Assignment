import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import schoolRoutes from './routes/schools';
import { initDatabase } from './db';

dotenv.config();
const app = express();
const PORT = process.env.MYSQLPORT || 3000;

app.use(express.json());

app.use('/api/schools', schoolRoutes);

// Error handling middleware.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;