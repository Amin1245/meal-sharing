import express from "express";
import knex from "../database_client.js"; 

const router = express.Router();

// GET /api/reviews - Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await knex("review").select("*");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reviews/:id - Get a review by ID
router.get("/:id", async (req, res) => {
  try {
    const review = await knex("review").where({ id: req.params.id }).first();
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reviews/meal/:meal_id - Get reviews for a specific meal
router.get("/meal/:meal_id", async (req, res) => {
  try {
    const reviews = await knex("review").where({ meal_id: req.params.meal_id });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Create a new review
router.post("/", async (req, res) => {
  try {
    const [id] = await knex("review").insert(req.body);
    res.status(201).json({ id, message: "Review created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reviews/:id - Update a review by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await knex("review").where({ id: req.params.id }).update(req.body);
    if (updated) {
      res.json({ message: "Review updated successfully" });
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete a review by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await knex("review").where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
