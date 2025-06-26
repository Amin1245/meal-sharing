"use client";
import React, { useState, useEffect } from "react";

const MealsList = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div>
      <h2>Meals</h2>
      {meals.map((meal) => (
        <div key={meal.id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
          <h3>{meal.title}</h3>
          <p>{meal.description}</p>
          <p>Price: {meal.price} DKK</p>
        </div>
      ))}
    </div>
  );
};

export default MealsList;
