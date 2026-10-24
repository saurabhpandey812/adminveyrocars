import "server-only";
import mongoose from "mongoose";
import { env } from "@/config";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

/** Fast fail on serverless — don't hang login/pages for 10s+ */
const CONNECT_OPTS = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS: 5_000,
  socketTimeoutMS: 20_000,
  maxPoolSize: 5,
} as const;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!global.__mongooseConn) {
    global.__mongooseConn = mongoose.connect(env.mongodbUri, CONNECT_OPTS);
  }
  try {
    return await global.__mongooseConn;
  } catch (err) {
    global.__mongooseConn = undefined;
    throw err;
  }
}
