import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI environment variable is not defined.');
    console.warn('💡 [MongoDB] Backend is running in resilient in-memory mode. Set MONGODB_URI on Render to enable permanent persistence.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`📦 [MongoDB] Database name: ${conn.connection.name}`);
    return true;
  } catch (err: any) {
    console.error('❌ [MongoDB] Connection error:', err.message);
    console.warn('💡 [MongoDB] Operating with fallback memory storage until valid MONGODB_URI is provided.');
    isConnected = false;
    return false;
  }
};

export const isDatabaseConnected = (): boolean => isConnected;
