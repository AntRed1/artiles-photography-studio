import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getContactInfo } from '../services/contactInfoService';
import { ContactInfo } from '../types';

interface WhatsAppButtonProps {
  onClick?: () => void; // Prop opcional para rastrear clics
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ onClick }) => {
  const [showWhatsappTooltip, setShowWhatsappTooltip] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('1234567890'); // Fallback estático
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ContactInfo = await getContactInfo();
        setWhatsappNumber(data.whatsapp);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el número de WhatsApp');
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const handleClick = () => {
    if (onClick) {
      onClick(); // Ejecutar la prop onClick para rastrear el evento
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible ? (
        <div
          className="fixed bottom-24 right-6 z-50"
          onMouseEnter={() => setShowWhatsappTooltip(true)}
          onMouseLeave={() => setShowWhatsappTooltip(false)}
        >
          <div className="relative">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="block w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 relative"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="text-white text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </a>
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs hover:bg-gray-900 transition-colors duration-200"
              aria-label="Cerrar botón de WhatsApp"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          {showWhatsappTooltip && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg py-2 px-4 text-sm whitespace-nowrap">
              ¡Chatea con nosotros!
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-6 right-6 w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white"
          aria-label="Restaurar botón de WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </button>
      )}
      {(loading || error) && null}
    </>
  );
};

export default WhatsAppButton;
