import "server-only";
import mongoose from "mongoose";
import { env } from "@/config";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

/** Serverless-friendly timeouts (login itself does not wait on Mongo). */
const CONNECT_OPTS = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 12_000,
  connectTimeoutMS: 12_000,
  socketTimeoutMS: 45_000,
  maxPoolSize: 10,
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
