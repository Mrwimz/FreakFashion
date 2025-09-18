import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeartIcon, ShoppingCartIcon, LogInIcon } from "lucide-react";
import adminService, { Category } from "../services/adminService";
import { UserContext } from "../context/UserContext";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [likesLoading, setLikesLoading] = useState(true);
  const navigate = useNavigate();
  const { likedProducts, isLoggedIn, setIsLoggedIn, cart, clearCart } = useContext(UserContext);

  // Kontrollera inloggning (om UserContext inte hanterar det själv)
  useEffect(() => {
    if (typeof isLoggedIn === "undefined" && setIsLoggedIn) {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    }
  }, [setIsLoggedIn, isLoggedIn]);

  useEffect(() => {
    // likesLoading sätts till false när likedProducts laddats
    setLikesLoading(false);
  }, [likedProducts]);

  // Hämta kategorier
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

  const { setLikedProducts } = useContext(UserContext);
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("liked_products");
    localStorage.removeItem("cart");
    if (setIsLoggedIn) setIsLoggedIn(false);
    if (setLikedProducts) setLikedProducts([]);
    if (clearCart) clearCart();
    navigate("/login");
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
        <div className="flex items-center justify-between gap-4 md:gap-0 md:w-full py-4 md:py-0 md:pl-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök produkter..."
              className="pl-8 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500 w-full"
            />
          </form>
          <div className="flex gap-3 items-center">
            {/* Heart Icon */}
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/favourites")}
            >
              <HeartIcon />
              {isLoggedIn && !likesLoading && likedProducts && likedProducts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {likedProducts.length}
                </span>
              )}
            </div>

            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/basket")}
            >
              <ShoppingCartIcon />
              {cart && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>

            {/* Logga in / Logga ut */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
              >
                Logga ut
              </button>
            ) : (
              <LogInIcon
                className="cursor-pointer"
                onClick={() => navigate("/login")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="md:flex gap-2 py-4">
          <li key="news">
            <Link to="/news" className="hover:underline">
              Nyheter
            </Link>
          </li>
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
