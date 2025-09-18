import React from "react";

interface SpotProps {
  image: string;
  text: string;
  link: string;
}

const Spot: React.FC<SpotProps> = ({ image, text, link }) => (
  <a href={link} className="relative block group overflow-hidden rounded-lg shadow hover:shadow-lg transition">
    <img src={image} alt={text} className="w-full h-64 object-cover" />
    <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold drop-shadow-lg">
      {text}
    </span>
  </a>
);

export default Spot;
