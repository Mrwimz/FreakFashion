import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Fetch all users from server
      const res = await fetch("http://localhost:5000/api/users");
      const users = await res.json();

      // Simple credential check
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        setMessage(`Logged in as ${user.email}`);
        window.location.href = "/"; // Redirect to home page

        localStorage.setItem("liked_products", JSON.stringify(user.liked_products ? user.liked_products : []));
        
        // Store user identifier in local storage
        localStorage.setItem("loggedInUserId", user.id);
        // Set a flag to indicate that the user is logged in
        localStorage.setItem("isLoggedIn", "true");

        
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

        {/* Email */}
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

        {/* Password */}
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

        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition-colors"
        >
          Login
        </button>

        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
