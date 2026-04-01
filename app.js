const express = require("express");
const { Pool } = require("pg");

const app = express();

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "testdb",
  password: "postgres",
  port: 5432,
});

// Slow API (no optimization)
app.get("/slow-orders", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE status = 'completed'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching slow orders");
  }
});

// Fast API (optimized with index)
app.get("/fast-orders", async (req, res) => {
  try {
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_status ON orders(status)"
    );

    const result = await pool.query(
      "SELECT * FROM orders WHERE status = 'completed'"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching fast orders");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
