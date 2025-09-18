import React, { useContext, useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import adminService, { Product } from "../services/adminService";
import { UserContext } from "../context/UserContext";

const FavouritesPage: React.FC = () => {
  const { likedProducts, isLoggedIn } = useContext(UserContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [likesLoading, setLikesLoading] = useState(true);

  // ÄNDRING: Lägg till isLoggedIn som dependency så att sidan laddar om efter login
  useEffect(() => {
    console.log("likedProducts in FavouritesPage:", likedProducts);
    setLikesLoading(true);
    const fetchLikedProducts = async () => {
      const liked = Array.isArray(likedProducts) ? likedProducts : [];
      if (liked.length === 0) {
        setProducts([]);
        setLoading(false);
        setLikesLoading(false);
        return;
      }

      try {
        const allProducts = await Promise.all(
          liked.map((id) => adminService.getProductById(id))
        );
        console.log("Fetched products for favourites:", allProducts);
        setProducts(allProducts);
      } catch (err) {
        console.error("Failed to fetch liked products:", err);
      } finally {
        setLoading(false);
        setLikesLoading(false);
      }
    };

    fetchLikedProducts();
  }, [likedProducts, isLoggedIn]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Favourites</h1>
      {likesLoading ? (
        <div className="text-center py-8 text-gray-500">Loading favourites...</div>
      ) : (
        <ProductList products={products} loading={loading} emptyMessage="No favourites yet." />
      )}
    </div>
  );
};

export default FavouritesPage;
