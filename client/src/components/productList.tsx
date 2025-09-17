// src/components/ProductList.tsx
import React, { useContext } from "react";
import { Product } from "../services/adminService";
import ProductCard from "./productCard";
import { UserContext } from "../context/UserContext";

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  messageAboveList?: string; // nytt prop
  showNewBadge?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading = false, emptyMessage, showNewBadge = true }) => {
  if (loading) return <p className="p-4 text-center">Laddar produkter...</p>;
  if (!products.length) return <p className="p-4 text-center">{emptyMessage}</p>;

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 p-4">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} showNewBadge={showNewBadge} />
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
