/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveTestimonial } from '../services/testimonialService';

// Types
interface TestimonialData {
  name: string;
  rating: number;
  message: string;
}

interface AlertState {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ShareModalProps {
  showShareModal: boolean;
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Constants
const INITIAL_FORM_STATE: TestimonialData = {
  name: '',
  rating: 5,
  message: '',
};

const ALERT_AUTO_CLOSE_DELAY = 3000;
const STARS = [1, 2, 3, 4, 5] as const;

// Subcomponents
const StarRating: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}> = ({ rating, onRatingChange, disabled = false }) => (
  <div
    className="flex items-center space-x-1"
    role="radiogroup"
    aria-labelledby="rating-label"
  >
    {STARS.map(star => (
      <button
        key={star}
        type="button"
        onClick={() => !disabled && onRatingChange(star)}
        disabled={disabled}
        className={`
          text-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 
          rounded transition-all duration-200 p-1
          ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 active:scale-95'}
        `}
        aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
        role="radio"
        aria-checked={star === rating}
      >
        <i
          className={`fa-solid fa-star transition-colors duration-200 ${
            star <= rating
              ? 'text-rose-600'
              : 'text-gray-300 hover:text-rose-400'
          }`}
        />
      </button>
    ))}
    <span className="ml-2 text-sm text-gray-600" aria-live="polite">
      {rating} de 5 estrellas
    </span>
  </div>
);

const Alert: React.FC<{
  alert: AlertState;
  onClose: () => void;
}> = ({ alert, onClose }) => {
  const alertStyles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        flex items-center justify-between p-4 rounded-t-lg border-b
        ${alertStyles[alert.type]}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center">
        <i
          className={`fa-solid ${iconMap[alert.type]} mr-3 text-lg`}
          aria-hidden="true"
        />
        <span className="font-medium">{alert.message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded p-1 transition-colors duration-200"
        aria-label="Cerrar alerta"
      >
        <i className="fa-solid fa-times text-sm" aria-hidden="true" />
      </button>
    </motion.div>
  );
};

const FormField: React.FC<{
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, id, error, required = false, children }) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-gray-700"
      id={`${id}-label`}
    >
      {label}
      {required && (
        <span className="text-rose-600 ml-1" aria-label="requerido">
          *
        </span>
      )}
    </label>
    <div className="relative">
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center" role="alert">
          <i
            className="fa-solid fa-exclamation-triangle mr-1 text-xs"
            aria-hidden="true"
          />
          {error}
        </p>
      )}
    </div>
  </div>
);

