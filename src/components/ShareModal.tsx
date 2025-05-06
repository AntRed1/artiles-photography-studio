/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import { saveTestimonial } from '../services/testimonialService';

interface ShareModalProps {
  showShareModal: boolean;
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareModal: React.FC<ShareModalProps> = ({
  showShareModal,
  setShowShareModal,
}) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setAlert({
        type: 'error',
        message: 'Debes aceptar la política de privacidad',
      });
      return;
    }
    try {
      await saveTestimonial({ name, rating, message });
      setAlert({ type: 'success', message: '¡Testimonio enviado con éxito!' });
      setName('');
      setRating(5);
      setMessage('');
      setConsent(false);
      setTimeout(() => {
        setShowShareModal(false);
        setAlert(null);
      }, 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al enviar el testimonio' });
    }
  };

  const closeAlert = () => {
    setAlert(null);
    if (alert?.type === 'success') {
      setShowShareModal(false);
    }
  };

  if (!showShareModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        {alert && (
          <div
            className={`flex items-center justify-between p-4 rounded-t-lg transition-all duration-300 ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            } animate-slide-down`}
          >
            <div className="flex items-center">
              <i
                className={`fa-solid ${
                  alert.type === 'success'
                    ? 'fa-check-circle'
                    : 'fa-exclamation-circle'
                } mr-2 text-lg`}
              ></i>
              <span>{alert.message}</span>
            </div>
            <button
              onClick={closeAlert}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Cerrar alerta"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Comparte tu Experiencia
            </h3>
            <button
              onClick={() => setShowShareModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              aria-label="Cerrar modal"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Calificación
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                    aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
                  >
                    <i
                      className={`fa-solid fa-star ${
                        star <= rating ? 'text-rose-600' : 'text-gray-300'
                      }`}
                    ></i>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comentario
              </label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
                placeholder="Comparte tu experiencia con nosotros..."
                required
              ></textarea>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mr-2 focus:ring-rose-600"
                />
                <span className="text-gray-700 text-sm">
                  Acepto que mi dispositivo, IP y ubicación sean recopilados
                  según la{' '}
                  <a href="/privacy" className="text-rose-600 hover:underline">
                    política de privacidad
                  </a>
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 hover:shadow-lg transition-all duration-300"
            >
              Enviar Comentario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
