// components/HomePage/HomePage.jsx
"use client";
import { useState, useEffect } from "react";
import styles from "./HomePage.module.css"; 
import Link from "next/link";

const HomePage = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/meals");
        const data = await res.json();
        setMeals(data.slice(0, 3)); 
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to Meal Sharing</h1>
        <p className={styles.subtitle}>Find and share meals with people around you.</p>
      </header>

      <section className={styles.mealsSection}>
        <h2>Popular Meals</h2>
        <div className={styles.mealsGrid}> 
          {meals.map((meal) => (
            <div key={meal.id} className={styles.mealCard}> 
              <h3>{meal.title}</h3>
              <p>{meal.description}</p>
              <p><strong>Price:</strong> {meal.price} DKK</p>
              <Link href={`/meals/${meal.id}`} className={styles.viewMealButton}>
                View Meal
              </Link>
            </div>
          ))}
        </div>
        <Link href="/meals" className={styles.seeMoreButton}>
          See All Meals
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
