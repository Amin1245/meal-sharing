import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// GET /api/meals
router.get("/", async (req, res) => {
  try {
    const meals = await knex("meal").select("*");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Error fetching meals" });
  }
});

// GET /api/meals/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const meal = await knex("meal").where({ id }).first();
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: "Error fetching meal" });
  }
});

// POST /api/meals
router.post("/", async (req, res) => {
  try {
    const [newMeal] = await knex("meal").insert(req.body);
    res.status(201).json({ message: "Meal created", id: newMeal });
  } catch (err) {
    res.status(500).json({ error: "Error creating meal" });
  }
});

// PUT /api/meals/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await knex("meal").where({ id }).update(req.body);
    if (!updated) return res.status(404).json({ error: "Meal not found" });
    res.json({ message: "Meal updated" });
  } catch (err) {
    res.status(500).json({ error: "Error updating meal" });
  }
});

// DELETE /api/meals/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await knex("meal").where({ id }).del();
    if (!deleted) return res.status(404).json({ error: "Meal not found" });
    res.json({ message: "Meal deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting meal" });
  }
});

export default router;
