
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import leadsRouter from './routes/leads.js';

console.log('Server script starting...');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// API Routes
app.use('/api/leads', leadsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

// Start the server
const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected.');
  process.exit(0);
});
