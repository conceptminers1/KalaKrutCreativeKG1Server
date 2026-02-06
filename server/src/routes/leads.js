
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/leads - Fetch all leads
router.get('/', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        user: true, // Include the full user object
      },
    });
    res.json(leads);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// POST /api/leads - Create a new lead
router.post('/', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Check if a lead already exists for this user
    const existingLead = await prisma.lead.findUnique({
      where: { userId },
    });

    if (existingLead) {
      return res.status(409).json({ error: 'This user is already a lead' });
    }

    // Create the new lead
    const newLead = await prisma.lead.create({
      data: {
        userId: userId,
        status: 'New', // Default status
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(newLead);
  } catch (error) {
    console.error('Failed to create lead:', error);
    // Handle cases where the user ID does not exist
    if (error.code === 'P2003') { // Foreign key constraint failed
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

export default router;
