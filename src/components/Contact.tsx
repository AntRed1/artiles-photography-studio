import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Estamos aquí para responder tus preguntas y ayudarte a planificar tu
            sesión fotográfica.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form className="space-y-6">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Tu nombre"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="tu@email.com"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
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
                    className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="quinceañeras">Quinceañeras</option>
                    <option value="bodas">Bodas</option>
                    <option value="graduaciones">Graduaciones</option>
                    <option value="familias">Familias</option>
                    <option value="bebés">Bebés</option>
                    <option value="eventos">Eventos</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Cuéntanos sobre tu proyecto..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-80 mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242118.17305006966!2d-69.9939726!3d18.4801923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f1107ea5ab%3A0xd6c587b82715c164!2sSanto%20Domingo%2C%20Dominican%20Republic!5e0!3m2!1sen!2sus!4v1651693456789!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Artiles Photography Studio"
              ></iframe>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <i className="fa-solid fa-location-dot text-red-600 w-5 text-center"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">
                      Av. Winston Churchill #123, Plaza Central, Local 45, Santo
                      Domingo, República Dominicana
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-phone text-red-600 w-5 text-center"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">(809) 555-7890</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-envelope text-red-600 w-5 text-center"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">info@artilesphotography.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <i className="fa-solid fa-clock text-red-600 w-5 text-center"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 font-medium">
                      Horario flexible - Con cita previa
                    </p>
                    <p className="text-gray-700 mt-1">
                      Disponibilidad adaptada a tus necesidades.
                    </p>
                    <p className="text-gray-700 mt-1">
                      Contáctanos para agendar tu sesión.
                    </p>
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
