"use client";
import React, { useEffect, useState } from "react";

type Purchase = {
  id: string;
  location: string;
  drink: string;
  price: number;
  date: string;
  rating: number;
  image?: string;
};

const LogHistory = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, user is not authenticated");

        // Fetch purchase data
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/purchases`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch purchases");

        const data: Purchase[] = await response.json();
        setPurchases(data);
      } catch (err) {
        setError("Error fetching purchases. Please try again later.");
        // console.error("Fetch error:", err); // Debugging, logging fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Matcha Purchase Log</h1>

      {/* {Loading or error messages} */}
      {loading && <p className="text-gray-600">Loading purchases...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Dynamic Grid Layout for Cards */}
      <div className="w-full max-w-5xl grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-center space-y-4"
          >
            {/* {Image, if exists} */}
            {purchase.image && (
              <img
                src={purchase.image}
                alt={purchase.drink}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="text-center">
              <h2 className="text-xl font-semibold">{purchase.drink}</h2>
              <p className="text-gray-600"><strong>Location:</strong> {purchase.location}</p>
              <p className="text-gray-600"><strong>Price:</strong> ${Number(purchase.price).toFixed(2)}</p>
              <p className="text-gray-600"><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
              <p className="text-gray-600"><strong>Rating:</strong> ⭐ {purchase.rating} / 5</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogHistory;
