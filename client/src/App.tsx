import Hero from "./components/hero";
import adminService, { Product } from "./services/adminService";
import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
      const productsData = await adminService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Run only once

  return (
    <>
      <Hero
        image={
          "https://i.imgur.com/tGcspKL.jpeg"
        }
        title={"Freaky Fashion"}
        text={
         "Hos Freaky Fashion hittar du plagg som vågar tänja på gränserna och uttrycka din unika stil. Från djärva färger till lekfulla mönster och oväntade detaljer – varje plagg är skapat för dig som inte vill smälta in. Utforska vår kollektion och låt din personlighet synas i varje outfit."
        }
      />

      {/* Use reusable ProductList component */}
      <ProductList
        products={products}
        loading={loading}
        emptyMessage="Inga produkter hittades."
      />
    </>
  );
};

export default App;