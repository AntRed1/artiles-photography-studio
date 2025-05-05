import React, { useEffect, useState } from 'react';
import useScroll from '../hooks/useScroll';
import { ContactInfo } from '../types';
import { getContactInfo } from '../services/contactInfoService';

const Footer: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { scrollToSection } = useScroll();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la información de contacto');
        setLoading(false);
      }
    };

    void fetchContactInfo();
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Artiles Photography Studio</h3>
            <p className="text-sm">
              Capturando momentos inolvidables desde 2013.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-sm hover:text-red-500 transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('packages')}
                  className="text-sm hover:text-red-500 transition-colors"
                >
                  Paquetes
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="text-sm hover:text-red-500 transition-colors"
                >
                  Galería
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-sm hover:text-red-500 transition-colors"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <>
                <p className="text-sm mb-2">Teléfono: {contactInfo?.phone}</p>
                <p className="text-sm mb-2">Email: {contactInfo?.email}</p>
                <p className="text-sm mb-2">Dirección: {contactInfo?.address}</p>
                <div className="flex space-x-4 mt-4">
                  {contactInfo?.facebook && (
                    <a
                      href={contactInfo.facebook}
                      className="text-white hover:text-blue-500 transition-colors"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {contactInfo?.instagram && (
                    <a
                      href={contactInfo.instagram}
                      className="text-white hover:text-pink-500 transition-colors"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {contactInfo?.twitter && (
                    <a
                      href={contactInfo.twitter}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {contactInfo?.tiktok && (
                    <a
                      href={contactInfo.tiktok}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      <i className="fab fa-tiktok"></i>
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Artiles Photography Studio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;