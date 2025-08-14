/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Service categories configuration
const SERVICE_CATEGORIES = {
  PERSONALIZED: [
    'Álbum Digital',
    'Enmarcados',
    'Llaveros Personalizados',
    'Fotos Impresas',
  ],
  RENTAL: [
    'Fondos Temáticos',
    'Accesorios de Estudio',
    'Iluminación Premium',
    'Vestimenta Especializada',
  ],
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-rose-400 rounded-full animate-pulse mx-auto"></div>
      </div>
      <p className="mt-6 text-slate-600 font-medium">Cargando servicios...</p>
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
  <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50">
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
        Error al cargar servicios
      </h3>
      <p className="text-red-600 mb-6">{error}</p>
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
const SectionHeader: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="text-center mb-16 lg:mb-20">
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-full text-rose-700 text-sm font-semibold tracking-wide uppercase mb-8 shadow-sm">
      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
      Servicios Adicionales
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

// Service Card Component
interface ServiceCardProps {
  service: Service;
  index: number;
  categoryColor: 'violet' | 'emerald';
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  categoryColor,
}) => {
  const colorVariants = {
    violet: {
      bg: 'from-rose-50 to-pink-50',
      border: 'border-rose-200/50',
      iconBg: 'from-rose-50 to-pink-50',
      iconBorder: 'border-rose-200/50',
      iconColor: 'text-rose-600',
      hoverIconBg: 'group-hover:from-rose-100 group-hover:to-pink-100',
      hoverIconBorder: 'group-hover:border-rose-300/50',
      hoverIconColor: 'group-hover:text-rose-700',
      accent: 'bg-rose-400',
      gradient: 'from-rose-400 to-pink-400',
      shadow: 'hover:shadow-rose-500/20',
    },
    emerald: {
      bg: 'from-rose-50 to-pink-50',
      border: 'border-rose-200/50',
      iconBg: 'from-rose-50 to-pink-50',
      iconBorder: 'border-rose-200/50',
      iconColor: 'text-rose-600',
      hoverIconBg: 'group-hover:from-rose-100 group-hover:to-pink-100',
      hoverIconBorder: 'group-hover:border-rose-300/50',
      hoverIconColor: 'group-hover:text-rose-700',
      accent: 'bg-rose-400',
      gradient: 'from-rose-400 to-pink-400',
      shadow: 'hover:shadow-rose-500/20',
    },
  };

  const colors = colorVariants[categoryColor];

  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-sm border ${colors.border} rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${colors.shadow} hover:bg-white`}
      style={
        {
          animationDelay: `${index * 0.1}s`,
          '--stagger-delay': `${index * 100}ms`,
        } as React.CSSProperties
      }
    >
      {/* Background Pattern */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon Container */}
        <div className="relative mb-6">
          <div
            className={`w-20 h-20 bg-gradient-to-br ${colors.iconBg} border ${colors.iconBorder} rounded-2xl flex items-center justify-center ${colors.hoverIconBg} ${colors.hoverIconBorder} transition-all duration-300 shadow-lg group-hover:shadow-${categoryColor}-200/50`}
          >
            <FontAwesomeIcon
              icon={iconMap[service.icon] || faImage}
              className={`text-2xl ${colors.iconColor} ${colors.hoverIconColor} transition-all duration-300 group-hover:scale-110`}
              aria-label={`Icono de ${service.title}`}
            />
          </div>
          {/* Floating Elements */}
          <div
            className={`absolute -top-2 -right-2 w-4 h-4 ${colors.accent} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce`}
          ></div>
        </div>

        {/* Text Content */}
        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300 leading-tight min-h-[3rem] flex items-center">
            {service.title}
          </h4>
          <div
            className={`mt-4 w-12 h-0.5 bg-gradient-to-r ${colors.gradient} rounded-full group-hover:w-full transition-all duration-500`}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Services Grid Component
interface ServicesGridProps {
  services: Service[];
  title: string;
  description: string;
  categoryColor: 'violet' | 'emerald';
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  title,
  description,
  categoryColor,
}) => {
  if (services.length === 0) return null;

  const colorVariants = {
    violet: 'text-rose-600',
    emerald: 'text-rose-600',
  };

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
          {title.split(' ')[0]}{' '}
          <span className={colorVariants[categoryColor]}>
            {title.split(' ').slice(1).join(' ')}
          </span>
        </h3>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            categoryColor={categoryColor}
          />
        ))}
      </div>
    </div>
  );
};

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
          ¿Necesitas algo <span className="text-rose-400">especial</span>?
        </h3>
        <p className="text-slate-300 text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl mx-auto font-light">
          Personalizamos cualquier servicio para adaptarlo perfectamente a tus
          necesidades y hacer tu evento único.
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Consultar Personalización
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('paquetes');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 min-w-[200px] justify-center"
          >
            Ver Paquetes
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices([
          ...data,
          // Servicios adicionales para Alquileres Exclusivos
          {
            id: 1001,
            title: 'Fondos Temáticos',
            icon: 'fa-chalkboard',
          },
          {
            id: 1002,
            title: 'Accesorios de Estudio',
            icon: 'fa-leaf',
          },
          {
            id: 1003,
            title: 'Iluminación Premium',
            icon: 'fa-fire',
          },
          {
            id: 1004,
            title: 'Vestimenta Especializada',
            icon: 'fa-female',
          },
        ]);
      } catch (err) {
        setError('Error al cargar los servicios');
      } finally {
        setLoading(false);
      }
    };

    void fetchServices();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;

  // Categorize services
  const personalizedServices = services.filter(service =>
    SERVICE_CATEGORIES.PERSONALIZED.includes(service.title)
  );
  const rentalServices = services.filter(service =>
    SERVICE_CATEGORIES.RENTAL.includes(service.title)
  );

  return (
    <section
      id="servicios"
      className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-rose-50 overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-200/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
        <SectionHeader
          title="Servicios Adicionales"
          description="Complementa tu experiencia fotográfica con nuestros servicios personalizados y alquileres exclusivos."
        />

        <ServicesGrid
          services={personalizedServices}
          title="Servicios Personalizados"
          description="Productos únicos y tangibles que harán que tus recuerdos perduren para siempre"
          categoryColor="violet"
        />

        <ServicesGrid
          services={rentalServices}
          title="Alquileres Exclusivos"
          description="Elementos decorativos y accesorios premium para hacer tu sesión fotográfica única"
          categoryColor="emerald"
        />

        <CallToAction />
      </div>
    </section>
  );
};

export default Services;
