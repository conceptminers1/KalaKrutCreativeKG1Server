
console.log('Server script starting...');
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// --- Main Application Logic ---
async function main() {
  console.log('Connecting to the database...');
  // Test the database connection before starting the server
  await prisma.$connect();
  console.log('Successfully connected to the database.');

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World! The server is running.');
  });

  app.get('/api/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const { name, email } = req.body;
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Cloud Run requires the server to listen on 0.0.0.0
  const host = '0.0.0.0';
  // Use the PORT environment variable provided by Cloud Run, fallback to 8080
  const port = process.env.PORT || 8080;

  app.listen(port, host, () => {
    console.log(`Server is listening on ${host}:${port}`);
  });
}

// --- Start the Application ---
main()
  .catch((e) => {
    console.error('Application failed to start', e);
    process.exit(1);
  })
  .finally(async () => {
    // Ensure Prisma Client is disconnected on exit
    await prisma.$disconnect();
  });
