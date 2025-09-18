// ...existing code...

import React, { useEffect, useState } from "react";
import Spot from "./Spot";
import adminService, { Category } from "../services/adminService";

interface SpotData {
  image: string;
  text: string;
  link: string;
}

const Spots: React.FC = () => {
  const [spots, setSpots] = useState<SpotData[]>([]);

  useEffect(() => {
    // Tre passande freaky fashion-bilder från Unsplash
    const spotsData: SpotData[] = [
      {
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
        text: "Insane Jackets",
        link: "/category/Jackor",
      },
      {
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
        text: "Crazy Pants",
        link: "/category/Byxor",
      },
      {
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        text: "Statement Shoes",
        link: "/category/Skor",
      },
    ];
    setSpots(spotsData);
  }, []);

  return (
    <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      {spots.map((spot, idx) => (
        <Spot key={idx} image={spot.image} text={spot.text} link={spot.link} />
      ))}
    </div>
  );
};

// ...existing code...

export default Spots;
