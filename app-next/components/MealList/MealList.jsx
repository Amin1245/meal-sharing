"use client";
import React, { useEffect, useState } from "react";
import Meal from "../Meal/Meal";
import styles from "./MealList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  
  const localMealImages = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
  ];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        let url = `${API_BASE_URL}/meals?`;

        if (searchTerm) {
          url += `title=${encodeURIComponent(searchTerm)}&`;
        }
        if (sortKey) {
          url += `sortKey=${encodeURIComponent(sortKey)}&`;
          url += `sortDir=${encodeURIComponent(sortDir)}&`;
        }
        if (showAvailableOnly) {
          url += `availableReservations=true&`;
        }
        
        url = url.endsWith('?') ? url.slice(0, -1) : url.slice(0, -1); 
        if (url.endsWith('&')) { 
            url = url.slice(0, -1);
        }

        const res = await fetch(url);
        const data = await res.json();


        const mealsWithImages = data.map((meal) => ({
          ...meal,
         
          image_url: meal.image_url || localMealImages[(meal.id - 1) % localMealImages.length] || '/images/meal-placeholder.jpg'
        }));
        setMeals(mealsWithImages);
      } catch (err) {
        console.error("Error fetching meals:", err);
      }
    };

    fetchMeals();
  }, [searchTerm, sortKey, sortDir, showAvailableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>

        <div className={styles.sortControls}>
          <label htmlFor="sortKey">Sort by:</label>
          <select 
            id="sortKey"
            value={sortKey} 
            onChange={(e) => setSortKey(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="">None</option>
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="when">Date</option>
          </select>

          <label htmlFor="sortDir">Direction:</label>
          <select 
            id="sortDir"
            value={sortDir} 
            onChange={(e) => setSortDir(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
            Show available only
          </label>
        </div>
      </div>

      <div className={styles.grid}>
        {meals.map((meal) => (
          <Meal
            key={meal.id}
            id={meal.id}
            title={meal.title}
            description={meal.description}
            price={meal.price}
            when={meal.when}
            location={meal.location}
            maxReservations={meal.max_reservations}
            availableReservations={meal.available_reservations}
            image_url={meal.image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default MealsList;
