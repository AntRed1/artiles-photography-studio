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
    return <div className="text-center py-20 text-gray-600">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
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
      className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Servicios Adicionales
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            Complementa tu experiencia fotográfica con nuestros servicios
            personalizados y alquileres exclusivos.
          </p>
        </div>

        {/* Servicios Adicionales */}
        {additionalServices.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-700 mb-8 text-center">
              Servicios Personalizados
            </h3>
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-fr"
              role="list"
            >
              {additionalServices.map(service => (
                <div
                  key={service.id}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                  role="listitem"
                >
                  <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                    <FontAwesomeIcon
                      icon={iconMap[service.icon] || faImage}
                      className="text-rose-600 text-3xl"
                      aria-label={`Icono de ${service.title}`}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 text-center line-clamp-2">
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
            <h3 className="text-2xl font-semibold text-gray-700 mb-8 text-center">
              Alquileres Exclusivos
            </h3>
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 auto-rows-fr"
              role="list"
            >
              {rentals.map(service => (
                <div
                  key={service.id}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                  role="listitem"
                >
                  <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                    <FontAwesomeIcon
                      icon={iconMap[service.icon] || faImage}
                      className="text-rose-600 text-3xl"
                      aria-label={`Icono de ${service.title}`}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 text-center line-clamp-2">
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
