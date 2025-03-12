import pool from "../config/db.config";


const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Database Connected Successfully!");
    client.release(); // Release connection back to pool
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
  }
};

testDbConnection();
