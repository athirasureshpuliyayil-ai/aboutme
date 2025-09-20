import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// --- Connect to SQLite DB (creates messages.db file if not exist) ---
let db;
(async () => {
  db = await open({
    filename: "messages.db",
    driver: sqlite3.Database
  });

  // Create table if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      message TEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ SQLite ready");
})();

// --- Save contact form messages ---
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await db.run(
      "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );
    res.json({ success: true, message: "Form saved to SQLite!" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, message: "Error saving message" });
  }
});

// --- (Optional) View all messages in browser ---
app.get("/messages", async (req, res) => {
  const rows = await db.all("SELECT * FROM messages ORDER BY date DESC");
  res.json(rows);
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
