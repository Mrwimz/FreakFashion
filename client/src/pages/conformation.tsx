import React from "react";

const ConformationPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col items-center justify-center h-96">
      <h1 className="text-2xl font-bold mb-6 text-center">Orderbekräftelse</h1>
      <p className="text-center text-lg mb-4">Tack för din beställning!</p>
      <p className="text-center text-gray-500">Din order är mottagen och kommer att behandlas inom kort.</p>
    </div>
  );
};

export default ConformationPage;
