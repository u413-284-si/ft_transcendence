import fp from "fastify-plugin";
import Database from "better-sqlite3";
import env from "./env.js";

async function dbConnector(fastify, options) {
  const dbFile = env.dbFile || "../../db/pong.db";
  const db = new Database(dbFile, { verbose: console.log });

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

		CREATE TABLE IF NOT EXISTS scores (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER REFERENCES users(id),
			score INTEGER NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);
  `);

  fastify.decorate("db", db);

  fastify.addHook("onClose", (fastify, done) => {
    db.close();
    done();
  });

  console.log("Database and tables created successfully");
}

export default fp(dbConnector);
