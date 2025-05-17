import React, { useEffect, useState } from 'react';
import { getActivePackages } from '../services/packageService';
import { getContactInfo } from '../services/contactInfoService';
import { PhotographyPackage } from '../types';

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<PhotographyPackage[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
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
      (pkg.showPrice ? `Precio: $${pkg.price.toFixed(2)}\n` : '') +
      `Características:\n${pkg.features.map(f => `• ${f}`).join('\n')}\n` +
      `Imagen: ${pkg.imageUrl}`;
    return encodeURIComponent(message);
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-600">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <section
      id="paquetes"
      className="py-16 md:py-24 bg-gray-100"
      aria-labelledby="packages-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="packages-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 animate-fade-in"
          >
            Paquetes Fotográficos
          </h2>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 animate-fade-in-delay">
            Selecciona el paquete que mejor se adapte a tus necesidades y
            captura tus momentos especiales con nosotros.
          </p>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
          role="list"
        >
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up"
              role="listitem"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  fetchPriority={index < 3 ? 'high' : 'low'}
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3">
                  {pkg.title}
                </h3>
                <p className="text-gray-600 text-center mb-4 line-clamp-2">
                  {pkg.description}
                </p>
                <p className="text-center mb-4">
                  {pkg.showPrice ? (
                    <span className="text-lg font-bold text-rose-600">
                      ${pkg.price.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-600">
                    </span>
                  )}
                </p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-rose-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base">
                        {feature}
                      </span>
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
