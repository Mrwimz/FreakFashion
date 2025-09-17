import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  LogInIcon,
  SearchIcon,
} from "lucide-react";
import adminService, { Category } from "../services/adminService";

type NavItem = { name: string; href: string };

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await adminService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="p-4">
      <div className="md:flex md:flex-row">
        {/* Logo */}
        <div className="w-full md:w-fit flex items-center justify-center">
          <Link to="/" className="flex items-center">
            <img className="h-16" src="/logo_1.png" alt="My PNG" />
          </Link>
        </div>

        {/* Search + Icons */}
        <div className="flex items-center justify-between gap-x-4 md:gap-x-0 md:w-full py-4 md:py-0 md:pl-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-64">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 scale-75 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök produkter..."
              className="pl-8 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500 w-full"
            />
          </form>
          <div className="flex gap-2">
            <HeartIcon />
            <ShoppingCartIcon />
            <LogInIcon />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="md:flex gap-2 py-4">
          {/* Static links */}
          <li key="news">
            <Link to="/news" className="hover:underline">
              Nyheter
            </Link>
          </li>

          {/* Dynamic categories */}
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="hover:underline"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
