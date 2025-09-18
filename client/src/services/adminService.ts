// Base API URL
const API_BASE = "http://localhost:5000/api";

export interface Order {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  zip: string;
  city: string;
  newsletter: boolean;
  items: { id: number; name: string; price: number; quantity: number }[];
  total: number;
}

export interface Category {
  id?: number;
  name: string;
}

export interface Product {
  id?: number;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  publish_date?: string;
  sku?: string;
  image?: string;
  slug?: string;
  category_id?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  admin: number; // 1 = admin, 0 = not admin
  liked_products?: number[];
}

class AdminService {
  // ---------- Users ----------
  async likeProduct(userId: number, productId: number): Promise<number[]> {
    const res = await fetch(`${API_BASE}/users/${userId}/like/${productId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to like product");
    return res.json();
  }

  async unlikeProduct(userId: number, productId: number): Promise<number[]> {
    const res = await fetch(`${API_BASE}/users/${userId}/unlike/${productId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to unlike product");
    return res.json();
  }

  async getUserById(userId: number): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    const user: User = await res.json();
    user.liked_products = user.liked_products || [];
    return user;
  }

  // ---------- Categories ----------
  async addCategory(category: Category): Promise<Category> {
    this.validateCategory(category);
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to add category");
    return res.json();
  }

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  }

  async deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete category with id ${id}`);
  }

  // ---------- Products ----------
  async addProduct(product: Product): Promise<Product> {
    this.validateProduct(product);
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("Failed to add product: " + errorText);
    }
    return res.json();
  }

  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  }

  async getProductById(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch product with id ${id}`);
    return res.json();
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/slug/${slug}`);
    if (!res.ok) throw new Error(`Failed to fetch product with slug ${slug}`);
    return res.json();
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/category/${categoryId}`);
    if (!res.ok)
      throw new Error(`Failed to fetch products for category ${categoryId}`);
    return res.json();
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const res = await fetch(`${API_BASE}/products?ids=${ids.join(",")}`);
    if (!res.ok) throw new Error("Failed to fetch products by IDs");
    return res.json();
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim() === "") return [];
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error("Failed to fetch products for search");
    const allProducts: Product[] = await res.json();
    const lowerQuery = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(lowerQuery) ||
        p.brand?.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );
  }

  async getSimilarProducts(params: {
    brand?: string;
    category_id?: number;
    name?: string;
    limit?: number;
  }): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error("Failed to fetch products for similarity");
    const allProducts: Product[] = await res.json();
    const lowerBrand = params.brand?.toLowerCase() || "";
    const lowerName = params.name?.toLowerCase() || "";
    const categoryId = params.category_id;
    let filtered = allProducts.filter((p) => {
      const matchBrand = lowerBrand && p.brand?.toLowerCase() === lowerBrand;
      const matchCategory = categoryId && p.category_id === categoryId;
      const excludeName = lowerName && p.name?.toLowerCase() !== lowerName;
      return (matchBrand || matchCategory) && excludeName;
    });
    if (params.limit) filtered = filtered.slice(0, params.limit);
    return filtered;
  }

  // ---------- Orders ----------
  async createOrder(order: Order): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
  }

  // ---------- Validation ----------
  private validateCategory(category: Category) {
    if (!category.name || category.name.trim().length === 0) {
      throw new Error("Category name is required");
    }
  }

  private validateProduct(product: Product) {
    if (!product.name || product.name.trim().length === 0) {
      throw new Error("Product name is required");
    }
    if (product.price == null || product.price < 0) {
      throw new Error("Product price must be a positive number");
    }
    if (!product.category_id) {
      throw new Error("Product must belong to a category");
    }
    if (product.sku && !/^[A-Z]{3}[0-9]{3}$/.test(product.sku)) {
      throw new Error(
        "SKU must be exactly 3 uppercase letters followed by 3 numbers"
      );
    }
    if (product.slug && !/^[a-z0-9-]+$/.test(product.slug)) {
      throw new Error(
        "Slug must be lowercase letters, numbers, and hyphens only"
      );
    }
  }
}

const adminService: AdminService = new AdminService();
export default adminService;
