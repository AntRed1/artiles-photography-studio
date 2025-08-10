// PrivacyModal.tsx
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getLegalDocuments } from '../services/legalService';

interface PrivacyModalProps {
  showPrivacyModal: boolean;
  setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({
  showPrivacyModal,
  setShowPrivacyModal,
}) => {
  const [privacyContent, setPrivacyContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const documents = await getLegalDocuments();
        const privacyDoc = documents.find(doc => doc.type === 'PRIVACY');

        if (privacyDoc) {
          setPrivacyContent(privacyDoc.content);
        } else {
          setError('No se encontró la política de privacidad.');
        }
      } catch (err) {
        setError('Error al cargar la política de privacidad.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (showPrivacyModal) {
      void fetchPrivacyPolicy();
    }
  }, [showPrivacyModal]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPrivacyModal(false);
      }
    };

    if (showPrivacyModal) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showPrivacyModal, setShowPrivacyModal]);

  // Función para cerrar el modal
  const closeModal = () => {
    setShowPrivacyModal(false);
  };

  // Manejar click en overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Manejar tecla Enter en overlay
  const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeModal();
    }
  };

  if (!showPrivacyModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      role="button"
      aria-labelledby="privacy-modal-title"
      aria-label="Cerrar modal haciendo clic fuera del contenido"
      tabIndex={0}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3
              id="privacy-modal-title"
              className="text-2xl font-bold text-gray-800"
            >
              Política de Privacidad
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Cerrar modal"
              type="button"
            >
              ×
            </button>
          </div>

          <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                  aria-label="Cargando contenido"
                ></div>
                <span className="ml-2 text-gray-600">Cargando...</span>
              </div>
            )}

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                role="alert"
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {!isLoading && !error && privacyContent && (
              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    h1: ({ children, ...props }) => (
                      <h1
                        className="text-3xl font-bold mb-4 text-blue-600 border-b-2 border-blue-100 pb-2"
                        {...props}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2
                        className="text-2xl font-semibold mb-3 text-gray-800 mt-6"
                        {...props}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3
                        className="text-xl font-semibold mb-2 text-gray-700 mt-4"
                        {...props}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children, ...props }) => (
                      <p
                        className="mb-3 text-gray-600 leading-relaxed"
                        {...props}
                      >
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul
                        className="list-disc list-inside mb-4 space-y-1 ml-4"
                        {...props}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-4 space-y-1 ml-4"
                        {...props}
                      >
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-gray-600" {...props}>
                        {children}
                      </li>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong
                        className="font-semibold text-gray-800"
                        {...props}
                      >
                        {children}
                      </strong>
                    ),
                    em: ({ children, ...props }) => (
                      <em className="italic text-gray-500" {...props}>
                        {children}
                      </em>
                    ),
                    hr: ({ ...props }) => (
                      <hr className="my-6 border-gray-300" {...props} />
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="border-l-4 border-blue-300 pl-4 py-2 my-4 bg-blue-50 italic"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, ...props }) => (
                      <code
                        className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                  }}
                >
                  {privacyContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={closeModal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
