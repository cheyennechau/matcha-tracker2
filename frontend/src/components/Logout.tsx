"use client";

import { useRouter } from "next/navigation";
import { clearTokens } from "@/utils/auth";
import api from "@/utils/api";

export default function LogoutButton() {
    const router = useRouter();

    // Handle user logout
    const handleLogout = async () => {
        try {
            await api.post("/auth/logout"); // Call the backend logout endpoint
        } catch (error) {
            console.error("Logout failed:", error); // Debugging, logging logout failure
        }

        clearTokens(); // Clear stored auth tokens
        router.push("/login"); // Redirect to login page
    };

    return (
        <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded-md">
            Logout
        </button>
    );
}
