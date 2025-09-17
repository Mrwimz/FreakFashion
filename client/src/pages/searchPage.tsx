import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService, { Product } from "../services/adminService";
import ProductList from "../components/ProductList";

const SearchPage: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    adminService
      .searchProducts(query)
      .then((res) => {
        const filtered = res.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.brand?.toLowerCase() || "").includes(query.toLowerCase())
        );
        setProducts(filtered);
      })
      .catch((err) => {
        console.error("Search failed:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  // Meddelande ovanför listan: antal träffar
  const messageAboveList =
    !loading && query && products.length > 0
      ? `Hittade ${products.length} ${products.length === 1 ? "produkt" : "produkter"} som matchade "${query}"`
      : "";

  // Meddelande när listan är tom
  const emptyMessage =
    !loading && query && products.length === 0
      ? `Inga produkter hittades för "${query}"`
      : "";

  return (
    <ProductList
      products={products}
      loading={loading}
      emptyMessage={emptyMessage}
      messageAboveList={messageAboveList} // Visas ovanför listan när produkter finns
    />
  );
};

export default SearchPage;
