import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getLegalDocuments } from '../services/legalService';

interface PrivacyModalProps {
  showPrivacyModal: boolean;
  setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const emojiMap: Record<string, string> = {
  '📜': '📜',
  '🔒': '🔒',
  '🕐': '🕐',
  '💰': '💰',
  '📦': '📦',
  '👥': '👥',
  '👗': '👗',
  '⏰': '⏰',
  '✅': '✅',
  '🏢': '🏢',
  '✍️': '✍️',
};

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
        if (privacyDoc) setPrivacyContent(privacyDoc.content);
        else setError('No se encontró la política de privacidad.');
      } catch (err) {
        setError('Error al cargar la política de privacidad.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (showPrivacyModal) void fetchPrivacyPolicy();
  }, [showPrivacyModal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowPrivacyModal(false);
    };
    if (showPrivacyModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showPrivacyModal, setShowPrivacyModal]);

  if (!showPrivacyModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby="privacy-modal-title"
      aria-modal="true"
    >
      <div className="bg-gray-50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto focus:outline-none animate-fade-in">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3
              id="privacy-modal-title"
              className="text-3xl font-bold text-rose-600"
            >
              Política de Privacidad
            </h3>
            <button
              onClick={() => setShowPrivacyModal(false)}
              aria-label="Cerrar modal"
              type="button"
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="prose prose-lg max-w-none">
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"
                  aria-label="Cargando contenido"
                />
                <span className="ml-3 text-gray-600 text-lg">Cargando...</span>
              </div>
            )}

            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6"
                role="alert"
              >
                <strong className="font-semibold">Error:</strong> {error}
              </div>
            )}

            {!isLoading && !error && privacyContent && (
              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    h1: ({ children }: any) => (
                      <h1 className="text-3xl font-bold mb-4 text-rose-600 border-b-2 border-rose-600/20 pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }: any) => (
                      <h2 className="text-2xl font-semibold mb-3 text-gray-800 mt-6">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }: any) => (
                      <h3 className="text-xl font-semibold mb-2 text-gray-700 mt-4">
                        {children}
                      </h3>
                    ),
                    p: ({ children }: any) => (
                      <p className="mb-3 text-gray-600 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }: any) => (
                      <ul className="list-disc list-inside mb-4 space-y-1 pl-4">
                        {children}
                      </ul>
                    ),
                    li: ({ children }: any) => (
                      <li className="text-gray-600 flex items-start">
                        <span className="mr-2 text-rose-600">•</span>
                        {children}
                      </li>
                    ),
                    strong: ({ children }: any) => (
                      <strong className="font-semibold text-gray-800">
                        {children}
                      </strong>
                    ),
                    hr: () => <hr className="my-6 border-gray-300" />,
                    input: ({ type, checked, ...props }: any) => {
                      if (type === 'checkbox') {
                        return (
                          <span className="inline-flex items-center mr-2">
                            <span
                              className={`text-2xl ${checked ? 'text-rose-600' : 'text-gray-400'}`}
                            >
                              {checked ? '✓' : '☐'}
                            </span>
                          </span>
                        );
                      }
                      return <input type={type} {...props} />;
                    },
                    em: ({ children }: any) => (
                      <em className="italic text-gray-500">{children}</em>
                    ),
                    code: ({ children }: any) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ),

                    // TEXT handler — usar `any` para evitar conflictos de tipos al propagar props SVG/HTML
                    text: (props: any) => {
                      const node = props?.node as any;
                      const value =
                        typeof node?.value === 'string' ? node.value : '';
                      if (!value) return <span />;

                      // crear regex seguro con los emojis del mapa
                      const emojis = Object.keys(emojiMap)
                        .map(escapeRegExp)
                        .join('|');
                      const regex = new RegExp(emojis, 'g');

                      const parts = value.split(regex);
                      const matches = value.match(regex) || [];
                      const childrenArr: React.ReactNode[] = [];

                      for (let i = 0; i < parts.length; i++) {
                        if (parts[i]) childrenArr.push(parts[i]);
                        if (matches[i]) {
                          childrenArr.push(
                            <span
                              key={`emoji-${i}`}
                              className="inline-block mr-2 text-lg"
                            >
                              {emojiMap[matches[i]] ?? matches[i]}
                            </span>
                          );
                        }
                      }

                      // NO propagar props originales sobre <span> — evita incompatibilidades de tipo
                      return <span>{childrenArr}</span>;
                    },
                  }}
                >
                  {privacyContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowPrivacyModal(false)}
              type="button"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-lg"
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
