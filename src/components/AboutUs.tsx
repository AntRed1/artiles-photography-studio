/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    void fetchInformation();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Cargando...</div>;
  }

  if (error || !information) {
    return (
      <div className="text-center py-12 text-red-600">
        {error || 'No se encontró información'}
      </div>
    );
  }

  return (
    <section
      id="nosotros"
      className="py-12 sm:py-16 lg:py-20 bg-gray-100"
      aria-labelledby="about-us-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <div className="inline-block mb-6 animate-fade-in">
            <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-rose-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCameraRetro}
                className="text-2xl sm:text-3xl text-rose-600"
                aria-label="Icono de cámara retro"
              />
            </div>
          </div>
          <h2
            id="about-us-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 animate-fade-in"
          >
            {information.title}
          </h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed animate-fade-in-delay">
            {information.content}
          </p>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-6 sm:mb-8 text-center animate-fade-in">
            Nuestras Especialidades
          </h3>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 place-items-center auto-rows-fr max-w-6xl mx-auto"
            role="list"
          >
            {information.specialties.map((specialty, index) => (
              <div
                key={index}
                className="flex flex-col items-center animate-fade-in-up hover:scale-105 transition-transform duration-300"
                role="listitem"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-rose-50 flex items-center justify-center mb-3 sm:mb-4">
                  <FontAwesomeIcon
                    icon={
                      iconMap[information.specialtyIcons[index]] || faCamera
                    }
                    className="text-2xl sm:text-3xl text-rose-600"
                    aria-label={`Icono de ${specialty}`}
                  />
                </div>
                <p className="text-sm sm:text-base font-medium text-gray-700 text-center min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2">
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