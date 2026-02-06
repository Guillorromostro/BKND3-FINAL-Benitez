require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./lib/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const { uri, inMemory } = await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(`MongoDB connected: ${uri}${inMemory ? ' (in-memory)' : ''}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
