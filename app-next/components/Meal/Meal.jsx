import React from "react";
import Link from "next/link";
import styles from "./Meal.module.css";

const Meal = ({ id, title, description, price, when, location, maxReservations, availableReservations, image_url }) => {
  return (
    <div className={styles.card}>
      {image_url && (
        <img
          src={image_url}
          alt={title}
          className={styles.mealImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/meal-placeholder.jpg";
          }}
        />
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      <p><strong>Price:</strong> {price} DKK</p>
      <p><strong>Date:</strong> {new Date(when).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Max Reservations:</strong> {maxReservations}</p>
      <p><strong>Available Spots:</strong> {availableReservations !== undefined ? availableReservations : 'N/A'}</p>
      <Link href={`/meals/${id}`} className={styles.viewDetailsButton}>
        View Details
      </Link>
    </div>
  );
};

export default Meal;
