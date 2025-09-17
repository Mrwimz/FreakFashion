import React, { useEffect, useState } from "react";
import adminService, { Category } from "../../services/adminService";

interface Product {
  id?: number;
  name: string;
  description: string;
  brand?: string;
  sku: string;
  price: number;
  publish_date: string;
  category_id: number;
  slug?: string;
}

const NewProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminService.getCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Simple slug generator
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with -
      .replace(/^-+|-+$/g, "");    // trim - from start/end
  };

  const handleAddProduct = async () => {
    // Validation
    if (!newProduct.name || newProduct.name.length > 25) {
      setError("Name is required and max 25 characters");
      return;
    }
    const skuPattern = /^[A-Z]{3}[0-9]{3}$/;

    if (!newProduct.sku || !skuPattern.test(newProduct.sku)) {
      setError("SKU must be exactly 3 uppercase letters followed by 3 numbers (e.g., ABC123)");
      return;
    }
    if (!newProduct.price || isNaN(newProduct.price)) {
      setError("Price is required and must be a number");
      return;
    }
    if (!newProduct.category_id) {
      setError("Please select a category");
      return;
    }
    if (!file) {
      setError("Please select an image (png or jpg)");
      return;
    }

    try {
      // Default publish date + slug
      const productToSend = {
        ...newProduct,
        publish_date: newProduct.publish_date || new Date().toISOString(),
        slug: slugify(newProduct.name || ""),
      };

      // 1️⃣ Add product to DB
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSend),
      });
      if (!res.ok) throw new Error("Failed to create product");

      const created: Product = await res.json();

      // 2️⃣ Upload image
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["png", "jpg", "jpeg"].includes(ext || "")) {
        throw new Error("Only PNG or JPG images are allowed");
      }

      const formData = new FormData();
      formData.append("image", file, `${created.id}.${ext}`);

      const uploadRes = await fetch(`http://localhost:5000/api/products/upload/${created.id}`, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Image upload failed");

      // Reset form
      setNewProduct({});
      setFile(null);
      setError(null);

      alert("Product added successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl p-4">
      <h1 className="text-xl font-bold mb-4">Ny produkt</h1>

      <div className="flex flex-col gap-3">
        {/* Namn */}
        <label>Namn</label>
        <input
          type="text"
          placeholder="Ange namn"
          value={newProduct.name || ""}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          maxLength={25}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />

        {/* Beskrivning */}
        <label>Beskrivning</label>
        <input
          type="text"
          placeholder="Ange beskrivning"
          value={newProduct.description || ""}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />

        {/* Bild */}
        <label>Bild</label>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />

        {/* Märke */}
        <label>Märke</label>
        <input
          type="text"
          value={newProduct.brand || ""}
          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />

        {/* SKU */}
        <label>SKU</label>
        <input
          type="text"
          placeholder="Ange SKU"
          value={newProduct.sku || ""}
          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
          className="p-2 border border-gray-300 rounded w-36 focus:outline-none focus:border-gray-500"
        />

        {/* Pris */}
        <label>Pris</label>
        <input
          type="number"
          value={newProduct.price || ""}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />

        {/* Publiseringsdatum */}
        <label>Publiseringsdatum</label>
        <input
          type="date"
          value={newProduct.publish_date?.split("T")[0] || ""}
          onChange={(e) => setNewProduct({ ...newProduct, publish_date: e.target.value })}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />

        {/* Kategori */}
        <label>Kategori</label>
        <select
          value={newProduct.category_id || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category_id: Number(e.target.value) })
          }
        >
          <option value="">Välj kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleAddProduct}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
        >
          Lägg till
        </button>
      </div>
    </div>
  );
};

export default NewProducts;