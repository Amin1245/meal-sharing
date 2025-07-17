"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from './page.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL; 

const MealDetailPage = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reservationForm, setReservationForm] = useState({
    name: "",
    email: "",
    phone: "",
    number_of_guests: 1,
  });
  const [reviewForm, setReviewForm] = useState({
    title: "",
    description: "",
    stars: 0,
  });
  const [hoverStars, setHoverStars] = useState(0); 

  const fetchMeal = async (showLoadingIndicator = false) => {
    if (showLoadingIndicator) {
      setLoading(true);
    }
    try {
      const res = await fetch(`${API_BASE_URL}/meals/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setMeal(data);
    } catch (err) {
      console.error("Error fetching meal:", err);
      setMessage("Failed to load meal details.");
    } finally {
      if (showLoadingIndicator) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchMeal(true); 

      const intervalId = setInterval(() => {
        fetchMeal(false); 
      }, 5000); 

      return () => clearInterval(intervalId);
    }
  }, [id]); 

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!reservationForm.name || !reservationForm.email || !reservationForm.phone || reservationForm.number_of_guests < 1) {
      setMessage("Please fill in all reservation fields and specify number of guests.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_name: reservationForm.name,
          contact_email: reservationForm.email,
          contact_phone: reservationForm.phone,
          meal_id: Number(id),
          number_of_guests: Number(reservationForm.number_of_guests),
          created_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      setMessage("Reservation successful!");
      fetchMeal(); 
      setReservationForm({ name: "", email: "", phone: "", number_of_guests: 1 }); 
    } catch (err) {
      console.error("Error submitting reservation:", err);
      setMessage(`Failed to submit reservation: ${err.message}`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage("");

    if (!reviewForm.title || !reviewForm.description || reviewForm.stars === 0) {
      setReviewMessage("Please fill in all review fields and give a star rating.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewForm,
          meal_id: Number(id),
          created_date: new Date().toISOString().slice(0, 19).replace("T", " ")
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      setReviewMessage("Review submitted successfully!");
      setReviewForm({ title: "", description: "", stars: 0 }); 
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewMessage(`Failed to submit review: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center py-8">Loading meal details...</div>;
  if (!meal) return <div className="text-center py-8 text-red-500">Meal not found.</div>;

  const availableReservations = meal.available_spots !== undefined ? meal.available_spots : (meal.max_reservations - (meal.total_reservations || 0));
  const hasAvailableSeats = availableReservations > 0;


  return (
    <div className={styles.detailContainer}>
      <h1>{meal.title}</h1>
      {meal.image_url && (
        <img
          src={meal.image_url}
          alt={meal.title}
          className={styles.mealImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/meal-placeholder.jpg";
          }}
        />
      )}
      <p>{meal.description}</p>
      <p><strong>Price:</strong> {meal.price} DKK</p>
      <p><strong>Date:</strong> {new Date(meal.when).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {meal.location}</p>
      <p><strong>Max Reservations:</strong> {meal.max_reservations}</p>
      <p>
        <strong>Available Spots:</strong>{" "}
        {hasAvailableSeats ? availableReservations : "No seats left!"}
      </p>

      {hasAvailableSeats ? (
        <>
          <h2>Reserve a seat</h2>
          <form onSubmit={handleReservationSubmit} className={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={reservationForm.name}
              onChange={handleReservationChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={reservationForm.email}
              onChange={handleReservationChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={reservationForm.phone}
              onChange={handleReservationChange}
              required
            />
            <label className={styles.guestLabel}>
              Number of Guests:
              <select
                name="number_of_guests"
                value={reservationForm.number_of_guests}
                onChange={handleReservationChange}
                required
                className={styles.guestSelect}
              >
                {Array.from({ length: availableReservations }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className={styles.primaryButton}>Book Seat</button>
          </form>
          {message && <p className={message.includes("successful") ? styles.successMessage : styles.errorMessage}>{message}</p>}
        </>
      ) : (
        <p className={styles.noSeatsMessage}>Sorry, no seats available for this meal.</p>
      )}

      <hr className={styles.divider} />

      <h2>Leave a Review</h2>
      <form onSubmit={handleReviewSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Review Title"
          value={reviewForm.title}
          onChange={handleReviewChange}
          required
        />
        <textarea
          name="description"
          placeholder="Your review..."
          value={reviewForm.description}
          onChange={handleReviewChange}
          rows="4"
          required
        ></textarea>
        <div className={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <span
              key={starIndex}
              className={`${styles.star} ${
                (starIndex <= reviewForm.stars || starIndex <= hoverStars) ? styles.filled : ''
              }`}
              onMouseEnter={() => setHoverStars(starIndex)}
              onMouseLeave={() => setHoverStars(0)}
              onClick={() => setReviewForm({ ...reviewForm, stars: starIndex })}
            >
              ★
            </span>
          ))}
        </div>
        <button type="submit" className={styles.secondaryButton}>Submit Review</button>
      </form>
      {reviewMessage && <p className={reviewMessage.includes("successful") ? styles.successMessage : styles.errorMessage}>{reviewMessage}</p>}
    </div>
  );
};

export default MealDetailPage;
