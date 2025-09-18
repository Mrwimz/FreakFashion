import React, { useState, useContext } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Hämta Context-setters
  const { setLikedProducts, setIsLoggedIn, setUserId } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users");
      const users = await res.json();

      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        setMessage(`Logged in as ${user.email}`);

        // Säkerställ att liked_products alltid är en array
        const likedProductsArray = Array.isArray(user.liked_products) ? user.liked_products : [];

        // Spara i localStorage
        localStorage.setItem("liked_products", JSON.stringify(likedProductsArray));
        localStorage.setItem("loggedInUserId", user.id);
        localStorage.setItem("isLoggedIn", "true");

        // Uppdatera Context direkt
        setLikedProducts(likedProductsArray);
        setUserId(user.id);
        setIsLoggedIn(true);

        navigate("/"); // Navigera till startsidan
      } else {
        setMessage("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <form className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <div className="relative mb-4">
          <Mail className="absolute left-2 top-1/2 -translate-y-1/2 scale-75 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Post"
            required
            className="pl-8 p-2 w-full border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="relative mb-4">
          <Lock className="absolute left-2 top-1/2 -translate-y-1/2 scale-75 text-gray-500" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="pl-8 p-2 w-full border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
          />
        </div>
        <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition-colors">
          Login
        </button>
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
        <button type="button" onClick={() => navigate("/register")} className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors">
          Registrera nytt konto
        </button>
      </form>
    </div>
  );
};

export default Login;
