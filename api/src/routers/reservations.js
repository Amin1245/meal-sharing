import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// GET /api/reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservation").select("*");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Error fetching reservations" });
  }
});

// GET /api/reservations/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await knex("reservation").where({ id }).first();
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: "Error fetching reservation" });
  }
});

// POST /api/reservations
router.post("/", async (req, res) => {
  try {
    const [newReservation] = await knex("reservation").insert(req.body);
    res.status(201).json({ message: "Reservation created", id: newReservation });
  } catch (err) {
    res.status(500).json({ error: "Error creating reservation" });
  }
});

// PUT /api/reservations/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await knex("reservation").where({ id }).update(req.body);
    if (!updated) return res.status(404).json({ error: "Reservation not found" });
    res.json({ message: "Reservation updated" });
  } catch (err) {
    res.status(500).json({ error: "Error updating reservation" });
  }
});

// DELETE /api/reservations/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await knex("reservation").where({ id }).del();
    if (!deleted) return res.status(404).json({ error: "Reservation not found" });
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting reservation" });
  }
});

export default router;
