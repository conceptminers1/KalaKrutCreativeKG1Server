
console.log('Server script starting...');
import express from 'express';
import sqlite3 from 'sqlite3';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = './tmp/dev.db';
const dbDir = dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const app = express();
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE)`);
      db.run(`CREATE TABLE IF NOT EXISTS artist_profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER UNIQUE, bio TEXT, location TEXT, FOREIGN KEY (userId) REFERENCES users (id))`);
      db.run(`CREATE TABLE IF NOT EXISTS proposals (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, creatorId INTEGER, FOREIGN KEY (creatorId) REFERENCES users (id))`);
      db.run(`CREATE TABLE IF NOT EXISTS marketplace_items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, price REAL)`);
      db.run(`CREATE TABLE IF NOT EXISTS moderation_cases (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, reason TEXT, FOREIGN KEY (userId) REFERENCES users (id))`);
      db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, amount REAL, description TEXT, FOREIGN KEY (userId) REFERENCES users (id))`);
      db.run(`CREATE TABLE IF NOT EXISTS support_tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, subject TEXT, description TEXT, FOREIGN KEY (userId) REFERENCES users (id))`);
      db.run(`CREATE TABLE IF NOT EXISTS forum_threads (id INTEGER PRIMARY KEY AUTOINCREMENT, authorId INTEGER, title TEXT, body TEXT, FOREIGN KEY (authorId) REFERENCES users (id))`);
      db.run(`CREATE TABLE IF NOT EXISTS treasury_assets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, balance REAL)`);
      db.run(`CREATE TABLE IF NOT EXISTS staff_members (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, role TEXT)`);
      db.run(`CREATE TABLE IF NOT EXISTS equity_opportunities (id INTEGER PRIMARY KEY AUTOINCREMENT, artistProfileId INTEGER, title TEXT, description TEXT, FOREIGN KEY (artistProfileId) REFERENCES artist_profiles (id))`);
      db.run(`CREATE TABLE IF NOT EXISTS lead_queries (id INTEGER PRIMARY KEY AUTOINCREMENT, artistProfileId INTEGER, query TEXT, FOREIGN KEY (artistProfileId) REFERENCES artist_profiles (id))`);
    });
  }
});

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World! The server is running.'));

// User API
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create user' });
    res.status(201).json({ id: this.lastID, name, email });
  });
});

// Artist API
app.get('/api/artists', (req, res) => {
  db.all('SELECT * FROM artist_profiles', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/artists', (req, res) => {
  const { userId, bio, location } = req.body;
  db.run('INSERT INTO artist_profiles (userId, bio, location) VALUES (?, ?, ?)', [userId, bio, location], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create artist profile' });
    res.status(201).json({ id: this.lastID, userId, bio, location });
  });
});

// Proposal API
app.get('/api/proposals', (req, res) => {
  db.all('SELECT * FROM proposals', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/proposals', (req, res) => {
  const { title, description, creatorId } = req.body;
  db.run('INSERT INTO proposals (title, description, creatorId) VALUES (?, ?, ?)', [title, description, creatorId], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create proposal' });
    res.status(201).json({ id: this.lastID, title, description, creatorId });
  });
});

// Marketplace API
app.get('/api/marketplace-items', (req, res) => {
  db.all('SELECT * FROM marketplace_items', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/marketplace-items', (req, res) => {
  const { title, description, price } = req.body;
  db.run('INSERT INTO marketplace_items (title, description, price) VALUES (?, ?, ?)', [title, description, price], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create marketplace item' });
    res.status(201).json({ id: this.lastID, title, description, price });
  });
});

// Moderation API
app.get('/api/moderation-cases', (req, res) => {
  db.all('SELECT * FROM moderation_cases', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/moderation-cases', (req, res) => {
  const { userId, reason } = req.body;
  db.run('INSERT INTO moderation_cases (userId, reason) VALUES (?,?)', [userId, reason], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create moderation case' });
    res.status(201).json({ id: this.lastID, userId, reason });
  });
});

// Transaction API
app.get('/api/transactions', (req, res) => {
  db.all('SELECT * FROM transactions', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/transactions', (req, res) => {
  const { userId, amount, description } = req.body;
  db.run('INSERT INTO transactions (userId, amount, description) VALUES (?,?,?)', [userId, amount, description], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create transaction' });
    res.status(201).json({ id: this.lastID, userId, amount, description });
  });
});

// Support Ticket API
app.get('/api/support-tickets', (req, res) => {
  db.all('SELECT * FROM support_tickets', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/support-tickets', (req, res) => {
  const { userId, subject, description } = req.body;
  db.run('INSERT INTO support_tickets (userId, subject, description) VALUES (?,?,?)', [userId, subject, description], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create support ticket' });
    res.status(201).json({ id: this.lastID, userId, subject, description });
  });
});

// Forum Thread API
app.get('/api/forum-threads', (req, res) => {
  db.all('SELECT * FROM forum_threads', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/forum-threads', (req, res) => {
  const { authorId, title, body } = req.body;
  db.run('INSERT INTO forum_threads (authorId, title, body) VALUES (?,?,?)', [authorId, title, body], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create forum thread' });
    res.status(201).json({ id: this.lastID, authorId, title, body });
  });
});

// Treasury Asset API
app.get('/api/treasury-assets', (req, res) => {
  db.all('SELECT * FROM treasury_assets', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/treasury-assets', (req, res) => {
  const { name, balance } = req.body;
  db.run('INSERT INTO treasury_assets (name, balance) VALUES (?,?)', [name, balance], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create treasury asset' });
    res.status(201).json({ id: this.lastID, name, balance });
  });
});

// Staff Member API
app.get('/api/staff-members', (req, res) => {
  db.all('SELECT * FROM staff_members', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/staff-members', (req, res) => {
  const { name, role } = req.body;
  db.run('INSERT INTO staff_members (name, role) VALUES (?,?)', [name, role], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create staff member' });
    res.status(201).json({ id: this.lastID, name, role });
  });
});

// Equity Opportunity API
app.get('/api/equity-opportunities', (req, res) => {
  db.all('SELECT * FROM equity_opportunities', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/equity-opportunities', (req, res) => {
  const { artistProfileId, title, description } = req.body;
  db.run('INSERT INTO equity_opportunities (artistProfileId, title, description) VALUES (?,?,?)', [artistProfileId, title, description], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create equity opportunity' });
    res.status(201).json({ id: this.lastID, artistProfileId, title, description });
  });
});

// Lead Query API
app.get('/api/lead-queries', (req, res) => {
  db.all('SELECT * FROM lead_queries', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Something went wrong' });
    res.json(rows);
  });
});
app.post('/api/lead-queries', (req, res) => {
  const { artistProfileId, query } = req.body;
  db.run('INSERT INTO lead_queries (artistProfileId, query) VALUES (?,?)', [artistProfileId, query], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create lead query' });
    res.status(201).json({ id: this.lastID, artistProfileId, query });
  });
});

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});
