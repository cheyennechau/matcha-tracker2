"use client";

import { Menu, X, Home, List, PlusCircle, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// Define navbar props type
type NavbarProps = {
  isNavOpen: boolean;
  setIsNavOpen: (open: boolean) => void;
};

export default function Navbar({ isNavOpen, setIsNavOpen }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide navbar on login and signup pages
  // if (pathname === "/login" || pathname === "/signup") { // hide navbar on loging and signup pages
  //   return null;
  // }

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Logout failed");

      await router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error); // Debugging, logging logout error
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div
        className={`${isNavOpen ? "w-60" : "w-16"
          } h-screen bg-white shadow-lg transition-all duration-300 flex flex-col fixed left-0 top-0 z-50`}
      >
        {/* Navbar Toggle */}
        <div className={`p-4 flex ${isNavOpen ? "justify-end" : "justify-center"} items-center w-full`}>
          <button className="p-2 rounded-md hover:bg-gray-100" onClick={() => setIsNavOpen(!isNavOpen)}>
            {/* X if Navbar is expanded */}
            {isNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col space-y-4 flex-1 justify-center items-center mx-auto">
          <NavItem href="/" label="Home" icon={<Home size={24} />} isNavOpen={isNavOpen} pathname={pathname} />
          <NavItem href="/dashboard" label="Dashboard" icon={<LayoutDashboard size={24} />} isNavOpen={isNavOpen} pathname={pathname} />
          <NavItem href="/log-history" label="Log History" icon={<List size={24} />} isNavOpen={isNavOpen} pathname={pathname} />
          <NavItem href="/add-purchase" label="Add Purchase" icon={<PlusCircle size={24} />} isNavOpen={isNavOpen} pathname={pathname} />
        </nav>

        {/* <nav className="flex flex-col space-y-4 flex-1 justify-center items-center mx-auto">
          <Link
            href="/"
            className={`flex items-center ${
              isNavOpen ? "justify-start pl-4" : "justify-center"
            } p-3 rounded-lg hover:bg-gray-200 ${
              pathname === "/" ? "bg-gray-200" : ""
            } ${isNavOpen ? "w-52" : "w-12"}`}
          >
            <Home size={24} />
            {isNavOpen && <span className="ml-3">Home</span>}
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center ${
              isNavOpen ? "justify-start pl-4" : "justify-center"
            } p-3 rounded-lg hover:bg-gray-200 ${
              pathname === "/dashboard" ? "bg-gray-200" : ""
            } ${isNavOpen ? "w-52" : "w-12"}`}
          >
            <LayoutDashboard size={24} />
            {isNavOpen && <span className="ml-3">Dashboard</span>}
          </Link>
          <Link
            href="/log-history"
            className={`flex items-center ${
              isNavOpen ? "justify-start pl-4" : "justify-center"
            } p-3 rounded-lg hover:bg-gray-200 ${
              pathname === "/log-history" ? "bg-gray-200" : ""
            } ${isNavOpen ? "w-52" : "w-12"}`}
          >
            <List size={24} />
            {isNavOpen && <span className="ml-3">Log History</span>}
          </Link>
          <Link
            href="/add-purchase"
            className={`flex items-center ${
              isNavOpen ? "justify-start pl-4" : "justify-center"
            } p-3 rounded-lg hover:bg-gray-200 ${
              pathname === "/add-purchase" ? "bg-gray-200" : ""
            } ${isNavOpen ? "w-52" : "w-12"}`}
          >
            <PlusCircle size={24} />
            {isNavOpen && <span className="ml-3">Add Purchase</span>}
          </Link>
        </nav> */}

        {/* Logout */}
        <div className="p-4 mt-auto flex justify-center w-full">
          <button
            onClick={handleLogout}
            className={`flex items-center ${isNavOpen ? "justify-start pl-4 w-52" : "justify-center w-12"
              } p-3 rounded-lg hover:bg-red-200 text-red-600`}
          >
            <LogOut size={24} />
            {isNavOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable navigation item component
function NavItem({ href, label, icon, isNavOpen, pathname }: { href: string; label: string; icon: React.ReactNode; isNavOpen: boolean; pathname: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center ${isNavOpen ? "justify-start pl-4" : "justify-center"
        } p-3 rounded-lg hover:bg-gray-200 ${pathname === href ? "bg-gray-200" : ""
        } ${isNavOpen ? "w-52" : "w-12"}`}
    >
      {icon}
      {isNavOpen && <span className="ml-3">{label}</span>}
    </Link>
  );
}