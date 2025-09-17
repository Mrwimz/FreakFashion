import React, { useState } from "react";
import adminService from "../../services/adminService";

const newCategory = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    if (!file) {
      setError("Please select an image (png or jpg)");
      return;
    }

    try {
      // 1️⃣ Create category in DB
      const created = await adminService.addCategory({ name });

      // 2️⃣ Upload image with forced filename [id].ext
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["png", "jpg", "jpeg"].includes(ext || "")) {
        throw new Error("Only PNG and JPG images are allowed");
      }

      const formData = new FormData();
      formData.append("image", file, `${created.id}.${ext}`);

      const res = await fetch("http://localhost:5000/api/categories/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Image upload failed");

      // Reset form
      setName("");
      setFile(null);
      setError(null);
      alert("Category added successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl p-4">
      <h1 className="text-xl font-bold mb-4">Ny kategori</h1>

      <div className="flex flex-col gap-3">
        <label>Namn</label>
        <input
          type="text"
          placeholder="Ange namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />

        <label>Bild</label>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleAddCategory}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
        >
          Lägg till
        </button>
      </div>
    </div>
  );
};

export default newCategory;
