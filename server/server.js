import 'dotenv/config';

import express from 'express';
import projectRoutes from './routes/projectRoutes.js';
import supabase from './db/db.js';
const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Test API
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Adina Solar Solutions Backend is working!',
  });
});

// Projects API
app.use('/api/projects', projectRoutes);

// Database test
app.get('/api/db-test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('connection_test').select('*');

    if (error) {
      throw error;
    }

    res.json({
      message: 'Supabase database connected successfully!',
      data: data,
    });
  } catch (error) {
    console.error('DATABASE ERROR:', error);

    res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
