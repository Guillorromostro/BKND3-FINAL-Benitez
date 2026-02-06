const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    await mongoose.connect(mongoUri);
    return { uri: mongoUri, inMemory: false };
  }
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  await mongoose.connect(uri);
  return { uri, inMemory: true };
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}

module.exports = { connectDB, disconnectDB };
