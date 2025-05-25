/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useRef, useState } from 'react';
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

interface ContactProps {
  onSubmit?: () => void;
}

const Contact: React.FC<ContactProps> = ({ onSubmit }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactData, infoData, servicesData] = await Promise.all([
          getContactInfo(),
          getInformation(),
          getServices(),
        ]);
        setContactInfo(contactData);
        setSpecialties(infoData.specialties);
        setServices(servicesData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await submitContactForm({
        ...formData,
        userAgent: navigator.userAgent,
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      if (onSubmit) onSubmit();
    } catch (err) {
      setFormStatus('error');
    } finally {
      statusRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-rose-600 text-3xl animate-spin"
        />
        <p className="mt-4 text-gray-700">Cargando...</p>
      </div>
    );
  }

  if (error || !contactInfo) {
    return (
      <div className="text-center py-16 text-rose-600">
        <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl mb-4" />
        <p>
          {error ||
            'No se pudo cargar la información. Por favor, intenta de nuevo.'}
        </p>
      </div>
    );
  }

  return (
    <section id="contacto" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Contáctanos
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Estamos listos para ayudarte a capturar tus momentos más especiales.
            ¡Déjanos un mensaje y te responderemos pronto!
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  placeholder="(809) 123-4567"
                />
              </div>
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Servicio de Interés
                </label>
                <div className="relative">
                  <select
                    id="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 bg-white transition-colors"
                    required
                  >
                    <option value="">Selecciona un servicio</option>
                    {specialties.map((specialty, index) => (
                      <option
                        key={`specialty-${index}`}
                        value={specialty.toLowerCase()}
                      >
                        {specialty}
                      </option>
                    ))}
                    {services.map((service, index) => (
                      <option
                        key={`service-${index}`}
                        value={service.title.toLowerCase()}
                      >
                        {service.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="text-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  placeholder="Cuéntanos sobre tu proyecto o evento..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />
                    Enviando...
                  </>
                ) : (
                  'Enviar Mensaje'
                )}
              </button>

              {/* MENSAJE DE ESTADO CON ANIMACIÓN */}
              <div ref={statusRef}>
                <AnimatePresence>
                  {formStatus === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center bg-green-100 text-green-800 rounded-lg p-4 mt-4 shadow-sm"
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="mr-3 text-xl"
                      />
                      <p className="text-sm font-medium">
                        ¡Mensaje enviado con éxito! Te contactaremos pronto.
                      </p>
                    </motion.div>
                  )}
                  {formStatus === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center bg-rose-100 text-rose-800 rounded-lg p-4 mt-4 shadow-sm"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-3 text-xl"
                      />
                      <p className="text-sm font-medium">
                        Error al enviar el mensaje. Por favor, intenta de nuevo.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* INFO DE CONTACTO */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-80 mb-6">
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
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-700">
                  Ubicación no disponible.
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-rose-600 w-5 mt-1"
                  />
                  <p className="ml-3 text-gray-700">{contactInfo.address}</p>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-rose-600 w-5"
                  />
                  <p className="ml-3 text-gray-700">{contactInfo.phone}</p>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-rose-600 w-5"
                  />
                  <p className="ml-3 text-gray-700">{contactInfo.email}</p>
                </div>
                <div className="flex items-start">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="text-rose-600 w-5 mt-1"
                  />
                  <div className="ml-3 text-gray-700">
                    <p className="font-medium">
                      Horario flexible - Con cita previa
                    </p>
                    <p className="mt-1">
                      Disponibilidad adaptada a tus necesidades.
                    </p>
                    <p className="mt-1">Contáctanos para agendar tu sesión.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
