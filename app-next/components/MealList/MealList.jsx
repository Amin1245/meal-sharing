//comonent/maelList/MealList.jsx
"use client";
import React, { useEffect, useState } from "react";
import Meal from "../Meal/Meal";
import styles from "./MealList.module.css";

const MealsList = () => {
  const [meals, setMeals] = useState([]);


  const fetchMeals = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/meals");
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div>
      <h2>Meals</h2>
      <div className={styles.grid}>
        {meals.map((meal) => (
          <Meal
            key={meal.id}
            title={meal.title}
            description={meal.description}
            price={meal.price}
            when={meal.when}
            location={meal.location}
            maxReservations={meal.max_reservations}
          />
        ))}
      </div>
    </div>
  );
};

export default MealsList;

