import "server-only";
import mongoose from "mongoose";
import { env } from "@/config";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!global.__mongooseConn) {
    global.__mongooseConn = mongoose.connect(env.mongodbUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
    });
  }
  try {
    return await global.__mongooseConn;
  } catch (err) {
    global.__mongooseConn = undefined;
    throw err;
  }
}
