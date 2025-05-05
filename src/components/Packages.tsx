import React from 'react';
import { packages } from '../data/packages';

const Packages: React.FC = () => {
  return (
    <section id="paquetes" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Paquetes Fotográficos
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Selecciona el paquete que mejor se adapte a tus necesidades.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-center mb-2">
                  {pkg.title}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {pkg.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <i className="fa-solid fa-check text-green-500 mr-2"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/18095557890?text=Hola, estoy interesado/a en el ${pkg.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300 text-center !rounded-button whitespace-nowrap"
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
