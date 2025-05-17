/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import { getServices } from '../services/photographyPackageService';
import { Service } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faImage,
  faKey,
  faPrint,
  faFemale,
  faCrown,
  faGraduationCap,
  faGem,
  faFont,
  faChalkboard,
  faLeaf,
  faFire,
  faUmbrella,
} from '@fortawesome/free-solid-svg-icons';

const iconMap: { [key: string]: any } = {
  'fa-book': faBook,
  'fa-image': faImage,
  'fa-key': faKey,
  'fa-print': faPrint,
  'fa-female': faFemale,
  'fa-crown': faCrown,
  'fa-graduation-cap': faGraduationCap,
  'fa-gem': faGem,
  'fa-font': faFont,
  'fa-chalkboard': faChalkboard,
  'fa-leaf': faLeaf,
  'fa-fire': faFire,
  'fa-umbrella': faUmbrella,
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los servicios');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  // Dividir servicios en adicionales y alquileres
  const additionalServices = services.filter(service =>
    [
      'Álbum Digital',
      'Enmarcados',
      'Llaveros Personalizados',
      'Fotos Impresas',
    ].includes(service.title)
  );
  const rentals = services.filter(
    service =>
      ![
        'Álbum Digital',
        'Enmarcados',
        'Llaveros Personalizados',
        'Fotos Impresas',
      ].includes(service.title)
  );

  return (
    <section
      id="servicios"
      className="py-12 sm:py-16 lg:py-20 bg-gray-100"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 animate-fade-in"
          >
            Servicios Adicionales
          </h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed animate-fade-in-delay">
            Complementa tu experiencia fotográfica con nuestros servicios
            personalizados y alquileres exclusivos.
          </p>
        </div>

        {/* Servicios Personalizados */}
        {additionalServices.length > 0 && (
          <div className="mb-10 sm:mb-12 lg:mb-14">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-6 sm:mb-8 text-center animate-fade-in">
              Servicios Personalizados
            </h3>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 place-items-center auto-rows-fr max-w-6xl mx-auto"
              role="list"
            >
              {additionalServices.map((service, index) => (
                <div
                  key={service.id}
                  className="flex flex-col items-center animate-fade-in-up hover:scale-105 transition-transform duration-300"
                  role="listitem"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-rose-50 flex items-center justify-center mb-3 sm:mb-4">
                    <FontAwesomeIcon
                      icon={iconMap[service.icon] || faImage}
                      className="text-2xl sm:text-3xl text-rose-600"
                      aria-label={`Icono de ${service.title}`}
                    />
                  </div>
                  <p className="text-sm sm:text-base font-medium text-gray-700 text-center min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2">
                    {service.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alquileres */}
        {rentals.length > 0 && (
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-6 sm:mb-8 text-center animate-fade-in">
              Alquileres Exclusivos
            </h3>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 place-items-center auto-rows-fr max-w-6xl mx-auto"
              role="list"
            >
              {rentals.map((service, index) => (
                <div
                  key={service.id}
                  className="flex flex-col items-center animate-fade-in-up hover:scale-105 transition-transform duration-300"
                  role="listitem"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-rose-50 flex items-center justify-center mb-3 sm:mb-4">
                    <FontAwesomeIcon
                      icon={iconMap[service.icon] || faImage}
                      className="text-2xl sm:text-3xl text-rose-600"
                      aria-label={`Icono de ${service.title}`}
                    />
                  </div>
                  <p className="text-sm sm:text-base font-medium text-gray-700 text-center min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2">
                    {service.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;