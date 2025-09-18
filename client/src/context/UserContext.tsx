// src/contexts/UserContext.tsx
import React, { createContext, useState, useEffect } from "react";


export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface UserContextType {
  userId: number | null;
  likedProducts: number[];
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  setLikedProducts: (ids: number[]) => void;
  setUserId: (id: number | null) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateCartItem: (id: number, quantity: number) => void;
  clearCart: () => void;
}


export const UserContext = createContext<UserContextType>({
  userId: null,
  likedProducts: [],
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  setLikedProducts: () => {},
  setUserId: () => {},
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItem: () => {},
  clearCart: () => {},
});


export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Ladda användardata och likes vid första render
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUserId");
    if (storedUser) setUserId(Number(storedUser));

    const storedLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(storedLoggedIn);

    // Se till att likedProducts alltid är en array vid första render
    const storedLikes = localStorage.getItem("liked_products");
    let likesArr: number[] = [];
    if (storedLikes) {
      try {
        const parsed = JSON.parse(storedLikes);
        if (Array.isArray(parsed)) {
          likesArr = parsed;
        } else if (typeof parsed === "string") {
          likesArr = parsed.split(",").map((id: string) => Number(id));
        }
      } catch {
        if (typeof storedLikes === "string") {
          likesArr = storedLikes.split(",").map((id) => Number(id));
        }
      }
    }
    setLikedProducts(likesArr);

    // Ladda varukorg från localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Spara varukorg till localStorage vid ändring och logga till konsolen
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("cart", cart);
  }, [cart]);

  // Ladda likedProducts från backend varje gång man loggar in
  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (isLoggedIn && userId) {
        try {
          const adminService = (await import("../services/adminService")).default;
          const user = await adminService.getUserById(userId);
          let likesArr: number[] = [];
          if (Array.isArray(user.liked_products)) {
            likesArr = user.liked_products;
          } else if (user.liked_products && typeof user.liked_products === "string") {
            likesArr = (user.liked_products as string).split(",").map((id: string) => Number(id));
          }
          localStorage.setItem("liked_products", JSON.stringify(likesArr));
          setLikedProducts(likesArr);
        } catch (err) {
          setLikedProducts([]);
        }
      } else if (isLoggedIn) {
        const storedLikes = localStorage.getItem("liked_products");
        let likesArr: number[] = [];
        if (storedLikes) {
          try {
            const parsed = JSON.parse(storedLikes);
            if (Array.isArray(parsed)) {
              likesArr = parsed;
            } else if (typeof parsed === "string") {
              likesArr = parsed.split(",").map((id: string) => Number(id));
            }
          } catch {
            if (typeof storedLikes === "string") {
              likesArr = storedLikes.split(",").map((id) => Number(id));
            }
          }
        }
        setLikedProducts(likesArr);
      }
    };
    fetchLikedProducts();
  }, [isLoggedIn, userId]);

  // Varukorgsmetoder
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateCartItem = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        likedProducts,
        isLoggedIn,
        setIsLoggedIn,
        setLikedProducts,
        setUserId,
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
