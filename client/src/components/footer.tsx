import React, { useState } from "react";
import { Globe2, Plane, Shield, Smile } from "lucide-react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3">
      <button
        className="w-full text-left py-2 px-4 font-bold text-gray-800 flex justify-between items-center border rounded-lg bg-white shadow-sm"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <span className="ml-2">{open ? "-" : "+"}</span>
      </button>
      {open && (
        <div className="border rounded-lg bg-gray-100 shadow-sm mt-2 px-4 py-2">
          {children}
        </div>
      )}
    </div>
  );
};

import { useEffect } from "react";
import { Link } from "react-router-dom";
import adminService, { Category } from "../services/adminService";

const Footer: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await adminService.getCategories();
        setCategories(cats);
      } catch (err) {
        // fallback: visa inga kategorier
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      {/* Ikoner utanför footer, vit bakgrund */}
      <div className="bg-white py-6 border-b">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-0 px-4 lg:px-8">
          <div className="flex items-center gap-2 justify-start">
            <Globe2 className="w-6 h-6 text-gray-700" />
            <span className="text-sm text-gray-700 font-medium">
              Gratis frakt & returer
            </span>
          </div>
          <div className="flex items-center gap-2 justify-start">
            <Plane className="w-6 h-6 text-gray-700" />
            <span className="text-sm text-gray-700 font-medium">
              Expressfrakt
            </span>
          </div>
          <div className="flex items-center gap-2 justify-start">
            <Shield className="w-6 h-6 text-gray-700" />
            <span className="text-sm text-gray-700 font-medium">
              Säkra betalningar
            </span>
          </div>
          <div className="flex items-center gap-2 justify-start">
            <Smile className="w-6 h-6 text-gray-700" />
            <span className="text-sm text-gray-700 font-medium">
              Nyheter varje dag
            </span>
          </div>
        </div>
      </div>

      <footer className="bg-gray-100 py-8 mt-0 border-t">
        <div className="container mx-auto">
          {/* Rubriker och text: desktop/iPad = rad, mobil = accordion */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 lg:px-8 mb-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-gray-800">Shopping</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>
                  <Link to="/news" className="hover:underline">Nyheter</Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${encodeURIComponent(cat.name)}`}
                      className="hover:underline"
                      onClick={() => {
                        setTimeout(() => {
                          const el = document.getElementById("product-list");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-gray-800">Mina sidor</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>
                  <Link to="/login" className="hover:underline">Logga in</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:underline">Registrera</Link>
                </li>
                <li>
                  <Link to="/favourites" className="hover:underline">Favoriter</Link>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-gray-800">Kundtjänst</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>Kontakt</li>
                <li>Retur & Byten</li>
                <li>Frakt</li>
                <li>Vanliga frågor</li>
              </ul>
            </div>
          </div>

          {/* Mobil: accordion */}
          <div className="sm:hidden px-4 mb-6">
            <Accordion title="Shopping">
              <ul className="space-y-1 text-gray-600 text-sm py-2">
                <li>
                  <Link
                    to="/news"
                    className="hover:underline"
                    onClick={() => {
                      setTimeout(() => {
                        const el = document.getElementById("product-list");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                  >
                    Nyheter
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${encodeURIComponent(cat.name)}`}
                      className="hover:underline"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Mina sidor">
              <ul className="space-y-1 text-gray-600 text-sm py-2">
                <li>
                  <Link to="/login" className="hover:underline">Logga in</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:underline">Registrera</Link>
                </li>
                <li>
                  <Link to="/favourites" className="hover:underline">Favoriter</Link>
                </li>
              </ul>
            </Accordion>
            <Accordion title="Kundtjänst">
              <ul className="space-y-1 text-gray-600 text-sm py-2">
                <li>Kontakt</li>
                <li>Retur & Byten</li>
                <li>Frakt</li>
                <li>Vanliga frågor</li>
              </ul>
            </Accordion>
          </div>
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} FreakFashion. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};
export default Footer;
