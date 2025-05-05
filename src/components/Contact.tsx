import React, { useState, useEffect } from 'react';
import { ContactInfo } from '../types';
import { getContactInfo } from '../services/contactInfoService';

const Contact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Contáctanos</h2>
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Información de Contacto
              </h3>
              <p className="mb-2">
                <strong>Teléfono:</strong> {contactInfo?.phone}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {contactInfo?.email}
              </p>
              <p className="mb-2">
                <strong>Dirección:</strong> {contactInfo?.address}
              </p>
              <p className="mb-2">
                <strong>WhatsApp:</strong> {contactInfo?.whatsapp}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Redes Sociales</h3>
              <div className="flex space-x-4">
                {contactInfo?.facebook && (
                  <a
                    href={contactInfo.facebook}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <i className="fab fa-facebook-f text-lg"></i>
                  </a>
                )}
                {contactInfo?.instagram && (
                  <a
                    href={contactInfo.instagram}
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    <i className="fab fa-instagram text-lg"></i>
                  </a>
                )}
                {contactInfo?.twitter && (
                  <a
                    href={contactInfo.twitter}
                    className="text-gray-600 hover:text-blue-400 transition-colors"
                  >
                    <i className="fab fa-twitter text-lg"></i>
                  </a>
                )}
                {contactInfo?.tiktok && (
                  <a
                    href={contactInfo.tiktok}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <i className="fab fa-tiktok text-lg"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
