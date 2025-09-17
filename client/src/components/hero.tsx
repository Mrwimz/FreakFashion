import React from "react";

interface HeroProps {
  image: string;
  title: string;
  text: string;
}

const Hero: React.FC<HeroProps> = ({ image, title, text }) => {
  return (
    <div className="px-4">
      <div className="flex flex-col px-4 py-4 text-center border border-black lg:flex-row lg:items-start lg:text-center">
        {/* Image Section - on mobile & tablet it comes first */}
        <div className="lg:w-1/2 lg:order-2">
          <img
            src={image}
            alt={title}
            className="w-full h-auto md:max-w-[550px] lg:max-w-[600px] md:mx-auto lg:mx-auto"
          />
        </div>

        {/* Text Section */}
        <div className="mt-4 lg:mt-0 lg:w-1/2 lg:pr-6 lg:order-1 flex flex-col items-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-6 text-lg">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
