import React, { useEffect, useState } from 'react';
import { getInformation } from '../services/informationService';
import { Information } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faHeart,
  faGraduationCap,
  faUsers,
  faBaby,
  faCalendar,
  faCameraRetro,
} from '@fortawesome/free-solid-svg-icons';

const iconMap: { [key: string]: any } = {
  'fa-camera': faCamera,
  'fa-heart': faHeart,
  'fa-graduation-cap': faGraduationCap,
  'fa-users': faUsers,
  'fa-baby': faBaby,
  'fa-calendar': faCalendar,
  'fa-camera-retro': faCameraRetro,
};

const AboutUs: React.FC = () => {
  const [information, setInformation] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const data = await getInformation();
        setInformation(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la información');
        setLoading(false);
      }
    };
    fetchInformation();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Cargando...</div>;
  }

  if (error || !information) {
    return (
      <div className="text-center py-20 text-red-600">
        {error || 'No se encontró información'}
      </div>
    );
  }

  return (
    <section
      id="nosotros"
      className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCameraRetro}
                className="text-5xl text-rose-600"
                aria-label="Icono de cámara retro"
              />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {information.title}
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed mb-8">
            {information.content}
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-8 text-center">
            Nuestras Especialidades
          </h3>
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 auto-rows-fr"
            role="list"
          >
            {information.specialties.map((specialty, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                role="listitem"
              >
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={
                      iconMap[information.specialtyIcons[index]] || faCamera
                    }
                    className="text-rose-600 text-3xl"
                    aria-label={`Icono de ${specialty}`}
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 text-center line-clamp-2">
                  {specialty}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
