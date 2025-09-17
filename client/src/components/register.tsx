import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(`Konto skapat! ID: ${data.id}`);
        setEmail("");
        setPassword("");
        // Optionally redirect to login page
        window.location.href = "/login";
      }
    } catch (err) {
      setMessage("Network error");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Registrera</h2>

        {/* Email */}
        <div className="relative mb-4">
          <Mail className="absolute left-2 top-1/2 -translate-y-1/2 scale-75 text-gray-500" />
          <input
            type="email"
            id="email"
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
            id="password"
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
          Registrera
        </button>

        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
