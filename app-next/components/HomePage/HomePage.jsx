"use client";
import { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const HomePage = () => {
  const [meals, setMeals] = useState([]);

  const localMealImages = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
  ];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/meals`);
        const data = await res.json();
        const mealsWithImages = data.slice(0, 3).map((meal, index) => ({
          ...meal,
          image_url: localMealImages[index] || '/images/meal-placeholder.jpg'
        }));
        setMeals(mealsWithImages);
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
              {meal.image_url && (
                <img
                  src={meal.image_url}
                  alt={meal.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '15px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/meal-placeholder.jpg";
                  }}
                />
              )}
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
