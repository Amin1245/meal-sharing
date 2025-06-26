// components/Meal/Meal.jsx
"use client";
import React from "react";
import styles from "./Meal.module.css";

const Meal = ({ meal }) => {
  return (
    <div className={styles.card}>
      <h3>{meal.title}</h3>
      <p>{meal.description}</p>
      <p><strong>Price:</strong> {meal.price} DKK</p>
      <p><strong>Date:</strong> {new Date(meal.when).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {meal.location}</p>
      <p><strong>Max Reservations:</strong> {meal.max_reservations}</p>
    </div>
  );
};

export default Meal;
