import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js";



const app = express();
app.use(cors());
app.use(bodyParser.json());

// Special routes (future/past/first/last meals)
app.get("/api/future-meals", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
    res.json(meals[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching future meals" });
  }
});

app.get("/api/past-meals", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
    res.json(meals[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching past meals" });
  }
});

app.get("/api/all-meals", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM meal ORDER BY id");
    res.json(meals[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching all meals" });
  }
});

app.get("/api/first-meal", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM meal ORDER BY id ASC LIMIT 1");
    if (meals[0].length === 0) {
      return res.status(404).json({ error: "No meals found" });
    }
    res.json(meals[0][0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching first meal" });
  }
});

app.get("/api/last-meal", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM meal ORDER BY id DESC LIMIT 1");
    if (meals[0].length === 0) {
      return res.status(404).json({ error: "No meals found" });
    }
    res.json(meals[0][0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching last meal" });
  }
});

//  Mount routers
app.use("/api/meals", mealsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/reviews", reviewsRouter);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});