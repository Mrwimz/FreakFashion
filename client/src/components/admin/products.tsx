import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");

      // Update UI
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <Link
        to="new"
        className="inline-block mb-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
      >
        Add New Product
      </Link>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 border p-2 rounded"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`http://localhost:5000/images/products/${p.id}.png`}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `http://localhost:5000/images/products/${p.id}.jpg`;
                  }}
                />
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm">{p.brand}</p>
                  <p>${p.price}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteProduct(p.id)}
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

export default Products;
