import React, { useState } from 'react';

const WhatsAppButton: React.FC = () => {
  const [showWhatsappTooltip, setShowWhatsappTooltip] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setShowWhatsappTooltip(true)}
      onMouseLeave={() => setShowWhatsappTooltip(false)}
    >
      <a
        href="https://wa.me/18095557890"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 relative"
      >
        <i className="fab fa-whatsapp text-white text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
      </a>
      {showWhatsappTooltip && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg py-2 px-4 text-sm whitespace-nowrap">
          ¡Chatea con nosotros!
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;
