import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminService, { Category } from "../../services/adminService";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id?: number) => {
    if (!id) return;
    try {
      await adminService.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <Link
        to="new"
        className="inline-block mb-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
      >
        Add New Category
      </Link>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {categories.length === 0 ? (
        <p>No categories yet.</p>
      ) : (
        <ul className="space-y-3">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 border p-2 rounded"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`http://localhost:5000/images/categories/${c.id}.png`}
                  alt={c.name}
                  className="w-16 h-16 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `http://localhost:5000/images/categories/${c.id}.jpg`;
                  }}
                />
                <span>{c.name}</span>
              </div>
              <button
                onClick={() => handleDeleteCategory(c.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categories;
