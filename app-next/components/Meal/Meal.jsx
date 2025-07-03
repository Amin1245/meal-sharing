import React from "react";
import styles from "./Meal.module.css";

const Meal = ({ title, description, price, when, location, maxReservations }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p><strong>Price:</strong> {price} DKK</p>
      <p><strong>Date:</strong> {new Date(when).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Max Reservations:</strong> {maxReservations}</p>
    </div>
  );
};

export default Meal;
