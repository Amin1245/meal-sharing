"use client";

import MealsList from '../../components/MealList/MealList';

export default function MealsPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1>All Available Meals</h1>
      <MealsList />
    </div>
  );
}
