import React, { useEffect, useState } from 'react';
import { getActivePackages } from '../services/packageService';
import { getContactInfo } from '../services/contactInfoService';
import { PhotographyPackage } from '../types';

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<PhotographyPackage[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('18095557890');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, contactData] = await Promise.all([
          getActivePackages(),
          getContactInfo(),
        ]);
        setPackages(packagesData);
        setWhatsappNumber(contactData.whatsapp);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  const generateWhatsAppMessage = (pkg: PhotographyPackage) => {
    const message =
      `Hola, estoy interesado/a en el ${pkg.title}\n` +
      `Descripción: ${pkg.description}\n` +
      `Características:\n${pkg.features.map(f => `• ${f}`).join('\n')}\n` +
      `Imagen: ${pkg.imageUrl}`;
    return encodeURIComponent(message);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return (
    <section
      id="paquetes"
      className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Paquetes Fotográficos
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            Selecciona el paquete que mejor se adapte a tus necesidades y
            captura tus momentos especiales con nosotros.
          </p>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          role="list"
        >
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
              role="listitem"
            >
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-3">
                  {pkg.title}
                </h3>
                <p className="text-gray-600 text-center mb-4 line-clamp-3">
                  {pkg.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <i className="fa-solid fa-check text-rose-600 mr-2"></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage(pkg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors duration-300 text-center"
                  aria-label={`Reservar el paquete ${pkg.title} por WhatsApp`}
                >
                  <i className="fab fa-whatsapp mr-2"></i>
                  Reservar por WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
