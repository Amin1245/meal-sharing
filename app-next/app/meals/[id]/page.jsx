"use client"; 

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/footer';

const MealDetailPage = () => {
  const params = useParams();
  const id = params.id;

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationForm, setReservationForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    number_of_guests: 1,
  });
  const [reviewForm, setReviewForm] = useState({
    title: "",
    description: "",
    stars: 0,
  });
  const [message, setMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  const fetchMeal = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/meals/${id}`);
      const data = await res.json();
      setMeal(data);
    } catch (err) {
      console.error("Error fetching meal:", err);
      setMessage("Failed to load meal details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMeal();
    }
  }, [id]);

  const handleReservationChange = (e) => {
    setReservationForm({ ...reservationForm, [e.target.name]: e.target.value });
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!reservationForm.name || !reservationForm.email || !reservationForm.phonenumber || reservationForm.number_of_guests < 1) {
      alert("Please fill in all reservation fields and specify number of guests.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_name: reservationForm.name,
          contact_email: reservationForm.email,
          contact_phonenumber: reservationForm.phonenumber,
          meal_id: Number(id),
          number_of_guests: Number(reservationForm.number_of_guests),
          created_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        }),
      });

      if (res.ok) {
        alert("Reservation successful!");
        setMessage("Reservation successful!");
        setReservationForm({ name: "", email: "", phonenumber: "", number_of_guests: 1 });
        fetchMeal();
      } else {
        const errorData = await res.json();
        alert(`Failed to create reservation: ${errorData.message || res.statusText}`);
        setMessage(`Failed to create reservation: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Error posting reservation:", err);
      alert("An error occurred during reservation.");
      setMessage("An error occurred during reservation.");
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage("");

    if (!reviewForm.title || !reviewForm.description || reviewForm.stars === 0) {
      alert("Please fill in all review fields and give a star rating.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewForm, meal_id: Number(id) }),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        setReviewMessage("Review submitted successfully!");
        setReviewForm({ title: "", description: "", stars: 0 });
      } else {
        const errorData = await res.json();
        alert(`Failed to submit review: ${errorData.message || res.statusText}`);
        setMessage(`Failed to submit review: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Error posting review:", err);
      alert("An error occurred during review submission.");
      setMessage("An error occurred during review submission.");
    }
  };

  if (loading) return <p>Loading meal details...</p>;
  if (!meal) return <p>Meal not found</p>;

  const availableReservations = meal.max_reservations - (meal.total_reservations || 0);
  const hasAvailableSeats = availableReservations > 0;

  return (
    <>
      <Header />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
        <h1>{meal.title}</h1>
        <p>{meal.description}</p>
        <p><strong>Price:</strong> {meal.price} DKK</p>
        <p><strong>Date:</strong> {new Date(meal.when).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {meal.location}</p>
        <p><strong>Max Reservations:</strong> {meal.max_reservations}</p>
        <p><strong>Available Seats:</strong> {hasAvailableSeats ? availableReservations : 'No seats left!'}</p>

        {hasAvailableSeats ? (
          <>
            <h2>Reserve a seat</h2>
            <form onSubmit={handleReservationSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px", border: "1px solid #eee", padding: "1rem", borderRadius: "8px" }}>
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
                name="phonenumber"
                placeholder="Phone Number"
                value={reservationForm.phonenumber}
                onChange={handleReservationChange}
                required
              />
              <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                Number of Guests:
                <select
                  name="number_of_guests"
                  value={reservationForm.number_of_guests}
                  onChange={handleReservationChange}
                  required
                  style={{ padding: "5px" }}
                >
                  {Array.from({ length: availableReservations }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Book Seat</button>
            </form>
            {message && <p style={{ color: message.includes("successful") ? "green" : "red" }}>{message}</p>}
          </>
        ) : (
          <p style={{ color: "red", fontWeight: "bold" }}>Sorry, no seats available for this meal.</p>
        )}

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px dashed #ccc" }} />

        <h2>Leave a Review</h2>
        <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px", border: "1px solid #eee", padding: "1rem", borderRadius: "8px" }}>
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
          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            Stars:
            <input
              type="number"
              name="stars"
              min="1"
              max="5"
              value={reviewForm.stars}
              onChange={(e) => setReviewForm({ ...reviewForm, stars: Number(e.target.value) })}
              required
              style={{ width: "80px", marginLeft: "10px", padding: "5px" }}
            /> / 5
          </label>
          <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit Review</button>
        </form>
        {reviewMessage && <p style={{ color: reviewMessage.includes("successfully") ? "green" : "red" }}>{reviewMessage}</p>}
      </div>
      <Footer />
    </>
  );
};

export default MealDetailPage;
