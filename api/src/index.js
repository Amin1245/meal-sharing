    // api/src/index.js
    import "dotenv/config";
    import express from "express";
    import cors from "cors";
    import bodyParser from "body-parser";
    import knex from "./database_client.js"; // Make sure database_client.js path is correct

    import mealsRouter from "./routers/meals.js";
    import reservationsRouter from "./routers/reservations.js";
    import reviewsRouter from "./routers/reviews.js";

    const app = express();
    const port = process.env.PORT || 3001;

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://meal-sharing-483d.onrender.com',
    ];

    app.use(cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }));

    app.use(bodyParser.json());

    // --- Add this Health Check endpoint ---
    app.get("/api/health", (req, res) => {
      res.status(200).json({ status: "ok", message: "Backend is healthy" });
    });
    // ------------------------------------

    // Special routes (from your original code)
    app.get("/api/future-meals", async (req, res, next) => {
      try {
        const meals = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
        res.json(meals[0]);
      } catch (err) {
        next(err); // Pass error to middleware
      }
    });

    app.get("/api/past-meals", async (req, res, next) => {
      try {
        const meals = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
        res.json(meals[0]);
      } catch (err) {
        next(err); // Pass error to middleware
      }
    });

    app.get("/api/all-meals", async (req, res, next) => {
      try {
        const meals = await knex.raw("SELECT * FROM meal ORDER BY id");
        res.json(meals[0]);
      } catch (err) {
        next(err); // Pass error to middleware
      }
    });

    app.get("/api/first-meal", async (req, res, next) => {
      try {
        const meals = await knex.raw("SELECT * FROM meal ORDER BY id ASC LIMIT 1");
        if (meals[0].length === 0) {
          return res.status(404).json({ error: "No meals found" });
        }
        res.json(meals[0][0]);
      } catch (err) {
        next(err); // Pass error to middleware
      }
    });

    app.get("/api/last-meal", async (req, res, next) => {
      try {
        const meals = await knex.raw("SELECT * FROM meal ORDER BY id DESC LIMIT 1");
        if (meals[0].length === 0) {
          return res.status(404).json({ error: "No meals found" });
        }
        res.json(meals[0][0]);
      } catch (err) {
        next(err); // Pass error to middleware
      }
    });

    // Basic route for the root path
    app.get('/', (req, res) => {
      res.send('Welcome to the Meal Sharing API!');
    });

    // Mount routers
    app.use("/api/meals", mealsRouter);
    app.use("/api/reservations", reservationsRouter);
    app.use("/api/reviews", reviewsRouter);

    // Error handling middleware (should be the last app.use)
    app.use((err, req, res, next) => {
      console.error("Caught unhandled error:", err);
      if (res.headersSent) {
        return next(err);
      }
      res.status(500).json({ error: "An unexpected error occurred." });
    });

    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
    