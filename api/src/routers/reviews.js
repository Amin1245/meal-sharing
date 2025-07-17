import express from "express";
import knex from "../database_client.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reviews = await knex("review").select("*");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const review = await knex("review").where({ id: req.params.id }).first();
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    res.status(500).json({ error: "Error fetching review" });
  }
});

router.get("/meal/:meal_id", async (req, res) => {
  try {
    const reviews = await knex("review").where({ meal_id: req.params.meal_id });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews for meal:", error);
    res.status(500).json({ error: "Error fetching reviews for meal" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [id] = await knex("review").insert(req.body);
    res.status(201).json({ id, message: "Review created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Error creating review" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await knex("review").where({ id: req.params.id }).update(req.body);
    if (updated) {
      res.json({ message: "Review updated successfully" });
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Error updating review" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await knex("review").where({ id }).del();
    if (!deleted) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Error deleting review" });
  }
});

export default router;
