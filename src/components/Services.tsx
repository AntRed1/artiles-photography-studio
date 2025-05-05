import React from 'react';
import { services } from '../data/services';

const Services: React.FC = () => {
  return (
    <section id="servicios" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Servicios Adicionales
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Complementa tu experiencia fotográfica con nuestros servicios
            adicionales.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
          {services.map(service => (
            <div key={service.id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
                <i className={`${service.icon} text-red-600 text-2xl`}></i>
              </div>
              <p className="font-medium text-center">{service.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
