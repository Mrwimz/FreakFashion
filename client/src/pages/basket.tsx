import React, { useContext } from "react";
import { UserContext, CartItem } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Trash2Icon } from "lucide-react";

const BasketPage: React.FC = () => {
  const { cart, removeFromCart, updateCartItem } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRemove = async (id: number) => {
    // TODO: Anropa backend för att ta bort varan
    removeFromCart(id);
  };

  const handleQuantityChange = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    // TODO: Anropa backend för att uppdatera antal
    updateCartItem(id, quantity);
  };

  const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48">
          <h1 className="text-2xl font-bold mb-4 text-center">Din varukorg</h1>
          <p className="text-center text-gray-500">Varukorgen är tom.</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 text-left">Din varukorg</h1>
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p>{item.price} SEK</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobil/iPad: plus/minus-knappar */}
                  <div className="flex items-center gap-1 md:hidden">
                    <button
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Minska antal"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                      className="w-12 border rounded px-2 py-1 text-center"
                      style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                    />
                    <button
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      aria-label="Öka antal"
                    >
                      +
                    </button>
                  </div>
                  {/* Desktop: endast inputfält */}
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    className="w-16 border rounded px-2 py-1 md:block hidden text-center"
                    style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                  />
                  <span className="font-bold">{item.price * item.quantity} SEK</span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemove(item.id)}
                    title="Ta bort"
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <span className="text-lg font-bold">Totalt: {totalSum} SEK</span>
            </div>
            <button
              className="w-full bg-black text-white py-3 rounded mt-6 hover:bg-gray-800"
              onClick={() => navigate("/checkout")}
            >
              Gå till kassan
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BasketPage;
