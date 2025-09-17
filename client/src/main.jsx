import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { UserProvider } from "./context/UserContext.tsx"

import Header from "./components/header.jsx";
import App from "./App.tsx";
import Register from "./components/register.tsx";
import Login from "./components/login.tsx";

import Admin from "./components/admin/admin";
import Products from "./components/admin/products";
import NewProduct from "./components/admin/newProduct.tsx";
import Categories from "./components/admin/categories";
import NewCategory from "./components/admin/newCategory.tsx";

import ProductPage from "./pages/productPage.tsx";
import SearchPage from "./pages/searchPage.tsx";
import CategoryPage from "./pages/categoryPage.tsx";
import NewProductsPage from "./pages/newProductsPage.tsx";
import FavouritesPage from "./pages/favouritesPage.tsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
      <Header />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Page routes  */}
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/news" element={<NewProductsPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<div>Welcome to Admin Dashboard</div>} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<NewProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<NewCategory />} />
        </Route>
      </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
