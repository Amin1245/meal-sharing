"use client";
import React, { useEffect, useState } from "react";
import Meal from "../Meal/Meal";
import styles from "./MealList.module.css";
//this test
const MealsList = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const res = await fetch("http://localhost:3001/api/meals");
      const data = await res.json();
      setMeals(data);
    };

    fetchMeals();
  }, []);

  return (
    <div>
      <h2>Meals</h2>
      <div className={styles.grid}>
        {meals.map((meal) => (
          <Meal key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default MealsList;
