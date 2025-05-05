import React from 'react';
import { useScroll } from '../hooks/useScroll';
import logo from '../assets/images/logo.png';

interface FooterProps {
  setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTermsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Footer: React.FC<FooterProps> = ({
  setShowPrivacyModal,
  setShowTermsModal,
}) => {
  const { scrollToSection } = useScroll();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <img
                src={logo}
                alt="Artiles Photography Studio"
                className="h-12 w-auto mr-3 brightness-0 invert"
              />
              <h3 className="text-xl font-bold">
                <span className="text-white">Artiles Photography</span>
                <span className="text-red-500">Studio</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-6">
              Capturando momentos especiales y creando recuerdos inolvidables
              desde 2017.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {[
                'inicio',
                'nosotros',
                'servicios',
                'galeria',
                'testimonios',
                'contacto',
              ].map(item => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Servicios</h4>
            <ul className="space-y-3">
              {[
                'Quinceañeras',
                'Bodas',
                'Graduaciones',
                'Familias',
                'Bebés',
                'Eventos',
              ].map(service => (
                <li key={service}>
                  <a
                    href="#servicios"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Legal</h4>
            <p className="text-gray-400 mb-4">
              Protegemos tu privacidad y garantizamos la seguridad de tus datos
              personales.
            </p>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Términos y Condiciones
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Métodos de Pago</h4>
            <p className="text-gray-400 mb-4">
              Aceptamos los siguientes métodos de pago:
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <i className="fa-solid fa-money-bill-wave text-gray-400 w-6"></i>
                <span className="text-gray-400 ml-2">Efectivo</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-building-columns text-gray-400 w-6"></i>
                <span className="text-gray-400 ml-2">
                  Transferencia Bancaria
                </span>
              </div>
              <div className="flex items-center">
                <i className="fa-brands fa-paypal text-gray-400 w-6"></i>
                <span className="text-gray-400 ml-2">PayPal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Artiles Photography Studio. Todos los derechos reservados.
            </p>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-gray-400 text-sm mb-2">
                Desarrollado por Anthony J. Rojas Valdez
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/AntRed1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/anthony-j-rojas-v-29b26a207/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
