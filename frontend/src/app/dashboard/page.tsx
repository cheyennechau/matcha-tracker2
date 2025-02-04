"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type User = {
  id: string;
  email: string;
  role: string;
  totalSpent: number;
};

type Purchase = {
  id: number;
  location: string;
  drink: string;
  price: number;
  date: string;
  lat: number;
  lng: number;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, user is not authenticated");

        // Fetch user data
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!userRes.ok) throw new Error("Failed to fetch user data");

        const userData: User = await userRes.json();
        setUser(userData);

        // Fetch purchases
        const purchasesRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/purchases`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!purchasesRes.ok) throw new Error("Failed to fetch purchases");

        const data = await purchasesRes.json();
        // console.log('Raw purchase data:', data); // Debugging, logging raw API response

        if (Array.isArray(data)) {
          setPurchases(data);
          const total = data.reduce((sum: number, p: Purchase) => sum + (Number(p.price) || 0), 0);
          setUser(prevUser => prevUser ? { ...prevUser, totalSpent: total } : null);
        } else if (data.purchases) {
          setPurchases(data.purchases);
          const total = data.purchases.reduce((sum: number, p: Purchase) => sum + (Number(p.price) || 0), 0);
          setUser(prevUser => prevUser ? { ...prevUser, totalSpent: total } : null);
        }

      } catch (err) {
        setError("Error fetching data. Please try again later.");
        console.error("Fetch error:", err); // Debugging, log fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      {/* Purchases Stats or loading skeletons */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ) : !error && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Total Purchases</h2>
            <p className="text-2xl font-bold text-primary">{purchases?.length || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Total Spent</h2>
            <p className="text-2xl font-bold text-primary">${user?.totalSpent?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      )}

      {/* Line Chart */}
      {loading ? (
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      ) : !error && (
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-lg font-semibold mb-2">Purchase Frequency</h2>
          <Line
            data={{
              labels: [...new Set(purchases?.map((p) =>
                new Date(p.date.split('T')[0]).toLocaleDateString()
              ))].sort(),
              datasets: [{
                label: "Purchases",
                data: [...new Set(purchases?.map((p) => p.date.split('T')[0]))]
                  .sort()
                  .map(date => ({
                    x: new Date(date).toLocaleDateString(),
                    y: purchases.filter(p => p.date.split('T')[0] === date).length
                  })),
                borderColor: "#689141",
                backgroundColor: "#79a84d",
                tension: 0.4,
              }],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    callback: function (value) {
                      return Math.round(Number(value));
                    }
                  }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
