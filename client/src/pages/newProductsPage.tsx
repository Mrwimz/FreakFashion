import React, { useEffect, useState } from "react";
import adminService, { Product } from "../services/adminService";
import ProductList from "../components/ProductList";

const NewProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const isNewProduct = (publishDate?: string) => {
    if (!publishDate) return false;
    const today = new Date();
    const publish = new Date(publishDate);
    const diffDays =
      (today.getTime() - publish.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7; // Products published in the last 7 days
  };

  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await adminService.getProducts();
        const newProducts = allProducts.filter((p) =>
          isNewProduct(p.publish_date)
        );
        setProducts(newProducts);
      } catch (err) {
        console.error("Failed to fetch new products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="text-4xl font-bold text-center mb-6">Nyheter</h1>
      <ProductList
        products={products}
        loading={loading}
        emptyMessage="Inga nya produkter hittades."
        showNewBadge={false}
      />
    </div>
  );
};

export default NewProductsPage;
