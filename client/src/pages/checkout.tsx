import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import adminService from "../services/adminService";

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useContext(UserContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = {
        firstName,
        lastName,
        email,
        street,
        zip,
        city,
        newsletter,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: totalSum,
      };
      await adminService.createOrder(order);
      clearCart();
      navigate("/conformation");
    } catch (err) {
      alert("Kunde inte skapa order. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Kassan</h1>
      {/* Produkter */}
      <div className="mb-8">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Din varukorg är tom.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-semibold">{item.price * item.quantity} SEK</span>
              </div>
            ))}
            <div className="flex justify-end mt-2">
              <span className="text-lg font-bold">Totalt: {totalSum} SEK</span>
            </div>
          </div>
        )}
      </div>
      {/* Kunduppgifter */}
      <form onSubmit={handleOrder} className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold mb-2">Kunduppgifter</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Förnamn"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Efternamn"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />
        {/* Adress */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Adress</h3>
          <input
            type="text"
            placeholder="Gata"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            className="border rounded px-3 py-2 w-full mb-2"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Postnummer"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Stad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>
        {/* Nyhetsbrev */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          />
          Jag vill ta emot nyhetsbrev.
        </label>
        {/* Köp-knapp */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded mt-2 hover:bg-gray-800 disabled:opacity-50"
          disabled={loading || cart.length === 0}
        >
          {loading ? "Köper..." : "Köp"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
