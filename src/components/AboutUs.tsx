/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Icon mapping for specialties
const iconMap: { [key: string]: any } = {
  'fa-camera': faCamera,
  'fa-heart': faHeart,
  'fa-graduation-cap': faGraduationCap,
  'fa-users': faUsers,
  'fa-baby': faBaby,
  'fa-calendar': faCalendar,
  'fa-camera-retro': faCameraRetro,
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-rose-400 rounded-full animate-pulse mx-auto"></div>
      </div>
      <p className="mt-6 text-slate-600 font-medium">Cargando información...</p>
      <div className="mt-2 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
    </div>
  </div>
);

// Error Component
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50">
    <div className="text-center max-w-md mx-auto px-6">
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Oops! Algo salió mal
      </h3>
      <p className="text-red-600 mb-6">
        {error || 'No se encontró información'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
      >
        Intentar nuevamente
      </button>
    </div>
  </div>
);

// Section Header Component
const SectionHeader: React.FC<{
  badge: string;
  title: string;
  description: string;
}> = ({ badge, title, description }) => (
  <div className="text-center mb-16 lg:mb-20">
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-full text-rose-700 text-sm font-semibold tracking-wide uppercase mb-8 shadow-sm">
      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
      {badge}
    </div>
    <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 mb-8 leading-tight">
      <span className="bg-gradient-to-r from-slate-900 via-rose-700 to-slate-900 bg-clip-text text-transparent">
        {title}
      </span>
    </h2>
    <div className="max-w-4xl mx-auto">
      <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed font-light">
        {description}
      </p>
      <div className="mt-8 w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto"></div>
    </div>
  </div>
);

// Specialty Card Component
interface SpecialtyCardProps {
  specialty: string;
  icon: string;
  index: number;
  totalCount: number;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  icon,
  index,
  totalCount,
}) => (
  <div
    className="group relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/20 hover:bg-white"
    style={
      {
        animationDelay: `${index * 0.1}s`,
        '--stagger-delay': `${index * 100}ms`,
      } as React.CSSProperties
    }
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Content */}
    <div className="relative z-10">
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/50 rounded-2xl flex items-center justify-center group-hover:from-rose-100 group-hover:to-pink-100 group-hover:border-rose-300/50 transition-all duration-300 shadow-lg group-hover:shadow-rose-200/50">
          <FontAwesomeIcon
            icon={iconMap[icon] || faCamera}
            className="text-2xl text-rose-600 group-hover:text-rose-700 transition-all duration-300 group-hover:scale-110"
            aria-label={`Icono de ${specialty}`}
          />
        </div>
        {/* Floating Elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"></div>
      </div>

      {/* Text Content */}
      <div>
        <h4 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300 leading-tight min-h-[3rem] flex items-center">
          {specialty}
        </h4>
        <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-rose-400 to-transparent rounded-full group-hover:w-full transition-all duration-500"></div>
      </div>
    </div>
  </div>
);

// Specialties Grid Component
const SpecialtiesGrid: React.FC<{ specialties: string[]; icons: string[] }> = ({
  specialties,
  icons,
}) => (
  <div className="mb-20">
    <div className="text-center mb-12">
      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
        Nuestras <span className="text-rose-600">Especialidades</span>
      </h3>
      <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
        Cada servicio está diseñado para capturar la esencia única de tus
        momentos más preciados
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
      {specialties.map((specialty, index) => (
        <SpecialtyCard
          key={index}
          specialty={specialty}
          icon={icons[index]}
          index={index}
          totalCount={specialties.length}
        />
      ))}
    </div>
  </div>
);

// Call to Action Component
const CallToAction: React.FC = () => (
  <div className="relative">
    {/* Background Elements */}
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-transparent to-pink-600/20 rounded-3xl"></div>

    {/* Content */}
    <div className="relative z-10 p-12 lg:p-16 text-center text-white">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          ¿Listo para crear algo{' '}
          <span className="text-rose-400">extraordinario</span>?
        </h3>
        <p className="text-slate-300 text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl mx-auto font-light">
          Contáctanos y descubre cómo podemos transformar tus momentos
          especiales en recuerdos únicos e inolvidables.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              const element = document.getElementById('contacto');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-rose-500/50 transform hover:-translate-y-1 min-w-[200px] justify-center"
            aria-label="Ir a la sección de contacto"
          >
            <svg
              className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
            Contáctanos
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('servicios');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 min-w-[200px] justify-center"
          >
            Ver Servicios
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
const AboutUs: React.FC = () => {
  const [information, setInformation] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const data = await getInformation();
        setInformation(data);
      } catch (err) {
        setError('Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    void fetchInformation();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error || !information)
    return <ErrorState error={error || 'No se encontró información'} />;

  return (
    <section
      id="nosotros"
      className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-rose-50 overflow-hidden"
      aria-labelledby="about-us-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-200/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
        <SectionHeader
          badge="Sobre Nosotros"
          title={information.title}
          description={information.content}
        />

        <SpecialtiesGrid
          specialties={information.specialties}
          icons={information.specialtyIcons}
        />

        <CallToAction />
      </div>
    </section>
  );
};

export default AboutUs;
