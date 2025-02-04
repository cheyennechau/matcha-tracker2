'use client';

import { useEffect, useState } from "react";

export default function AddPurchase() {
  // Define backend URL and fallback to localhost if not provided
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  // Log the backend URL, alert if missing
  useEffect(() => {
    // console.log("Using Backend URL:", backendUrl); // Debugging
    if (!backendUrl) {
      alert("Backend URL is missing. Please check your environment variables.");
    }
  }, []);

  // State to hold form data
  const [formData, setFormData] = useState({
    location: "",
    drink: "",
    price: "",
    date: "",
    rating: "",
    image: null as File | null,
  });

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload

    // console.log("Submitting purchase to:", backendUrl); // Debugging, log submission URL

    if (!backendUrl) {
      alert("Backend URL is missing. Please check your environment variables.");
      return;
    }

    try {
      // Create FormData object for submission
      const formDataToSend = new FormData();
      formDataToSend.append("location", formData.location);
      formDataToSend.append("drink", formData.drink);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("rating", formData.rating);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Send request to backend
      const response = await fetch(`${backendUrl}/api/purchases`, {
        method: "POST",
        body: formDataToSend, // Automatically handles form-data
      });

      // console.log("Response status:", response.status); // Debugging, log response status

      if (!response.ok) {
        throw new Error("Failed to add purchase");
      }

      const data = await response.json();
      // console.log("Purchase added:", data); // debugging, log response data
      alert("Purchase added successfully!");

      // Reset form fields after submission
      setFormData({
        location: "",
        drink: "",
        price: "",
        date: "",
        rating: "",
        image: null,
      });
    } catch (error) {
      // console.error("Error adding purchase:", error); // Debugging, log error if submission unsuccessful
      alert("Failed to add purchase. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Add Matcha Purchase</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg space-y-4"
        encType="multipart/form-data"
      >
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-outlineColor"
            required
          />
        </div>

        {/* Drink Order */}
        <div>
          <label htmlFor="drink" className="block text-sm font-medium text-gray-700">
            Drink Order
          </label>
          <input
            type="text"
            id="drink"
            name="drink"
            value={formData.drink}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-outlineColor"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-outlineColor"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-outlineColor"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            min="1"
            max="5"
            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-outlineColor"
            placeholder="Rate 1-5"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-outlineColor"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary-color text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-300"
        >
          Add Purchase
        </button>
      </form>
    </div>
  );
}
