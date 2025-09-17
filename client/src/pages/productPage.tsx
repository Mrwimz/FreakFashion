import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import adminService, { Product } from "../services/adminService";
import ProductCard from "../components/productCard";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!slug) return;
        const data = await adminService.getProductBySlug(slug);
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product) return;
      setLoadingSimilar(true);

      try {
        const data = await adminService.getSimilarProducts({
          brand: product.brand,
          category_id: product.category_id,
          name: product.name,
          limit: 10,
        });

        const filtered = data.filter((p: Product) => p.id !== product.id);
        setSimilarProducts(filtered);
      } catch (err) {
        console.error("Failed to fetch similar products", err);
        setSimilarProducts([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarProducts();
  }, [product]);

  if (loading) return <p className="p-4 text-center">Laddar produkten...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  if (!product) return <p className="p-4 text-center">Produkten hittades inte.</p>;

  // Show 3 products at a time
  const visibleProducts = similarProducts.slice(currentIndex, currentIndex + 3);

  return (
    <div className="flex flex-col gap-24 mx-auto w-full p-4">
  {/* Main product */}
  <div className="flex flex-col md:flex-row md:items-start md:justify-start md:gap-16">
  {/* Product image */}
  <div className="md:w-1/2">
    <img
      src={`http://localhost:5000/images/products/${product.id}.png`}
      alt={product.name}
      className="h-auto max-h-[1000px] object-contain rounded"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (img.src.endsWith(".png")) {
          img.src = `http://localhost:5000/images/products/${product.id}.jpg`;
        } else if (img.src.endsWith(".jpg")) {
          img.src = `http://localhost:5000/images/products/${product.id}.jpeg`;
        }
      }}
    />
  </div>

  {/* Product details */}
  <div className="md:w-1/2 flex flex-col justify-center text-left mt-6 md:mt-0">
    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
    {product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>}
    <p className="mb-2">{product.description}</p>
    <p className="font-semibold text-lg mb-4">{product.price} SEK</p>
    <button
      className="w-full md:w-60 border border-black text-black bg-transparent px-4 py-2 rounded hover:bg-black hover:text-white transition-colors"
      onClick={() => console.log("Lägg i varukorgen clicked")}
    >
      Lägg i varukorgen
    </button>
  </div>
</div>

  {/* Similar products carousel */}
<div>
  <h2 className="text-xl font-semibold mb-6 text-center">
    Liknande produkter
  </h2>

  {loadingSimilar ? (
    <p className="text-center">Laddar liknande produkter...</p>
  ) : similarProducts.length === 0 ? (
    <p className="text-center">Inga liknande produkter hittades.</p>
  ) : (
    <div className="flex items-center justify-center gap-6">
      {/* Left arrow */}
      <button
        onClick={() =>
          setCurrentIndex((prev) =>
            prev === 0 ? similarProducts.length - 3 : prev - 1
          )
        }
        className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100 transition disabled:opacity-30"
      >
        ←
      </button>

      {/* Product list */}
      <div className="flex gap-6 overflow-hidden">
        {visibleProducts.map((p) => (
          <div key={p.id} className="min-w-[17.5rem]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() =>
          setCurrentIndex((prev) =>
            prev >= similarProducts.length - 3 ? 0 : prev + 1
          )
        }
        className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100 transition disabled:opacity-30"
      >
        →
      </button>
    </div>
  )}
</div>
</div>

  );
};

export default ProductPage;
