import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import adminService from "../../services/adminService";

const Admin: React.FC = () => {
  const storedUserId = localStorage.getItem("loggedInUserId");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        console.log("No loggedInUserId found in localStorage");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const user = await adminService.getUserById(userId);
        console.log("Fetched user data from backend:", user);
        setIsAdmin(user.admin === 1);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p className="p-4">Verifying admin status...</p>;

  if (!isAdmin) {
    console.log("Access denied — user is not admin");
    return (
      <div className="m-4 p-4 bg-red-500 text-white rounded">
        You don't have permission to access this page.
      </div>
    );
  }

  console.log("Access granted — user is admin");
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="bg-white shadow-md w-full md:w-64 p-4 flex md:flex-col justify-between md:justify-start">
        <h2 className="font-bold text-lg mb-4">Admin Portal</h2>
        <ul className="flex md:flex-col gap-2">
          <li>
            <Link
              to="/admin"
              className="block py-2 px-3 rounded hover:bg-gray-200 transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className="block py-2 px-3 rounded hover:bg-gray-200 transition"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/categories"
              className="block py-2 px-3 rounded hover:bg-gray-200 transition"
            >
              Categories
            </Link>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
