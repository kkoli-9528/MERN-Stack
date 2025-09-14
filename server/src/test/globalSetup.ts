import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import config from "../config/config.ts";
import { seedTasks, seedUsers } from "./seed.ts";

const globalSetup = async () => {
  if (config.Memory) {
    // Config to decide if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf("/"));
  } else {
    process.env.MONGO_URI = `mongodb://${config.IP}:${config.Port}`;
  }

  // The following is to make sure the database is clean before a test suite starts
  const conn = await mongoose.connect(
    `${process.env.MONGO_URI}/${config.Database}`
  );
  if (conn.connection.db) await conn.connection.db.dropDatabase();
  await seedUsers();
  await seedTasks();
  await mongoose.disconnect();
};

export default globalSetup;
