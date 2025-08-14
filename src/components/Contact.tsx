/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faChevronDown,
  faLocationDot,
  faPhone,
  faEnvelope,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

import { getContactInfo } from '../services/contactInfoService';
import { getInformation } from '../services/informationService';
import { getServices } from '../services/photographyPackageService';
import { submitContactForm } from '../services/contactService';
import { ContactInfo, Service } from '../types';

// Tipos de estado del formulario
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// Interfaz para los datos del formulario
interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface ContactProps {
  onSubmit?: () => void;
}

// Componente de loading reutilizable
const LoadingSpinner = memo(() => (
  <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24 space-y-4 px-4">
    <div className="relative">
      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-3 sm:border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin"></div>
      <FontAwesomeIcon
        icon={faSpinner}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-600 text-xs sm:text-sm lg:text-base animate-pulse"
      />
    </div>
    <p className="text-gray-700 font-medium text-sm sm:text-base text-center">
      Cargando información...
    </p>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Componente de error reutilizable
const ErrorDisplay = memo<{ error: string }>(({ error }) => (
  <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24 text-center space-y-4 px-4">
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-100 rounded-full flex items-center justify-center">
      <FontAwesomeIcon
        icon={faExclamationCircle}
        className="text-rose-600 text-xl sm:text-2xl"
      />
    </div>
    <div className="max-w-md">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
        Oops, algo salió mal
      </h3>
      <p className="text-gray-600 text-sm sm:text-base">{error}</p>
    </div>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 text-sm sm:text-base text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all duration-200 font-medium"
    >
      Intentar de nuevo
    </button>
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';

// Componente de mensaje de estado
const StatusMessage = memo<{
  status: FormStatus;
  onClose?: () => void;
}>(({ status, onClose }) => {
  if (status === 'idle' || status === 'submitting') return null;

  const isSuccess = status === 'success';
  const config = {
    success: {
      icon: faCheckCircle,
      bgColor:
        'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      message: '¡Mensaje enviado con éxito! Te contactaremos pronto.',
    },
    error: {
      icon: faExclamationCircle,
      bgColor:
        'bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200',
      textColor: 'text-rose-800',
      iconColor: 'text-rose-600',
      message: 'Error al enviar el mensaje. Por favor, intenta de nuevo.',
    },
  };

  const currentConfig = config[status as keyof typeof config];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-start ${currentConfig.bgColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm`}
    >
      <FontAwesomeIcon
        icon={currentConfig.icon}
        className={`${currentConfig.iconColor} mr-2 sm:mr-3 text-base sm:text-lg mt-0.5 flex-shrink-0`}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`${currentConfig.textColor} font-medium text-xs sm:text-sm leading-relaxed`}
        >
          {currentConfig.message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${currentConfig.textColor} opacity-60 hover:opacity-100 ml-2 p-1 transition-opacity text-lg sm:text-xl flex-shrink-0`}
          aria-label="Cerrar mensaje"
        >
          ×
        </button>
      )}
    </motion.div>
  );
});

StatusMessage.displayName = 'StatusMessage';

// Componente principal
const Contact: React.FC<ContactProps> = ({ onSubmit }) => {
  // Estados
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Función para obtener datos inicial
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [contactData, infoData, servicesData] = await Promise.all([
        getContactInfo(),
        getInformation(),
        getServices(),
      ]);

      setContactInfo(contactData);
      setSpecialties(infoData.specialties);
      setServices(servicesData);
    } catch (err) {
      console.error('Error fetching contact data:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para cargar datos
  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Manejo de cambios en inputs
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
    },
    []
  );

  // Validación del formulario
  const validateForm = useCallback((data: FormData): string | null => {
    if (!data.name.trim()) return 'El nombre es requerido';
    if (!data.email.trim()) return 'El email es requerido';
    if (!data.service.trim()) return 'Selecciona un servicio';
    if (!data.message.trim()) return 'El mensaje es requerido';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return 'Email inválido';

    return null;
  }, []);

  // Manejo del envío del formulario
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationError = validateForm(formData);
      if (validationError) {
        setFormStatus('error');
        return;
      }

      setFormStatus('submitting');

      try {
        await submitContactForm({
          ...formData,
          userAgent: navigator.userAgent,
        });

        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
        });
        formRef.current?.reset();

        if (onSubmit) {
          onSubmit();
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        setFormStatus('error');
      } finally {
        // Scroll suave al mensaje de estado
        setTimeout(() => {
          statusRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }, 100);

        // Auto-hide status después de 8 segundos
        setTimeout(() => {
          if (formStatus !== 'submitting') {
            setFormStatus('idle');
          }
        }, 8000);
      }
    },
    [formData, validateForm, onSubmit, formStatus]
  );

  // Renderizado condicional para loading
  if (loading) {
    return <LoadingSpinner />;
  }

  // Renderizado condicional para error
  if (error || !contactInfo) {
    return (
      <ErrorDisplay
        error={
          error ||
          'No se pudo cargar la información. Por favor, intenta de nuevo.'
        }
      />
    );
  }

  return (
    <section
      id="contacto"
      className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-gray-50 via-rose-50/20 to-gray-100 min-h-screen relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-rose-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-pink-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-rose-700 to-slate-900 bg-clip-text text-transparent">
              Contáctanos
            </span>
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-rose-600 to-pink-600 mx-auto mb-4 sm:mb-6"></div>
          <p className="max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-2">
            Estamos listos para ayudarte a capturar tus momentos más especiales.
            ¡Déjanos un mensaje y te responderemos pronto!
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 md:p-8 lg:p-10 border border-white/50"
          >
            <form
              ref={formRef}
              className="space-y-4 sm:space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
                >
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  placeholder="Tu nombre completo"
                  required
                  disabled={formStatus === 'submitting'}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
                >
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  placeholder="tu@email.com"
                  required
                  disabled={formStatus === 'submitting'}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  placeholder="(809) 123-4567"
                  disabled={formStatus === 'submitting'}
                />
              </div>

              {/* Service Selection */}
              <div>
                <label
                  htmlFor="service"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
                >
                  Servicio de Interés *
                </label>
                <div className="relative">
                  <select
                    id="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="appearance-none w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-gray-50 focus:bg-white transition-all duration-200 cursor-pointer text-sm sm:text-base"
                    required
                    disabled={formStatus === 'submitting'}
                  >
                    <option value="">Selecciona un servicio</option>
                    <optgroup label="Especialidades">
                      {specialties.map((specialty, index) => (
                        <option
                          key={`specialty-${index}`}
                          value={specialty.toLowerCase()}
                        >
                          {specialty}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Servicios">
                      {services.map((service, index) => (
                        <option
                          key={`service-${index}`}
                          value={service.title.toLowerCase()}
                        >
                          {service.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="text-gray-400 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
                >
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none text-sm sm:text-base"
                  placeholder="Cuéntanos sobre tu proyecto o evento..."
                  required
                  disabled={formStatus === 'submitting'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-rose-700 hover:to-pink-700 active:from-rose-800 active:to-pink-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-sm sm:text-base"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2 sm:mr-3 text-sm sm:text-base"
                    />
                    Enviando...
                  </>
                ) : (
                  'Enviar Mensaje'
                )}
              </button>

              {/* Status Message */}
              <div ref={statusRef}>
                <AnimatePresence mode="wait">
                  <StatusMessage
                    status={formStatus}
                    onClose={() => setFormStatus('idle')}
                  />
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Map */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-48 sm:h-64 md:h-80 border border-white/50">
              {contactInfo.googleMapsUrl ? (
                <iframe
                  src={contactInfo.googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Artiles Photography Studio"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-2xl sm:text-3xl mb-2"
                    />
                    <p className="text-sm sm:text-base">
                      Ubicación no disponible
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 md:p-8 border border-white/50">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800 text-center">
                Información de Contacto
              </h3>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="flex items-start p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-rose-50/30 transition-all duration-200 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-rose-200 group-hover:to-pink-200 transition-all duration-200">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-rose-600 text-sm sm:text-base md:text-lg"
                    />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="font-medium text-gray-800 mb-1 text-xs sm:text-sm md:text-base">
                      Dirección
                    </p>
                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm break-words">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-rose-50/30 transition-all duration-200 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-rose-200 group-hover:to-pink-200 transition-all duration-200">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-rose-600 text-sm sm:text-base md:text-lg"
                    />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="font-medium text-gray-800 mb-1 text-xs sm:text-sm md:text-base">
                      Teléfono
                    </p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-600 hover:text-rose-600 transition-colors text-xs sm:text-sm break-all"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-rose-50/30 transition-all duration-200 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-rose-200 group-hover:to-pink-200 transition-all duration-200">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-rose-600 text-sm sm:text-base md:text-lg"
                    />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="font-medium text-gray-800 mb-1 text-xs sm:text-sm md:text-base">
                      Email
                    </p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-600 hover:text-rose-600 transition-colors text-xs sm:text-sm break-all"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-rose-50/30 transition-all duration-200 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-rose-200 group-hover:to-pink-200 transition-all duration-200">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-rose-600 text-sm sm:text-base md:text-lg"
                    />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="font-medium text-gray-800 mb-2 text-xs sm:text-sm md:text-base">
                      Horarios
                    </p>
                    <div className="space-y-1 text-gray-600">
                      <p className="font-medium text-xs sm:text-sm">
                        Horario flexible - Con cita previa
                      </p>
                      <p className="text-2xs sm:text-xs">
                        Disponibilidad adaptada a tus necesidades.
                      </p>
                      <p className="text-2xs sm:text-xs">
                        Contáctanos para agendar tu sesión.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
