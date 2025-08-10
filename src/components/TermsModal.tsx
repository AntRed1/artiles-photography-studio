// TermsModal.tsx
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getLegalDocuments } from '../services/legalService';

interface TermsModalProps {
  showTermsModal: boolean;
  setShowTermsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TermsModal: React.FC<TermsModalProps> = ({
  showTermsModal,
  setShowTermsModal,
}) => {
  const [termsContent, setTermsContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const documents = await getLegalDocuments();
        const termsDoc = documents.find(doc => doc.type === 'TERMS');
        if (termsDoc) {
          setTermsContent(termsDoc.content);
        } else {
          setError('No se encontraron los términos y condiciones.');
        }
      } catch (err) {
        setError('Error al cargar los términos y condiciones.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (showTermsModal) {
      void fetchTerms();
    }
  }, [showTermsModal]);

  if (!showTermsModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Términos y Condiciones
            </h3>
            <button
              onClick={() => setShowTermsModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>

          <div className="prose prose-sm max-w-none overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Cargando...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {!isLoading && !error && termsContent && (
              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    // Personalizar el renderizado de elementos específicos
                    h1: ({ children, ...props }) => (
                      <h1
                        className="text-3xl font-bold mb-4 text-blue-600"
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
                        className="list-disc list-inside mb-4 space-y-1"
                        {...props}
                      >
                        {children}
                      </ul>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-gray-600 ml-2" {...props}>
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
                    hr: ({ ...props }) => (
                      <hr className="my-6 border-gray-300" {...props} />
                    ),
                    // Styling para checkboxes
                    input: ({ type, ...props }) => {
                      if (type === 'checkbox') {
                        return (
                          <input
                            type={type}
                            className="mr-2 transform scale-125"
                            {...props}
                          />
                        );
                      }
                      return <input type={type} {...props} />;
                    },
                  }}
                >
                  {termsContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
