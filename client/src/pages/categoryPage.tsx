import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService, { Product, Category } from "../services/adminService";
import ProductList from "../components/ProductList";

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;

    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all categories and find the one matching the URL
        const categories: Category[] = await adminService.getCategories();
        const matchedCategory = categories.find(
          (c) => c.name.toLowerCase() === category.toLowerCase()
        );

        if (!matchedCategory || !matchedCategory.id) {
          setProducts([]);
          setError(`Kategori "${category}" hittades inte.`);
          return;
        }

        // Fetch products in this category
        const productsData = await adminService.getProductsByCategory(
          matchedCategory.id
        );
        setProducts(productsData);
      } catch (err: any) {
        console.error(err);
        setError("Något gick fel vid hämtning av produkter.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [category]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {error
          ? "Kategori saknas"
          : category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : "Kategori"}
      </h1>
      <ProductList
        products={products}
        loading={loading}
        emptyMessage={error || `Inga produkter hittades i kategorin "${category}"`}
      />
    </div>
  );
};

export default CategoryPage;