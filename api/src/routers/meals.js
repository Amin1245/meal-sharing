import express from "express";
import knex from "../database_client.js";

const router = express.Router();

async function getAvailableReservations(mealId) {
  const [totalGuestsResult] = await knex('reservation')
    .where('meal_id', mealId)
    .sum('number_of_guests as total_guests');
  return totalGuestsResult.total_guests || 0;
}

router.get("/", async (req, res) => {
  try {
    let query = knex("meal");

    const {
      maxPrice,
      availableReservations,
      title,
      dateAfter,
      dateBefore,
      limit,
      sortKey,
      sortDir,
    } = req.query;

    if (maxPrice) {
      query = query.where("price", "<=", parseFloat(maxPrice));
    }

    if (title) {
      query = query.where("title", "like", `%${title}%`);
    }

    if (dateAfter) {
      query = query.where("when", ">=", new Date(dateAfter));
    }

    if (dateBefore) {
      query = query.where("when", "<=", new Date(dateBefore));
    }

    let meals = await query.select("*");

    if (availableReservations === 'true') {
      const mealsWithAvailability = [];
      for (const meal of meals) {
        const totalGuests = await getAvailableReservations(meal.id);
        const spotsLeft = meal.max_reservations - totalGuests;
        if (spotsLeft > 0) {
          mealsWithAvailability.push({ ...meal, available_reservations: spotsLeft });
        }
      }
      meals = mealsWithAvailability;
    } else {
      const mealsWithAvailability = [];
      for (const meal of meals) {
        const totalGuests = await getAvailableReservations(meal.id);
        const spotsLeft = meal.max_reservations - totalGuests;
        mealsWithAvailability.push({ ...meal, available_reservations: spotsLeft });
      }
      meals = mealsWithAvailability;
    }

    if (sortKey) {
      const direction = sortDir && (sortDir.toLowerCase() === 'desc' || sortDir.toLowerCase() === 'descending') ? 'desc' : 'asc';
      meals.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (sortKey === 'price') {
          valA = parseFloat(valA);
          valB = parseFloat(valB);
        } else if (sortKey === 'when') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (limit) {
      meals = meals.slice(0, parseInt(limit, 10));
    }

    res.json(meals);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ error: "Error fetching meals" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const meal = await knex("meal").where({ id }).first();
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    const totalGuests = await getAvailableReservations(meal.id);
    const spotsLeft = meal.max_reservations - totalGuests;
    res.json({ ...meal, available_reservations: spotsLeft });
  } catch (err) {
    console.error("Error fetching meal:", err);
    res.status(500).json({ error: "Error fetching meal" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [newMeal] = await knex("meal").insert(req.body);
    res.status(201).json({ message: "Meal created", id: newMeal });
  } catch (err) {
    console.error("Error creating meal:", err);
    res.status(500).json({ error: "Error creating meal" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await knex("meal").where({ id }).update(req.body);
    if (!updated) return res.status(404).json({ error: "Meal not found" });
    res.json({ message: "Meal updated" });
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).json({ error: "Error updating meal" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await knex("meal").where({ id }).del();
    if (!deleted) return res.status(404).json({ error: "Meal not found" });
    res.json({ message: "Meal deleted" });
  } catch (err) {
    console.error("Error deleting meal:", err);
    res.status(500).json({ error: "Error deleting meal" });
  }
});

export default router;
