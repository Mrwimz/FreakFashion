import React, { useContext, useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import adminService, { Product } from "../services/adminService";
import { UserContext } from "../context/UserContext";

const FavouritesPage: React.FC = () => {
  const { likedProducts } = useContext(UserContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (!likedProducts.length) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch each product by ID (or you can implement batch endpoint)
        const allProducts = await Promise.all(
          likedProducts.map((id) => adminService.getProductById(id))
        );
        setProducts(allProducts);
      } catch (err) {
        console.error("Failed to fetch liked products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, [likedProducts]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Favourites</h1>
      <ProductList products={products} loading={loading} emptyMessage="No favourites yet." />
    </div>
  );
};

export default FavouritesPage;