// Main Component
const ShareModal: React.FC<ShareModalProps> = ({
  showShareModal,
  setShowShareModal,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState<TestimonialData>(INITIAL_FORM_STATE);
  const [consent, setConsent] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof TestimonialData, string>>
  >({});

  // Reset form when modal closes
  useEffect(() => {
    if (!showShareModal) {
      setFormData(INITIAL_FORM_STATE);
      setConsent(false);
      setAlert(null);
      setFieldErrors({});
      setIsSubmitting(false);
    }
  }, [showShareModal]);

  // Auto-close alert after delay
  useEffect(() => {
    if (alert?.type === 'success') {
      const timer = setTimeout(() => {
        closeModal();
      }, ALERT_AUTO_CLOSE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof TestimonialData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.message.trim()) {
      errors.message = 'El comentario es requerido';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'El comentario debe tener al menos 10 caracteres';
    } else if (formData.message.length > 500) {
      errors.message = 'El comentario no puede exceder los 500 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof TestimonialData, value: string | number) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (fieldErrors[field]) {
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
      }
    },
    [fieldErrors]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === ' ') {
      //console.log('Space key pressed');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setAlert({
        type: 'error',
        message: 'Debes aceptar la política de privacidad para continuar',
      });
      return;
    }

    if (!validateForm()) {
      setAlert({
        type: 'error',
        message: 'Por favor, corrige los errores en el formulario',
      });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    

    try {
      await saveTestimonial(formData);
      setAlert({
        type: 'success',
        message:
          '¡Gracias por compartir tu experiencia! Tu testimonio ha sido enviado exitosamente.',
      });
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error inesperado al enviar el testimonio';
      setAlert({
        type: 'error',
        message: `Error al enviar el testimonio: ${errorMessage}`,
      });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = useCallback(() => {
    setShowShareModal(false);
  }, [setShowShareModal]);

  const closeAlert = useCallback(() => {
    if (alert?.type === 'success') {
      closeModal();
    } else {
      setAlert(null);
    }
  }, [alert, closeModal]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showShareModal && !isSubmitting) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showShareModal, isSubmitting, closeModal]);

  if (!showShareModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={e =>
        e.target === e.currentTarget && !isSubmitting && closeModal()
      }
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative transform transition-all duration-300 scale-100 animate-fade-in">
        <AnimatePresence mode="sync">
          {alert && <Alert key="alert" alert={alert} onClose={closeAlert} />}
        </AnimatePresence>

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3
                id="modal-title"
                className="text-2xl font-bold text-gray-800 mb-1"
              >
                Comparte tu Experiencia
              </h3>
              <p id="modal-description" className="text-sm text-gray-600">
                Tu opinión nos ayuda a mejorar nuestros servicios
              </p>
            </div>
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Cerrar modal"
            >
              <i className="fa-solid fa-times text-xl" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmitComment} className="space-y-6" noValidate>
            <FormField label="Calificación" id="rating" required>
              <StarRating
                rating={formData.rating}
                onRatingChange={rating => handleInputChange('rating', rating)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField
              label="Nombre"
              id="name"
              required
              error={fieldErrors.name}
            >
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                disabled={isSubmitting}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-all duration-200 
                  focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none
                  disabled:bg-gray-50 disabled:cursor-not-allowed
                  ${fieldErrors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                `}
                placeholder="Escribe tu nombre completo"
                maxLength={50}
                pattern="[A-Za-zÀ-ÿ\\s]*"
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                aria-invalid={!!fieldErrors.name}
              />
            </FormField>

            <FormField
              label="Comentario"
              id="message"
              required
              error={fieldErrors.message}
            >
              <textarea
                id="message"
                value={formData.message}
                onChange={e => handleInputChange('message', e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                rows={4}
                inputMode="text"
                spellCheck="true"
                className={`
                  w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-none
                  focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none
                  disabled:bg-gray-50 disabled:cursor-not-allowed
                  ${fieldErrors.message ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                `}
                placeholder="Cuéntanos sobre tu experiencia con nuestros servicios..."
                maxLength={500}
                style={{ whiteSpace: 'pre-wrap' }}
                aria-describedby={
                  fieldErrors.message
                    ? 'message-error'
                    : 'message-counter message-instructions'
                }
                aria-invalid={!!fieldErrors.message}
                aria-required="true"
                aria-multiline="true"
              />
              <div className="flex justify-between items-center mt-1">
                <span
                  id="message-instructions"
                  className="text-xs text-gray-500"
                >
                  Puedes incluir espacios y saltos de línea
                </span>
                <span
                  id="message-counter"
                  className={`text-xs transition-colors duration-200 ${
                    formData.message.length > 450
                      ? 'text-rose-600'
                      : 'text-gray-500'
                  }`}
                  aria-live="polite"
                >
                  {formData.message.length}/500 caracteres
                </span>
              </div>
            </FormField>

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 w-4 h-4 text-rose-600 focus:ring-rose-500 focus:ring-2 border-gray-300 rounded disabled:opacity-50"
                  aria-describedby="consent-description"
                />
                <span
                  id="consent-description"
                  className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-200"
                >
                  Acepto que mi dispositivo, IP y ubicación sean recopilados
                  según la{' '}
                  <a
                    href="/privacy"
                    className="text-rose-600 hover:text-rose-700 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 rounded"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    política de privacidad
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || !consent}
                className={`
                  w-full px-6 py-4 font-semibold rounded-lg transition-all duration-300 
                  focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50
                  ${
                    isSubmitting || !consent
                      ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                      : 'bg-rose-600 hover:bg-rose-700 hover:shadow-lg active:transform active:scale-98 text-white'
                  }
                `}
                aria-describedby="submit-status"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <i
                      className="fa-solid fa-spinner fa-spin"
                      aria-hidden="true"
                    />
                    <span>Enviando...</span>
                  </span>
                ) : (
                  'Enviar Testimonio'
                )}
              </button>

              {isSubmitting && (
                <p
                  id="submit-status"
                  className="text-center text-sm text-gray-600"
                  aria-live="polite"
                >
                  Por favor espera mientras procesamos tu testimonio...
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
