import { MongoClient } from "mongodb";

// Load environment variables from .env
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.ATLAS_URI);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("sample_training");
const grades = db.collection("grades");
// Single-field index on class_id
grades.createIndex({ class_id: 1 });

// Single-field index on learner_id
grades.createIndex({ learner_id: 1 });

// Compound index on class_id and learner_id
grades.createIndex({ class_id: 1, learner_id: 1 });
export default db;
