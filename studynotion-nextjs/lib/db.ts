import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const MONGODB_URL = process.env.MONGODB_URL;
  if (!MONGODB_URL) {
    throw new Error(
      "Please define the MONGODB_URL environment variable in .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URL, opts).then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const err = e as NodeJS.ErrnoException & { syscall?: string };
    if (err?.syscall === "querySrv" || err?.code === "ECONNREFUSED") {
      throw new Error(
        `MongoDB SRV DNS lookup failed (${err?.code ?? "DNS"} ${err?.syscall ?? ""}). ` +
          `Your DNS server refused '_mongodb._tcp.<cluster>.mongodb.net'. ` +
          `Fix: use a non-SRV connection string (mongodb://<shards>/db?ssl=true&replicaSet=...&authSource=admin) in MONGODB_URL, ` +
          `or set DNS to 8.8.8.8. Original: ${err?.message}`
      );
    }
    throw e;
  }

  return cached.conn;
}
