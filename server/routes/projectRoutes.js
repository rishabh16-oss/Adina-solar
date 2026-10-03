import express from 'express';

const router = express.Router();

// GET all projects
router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Residential Solar Installation',
      location: 'Indore',
      capacity: '10 kW',
    },
    {
      id: 2,
      title: 'Commercial Solar Installation',
      location: 'Bhopal',
      capacity: '50 kW',
    },
  ]);
});

export default router;
