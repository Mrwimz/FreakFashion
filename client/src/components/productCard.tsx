// src/components/ProductCard.tsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { HeartIcon } from "lucide-react";
import { Product } from "../services/adminService";
import { UserContext } from "../context/UserContext";

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean; // default true
}

const isNewProduct = (publish_date?: string) => {
  if (!publish_date) return false;
  const diffDays = (new Date().getTime() - new Date(publish_date).getTime()) / (1000*60*60*24);
  return diffDays <= 30;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, showNewBadge = true }) => {
  const { userId, likedProducts, setLikedProducts } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);

  // Sync initial like status
  useEffect(() => {
    if (!product.id) return;
    setIsLiked(likedProducts.includes(product.id));
  }, [likedProducts, product.id]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.id) return;

    // Guest: localStorage only
    if (!userId) {
      let localLikes: number[] = JSON.parse(localStorage.getItem("liked_products") || "[]");
      if (isLiked) localLikes = localLikes.filter(id => id !== product.id);
      else localLikes.push(product.id);

      localStorage.setItem("liked_products", JSON.stringify(localLikes));
      setLikedProducts(localLikes);
      setIsLiked(!isLiked);
      return;
    }

    // Logged-in: sync with DB + localStorage
    try {
      const adminService = (await import("../services/adminService")).default;
      let updatedLikes: number[];

      if (isLiked) updatedLikes = await adminService.unlikeProduct(userId, product.id);
      else updatedLikes = await adminService.likeProduct(userId, product.id);

      setLikedProducts(updatedLikes);
      localStorage.setItem("liked_products", JSON.stringify(updatedLikes));
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white relative hover:shadow-md transition">
      {/* Image */}
      <div className="relative">
        {showNewBadge && isNewProduct(product.publish_date) && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}

        <Link to={`/product/${product.slug}`}>
          <img
            src={`http://localhost:5000/images/products/${product.id}.png`}
            alt={product.name}
            className="w-full h-64 object-cover cursor-pointer"
            onError={(e) => (e.currentTarget as HTMLImageElement).src =
              `http://localhost:5000/images/products/${product.id}.jpg`}
          />
        </Link>

        <button
          className="absolute bottom-2 right-2 p-1 rounded-full bg-white shadow hover:scale-110 transition"
          aria-label="Toggle wishlist"
          onClick={toggleLike}
        >
          <HeartIcon className={`w-6 h-6 ${isLiked ? "fill-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex justify-between items-center">
          <p className="font-medium">{product.name}</p>
          <p className="font-semibold">{product.price} SEK</p>
        </div>
        {product.brand && <p className="text-sm text-gray-500">{product.brand}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
