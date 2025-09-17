// src/contexts/UserContext.tsx
import React, { createContext, useState, useEffect } from "react";

interface UserContextType {
  userId: number | null;
  likedProducts: number[];
  setLikedProducts: (ids: number[]) => void;
}

export const UserContext = createContext<UserContextType>({
  userId: null,
  likedProducts: [],
  setLikedProducts: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUserId");
    if (storedUser) setUserId(Number(storedUser));

    const storedLikes = localStorage.getItem("liked_products");
    if (storedLikes) setLikedProducts(JSON.parse(storedLikes));
  }, []);

  return (
    <UserContext.Provider value={{ userId, likedProducts, setLikedProducts }}>
      {children}
    </UserContext.Provider>
  );
};
